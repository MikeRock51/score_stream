import Queue from '@rlanz/bull-queue/services/main'
import MatchJob from '../Jobs/match_job.js'
import { QueryDB } from '../Clients/mongo_client.js'
import TheSportsClient, { ApiQueryParams } from '../Clients/the_sports_client.js'
import TwitterClient from '../Clients/twitter_client.js'
import { MatchModel } from '../Models/Match/match.js'

class MatchServiceClass {
  constructor(
    private queryDB = QueryDB,
    private theSportsClient = TheSportsClient,
    private twitterClient = TwitterClient,
    public matchModel = MatchModel
  ) {}

  public matchSelect = {
    home_scores: 1,
    away_scores: 1,
    status_id: 1,
    home_team: 1,
    away_team: 1,
    home_team_id: 1,
    away_team_id: 1,
    competition: 1,
    competition_id: 1,
    season_id: 1,
    round: 1,
    streak: 1,
  }

  public async getMatchFromDB(query: Record<string, any> = {}) {
    const matches = await this.queryDB('matches', query, { select: this.matchSelect })

    return matches
  }

  public async processWebsocketUpdate(payload: any) {
    for (const data of payload) {
      if (data.score) {
        console.log('Processing live scores for', data.id)

        Queue.dispatch(
          MatchJob,
          {
            method: this.processLiveScores.name,
            args: [data],
          }
          // { priority: 1 }
        )
        // await this.processLiveScores(data, dbMatch[0])
      }

      // if (data.stats) {
      //   Queue.dispatch(
      //     MatchJob,
      //     {
      //       method: this.processLiveStats.name,
      //       args: [data.id, data.stats],
      //     },
      //     { priority: 3 }
      //   )
      //   // await this.processLiveStats(data.id, data.stats);
      // }

      // if (data.incidents) {
      //   Queue.dispatch(
      //     MatchJob,
      //     {
      //       method: this.processLiveIncidents.name,
      //       args: [data.id, data.incidents],
      //     },
      //     { priority: 2 }
      //   )
      //   // await this.processLiveIncidents(data.id, data.incidents)
      // }
    }
  }

  public async processLiveScores(data: { id: string; score: any[] }): Promise<void> {
    const { id, score } = data

    const dbMatch = await this.matchModel.findOne({ id }).select(this.matchSelect)

    if (!dbMatch || !dbMatch.home_team?.name || !dbMatch.away_team?.name) {
      return
    }

    if (!this.theSportsClient.topCompetitions.includes(dbMatch.competition_id)) {
      console.log('Not one of us. Moving on...')
      return
    }

    try {
      const updateData = this.prepareUpdateData(dbMatch, score)
      if (!updateData) return

      // console.log(updateData)

      await this.twitterClient.v2.tweet(
        `${updateData.title}\n\n${updateData.body}\n\n${dbMatch.competition?.name}`
      )
      console.log(`Tweet sent for match ${dbMatch.home_team?.name} - ${dbMatch.away_team?.name}`)

      // await this.updateMatchAndNotify(id, updateData, score)
    } catch (error) {
      console.error(`Error processing websocket data for ${id}`, error)
    }
  }

  private prepareUpdateData(dbMatch: any, score: any[]) {
    let notification: any = null

    if (this.isStatusChanged(dbMatch, score)) {
      notification = this.handleStatusChange(dbMatch, score)
    } else if (this.isScoreChanged(dbMatch, score)) {
      notification = this.createScoreChangeNotification(dbMatch, score)
    } else if (this.isRedCardChanged(dbMatch, score)) {
      notification = this.createRedCardNotification(dbMatch, score)
    } else {
      return null
    }

    return notification
  }

  private isStatusChanged(dbMatch: any, score: any[]): boolean {
    return dbMatch.status_id !== score[1] && score[1] > dbMatch.status_id
  }

  private isScoreChanged(dbMatch: any, score: any[]): boolean {
    const { homeScore, awayScore, dbHomeScore, dbAwayScore } = this.getScore(dbMatch, score)

    return homeScore !== dbHomeScore || awayScore !== dbAwayScore
  }

  private getScore(dbMatch: any, score: any[]) {
    const isPenaltyShootout = score[1] === 7
    const isOvertime = score[1] === 5

    const homeScore = isPenaltyShootout ? score[2][6] : isOvertime ? score[2][5] : score[2][0]
    const awayScore = isPenaltyShootout ? score[3][6] : isOvertime ? score[3][5] : score[3][0]

    const dbHomeScore = isPenaltyShootout
      ? dbMatch.home_scores[6]
      : isOvertime
        ? dbMatch.home_scores[5]
        : dbMatch.home_scores[0]

    const dbAwayScore = isPenaltyShootout
      ? dbMatch.away_scores[6]
      : isOvertime
        ? dbMatch.away_scores[5]
        : dbMatch.away_scores[0]

    return { homeScore, awayScore, dbHomeScore, dbAwayScore, isOvertime, isPenaltyShootout }
  }

  private isRedCardChanged(dbMatch: any, score: any[]): boolean {
    return dbMatch.home_scores[2] !== score[2][2] || dbMatch.away_scores[2] !== score[3][2]
  }

  private handleStatusChange(dbMatch: any, score: any[]) {
    if ([0, 1, 11, 13].includes(score[1])) return null

    const { homeScore, awayScore } = this.getScore(dbMatch, score)

    const homeTeamName = dbMatch.home_team?.name
    const awayTeamName = dbMatch.away_team?.name

    const title =
      this.theSportsClient.matchStatusEnum[
        score[1] as keyof typeof this.theSportsClient.matchStatusEnum
      ]
    const body = `${homeTeamName} ${homeScore} - ${awayScore} ${awayTeamName}`

    const notification = {
      title,
      body,
      image: dbMatch.competition?.logo,
    }

    return notification
  }

  private createScoreChangeNotification(dbMatch: any, score: any[]): any {
    const { homeScore, awayScore, dbHomeScore, dbAwayScore, isPenaltyShootout } = this.getScore(
      dbMatch,
      score
    )

    const isHomeTeamScoreChange = dbHomeScore !== homeScore

    const isScoreCorrection = isHomeTeamScoreChange
      ? dbHomeScore > homeScore
      : dbAwayScore > awayScore

    const title = isScoreCorrection
      ? `Score Correction${isPenaltyShootout ? ' (PENALTY SHOOTOUT)' : ''}`
      : `Goal${isPenaltyShootout ? ' (PENALTY SHOOTOUT) 🥅🎯' : '🥅⚽'}`

    const homeTeamName = dbMatch.home_team.name
    const awayTeamName = dbMatch.away_team.name

    const body = `${homeTeamName} ${isHomeTeamScoreChange && !isScoreCorrection ? `[${homeScore}]` : homeScore} - ${isHomeTeamScoreChange || isScoreCorrection ? awayScore : `[${awayScore}]`} ${awayTeamName}`

    return {
      title,
      body,
      image: isHomeTeamScoreChange ? dbMatch.home_team?.logo : dbMatch.away_team?.logo,
    }
  }

  private createRedCardNotification(dbMatch: any, score: any[]): any {
    const isHomeTeamRedCard = dbMatch.home_scores[2] !== score[2][2]

    const { homeScore, awayScore } = this.getScore(dbMatch, score)

    const homeTeamName = dbMatch.home_team.name
    const awayTeamName = dbMatch.away_team.name

    const title = `Red Card (${isHomeTeamRedCard ? homeTeamName : awayTeamName}) 🟥`
    const body = `${homeTeamName} ${homeScore} - ${awayScore} ${awayTeamName}`

    return {
      title,
      body,
      image: isHomeTeamRedCard ? dbMatch.home_team?.logo : dbMatch.away_team?.logo,
    }
  }

  public async pullMatchesFromAPIJob(query: ApiQueryParams = {}) {
    Queue.dispatch(MatchJob, { method: this.pullMatchesFromAPI.name, args: [query] })
  }

  public async pullMatchesFromAPI(query: ApiQueryParams = {}) {
    try {
      const matches = await this.theSportsClient.getDataFromApi(
        this.theSportsClient.endpoints.matches,
        query
      )

      for (const match of matches) {
        if (match.status_id >= 8) continue

        try {
          await this.matchModel.create(match)
          console.log(`Match ${match.id} created`)
        } catch (error) {
          console.error('Error creating match:', error.message)
        }
      }
    } catch (error) {
      console.error('Error pulling matches:', error.message)
    }
    console.log('done')
  }
}

const MatchService = new MatchServiceClass()
export default MatchService
