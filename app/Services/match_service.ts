import Queue from '@rlanz/bull-queue/services/main'
import MatchJob from '../Jobs/match_job.js'
import { QueryDB } from '../Clients/mongo_client.js'
import TheSportsClient from '../Clients/the_sports_client.js'

class MatchServiceClass {
  constructor(
    private queryDB = QueryDB,
    private theSportsClient = TheSportsClient
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
        // Queue.dispatch(
        //   MatchJob,
        //   {
        //     method: this.processLiveScores.name,
        //     args: [data],
        //   },
        //   { priority: 1 }
        // )
        await this.processLiveScores(data)
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

    try {
      const dbMatch = await this.getMatchFromDB({ id })
      if (!dbMatch) return

      // console.log(dbMatch)

      const updateData = this.prepareUpdateData(dbMatch[0], score)
      if (!updateData) return

      console.log(updateData)

      // await this.updateMatchAndNotify(id, updateData, score)
    } catch (error) {
      console.error(`Error processing websocket data for ${id}`, error)
    }
  }

  private prepareUpdateData(dbMatch: any, score: any[]): { set: any; notification: any } | null {
    const set: any = {}
    let notification: any = null

    if (this.isStatusChanged(dbMatch, score)) {
      notification = this.handleStatusChange(dbMatch, score)
    }
    // } else if (this.isScoreChanged(dbMatch, score)) {
    //   notification = this.createScoreChangeNotification(dbMatch, score)
    // } else if (this.isRedCardChanged(dbMatch, score)) {
    //   notification = this.createRedCardNotification(dbMatch, score)
    // } else {
    //   return null
    // }

    // set.home_scores = score[2]
    // set.away_scores = score[3]
    // set.kickoff_timestamp = score[4]
    // set.status_id = score[1]
    // set.scoreUpdatedAt = Math.floor(Date.now() / 1000)

    return { set, notification }
  }

  private isStatusChanged(dbMatch: any, score: any[]): boolean {
    return dbMatch.status_id !== score[1]
  }

  private handleStatusChange(dbMatch: any, score: any[]) {
    if ([0, 1, 11, 13].includes(score[1])) return null

    const isPenaltyShootout = score[1] === 7

    const homeScore = isPenaltyShootout ? score[2][6] : score[2][0] + score[2][5]
    const awayScore = isPenaltyShootout ? score[3][6] : score[3][0] + score[3][5]

    const homeTeamName = dbMatch.home_team.name
    const awayTeamName = dbMatch.away_team.name

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
}

const MatchService = new MatchServiceClass()
export default MatchService
