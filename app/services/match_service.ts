import queue from '@rlanz/bull-queue/services/main'
import MatchJob from '../jobs/match_job.js'

class MatchServiceClass {
  constructor() {}

  public async processWebsocketUpdate(payload: any) {
    for (const data of payload) {
      if (data.score) {
        queue.dispatch<typeof MatchJob>(
          MatchJobKey,
          {
            method: 'testTheJob', // Use the string literal instead of this.testTheJob.name
            args: ['Running, running, running!'],
          },
          { priority: 1 }
        )

        // await this.processLiveScores(data);
      }
    }
  }

  public testJob() {
    console.log('Testing the job')
  }

  public testTheJob(info: string) {
    console.log(info)
  }

  //   public async processLiveScores(data: any) {
  //     const { id, score } = data

  //     try {
  //       const dbMatch = await this.matchModel.findOne({ id }).select({
  //         home_scores: 1,
  //         away_scores: 1,
  //         status_id: 1,
  //         home_team: 1,
  //         away_team: 1,
  //         home_team_id: 1,
  //         away_team_id: 1,
  //         competition: 1,
  //         season_id: 1,
  //         round: 1,
  //         streak: 1,
  //       })

  //       if (!dbMatch) {
  //         // Job
  //         // await this.pullSingleMatch(id);
  //         return
  //       }

  //       let notificationBody
  //       let notificationTitle
  //       let image
  //       const set: KeyValuePair = {}

  //       if (dbMatch.status_id !== score[1]) {
  //         if ([0, 1, 11, 13].includes(score[1])) return

  //         if (score[1] === 8) {
  //           switch (dbMatch.status_id) {
  //             case 4:
  //               set.status = 'FT'
  //               break
  //             case 5:
  //               set.status = 'AET'
  //               break
  //             case 7:
  //               set.status = 'PEN'
  //               break
  //           }

  //           await this.standingsService.updateTeamStreak(
  //             dbMatch.season_id,
  //             dbMatch.round.stage_id,
  //             dbMatch.round.group_num,
  //             [
  //               { id: dbMatch.home_team_id, outcome: this.processMatchOutcome(score, 'H') },
  //               { id: dbMatch.away_team_id, outcome: this.processMatchOutcome(score, 'A') },
  //             ]
  //           )
  //         }

  //         notificationTitle = `${dbMatch.home_team.short_name || dbMatch.home_team.name} - ${dbMatch.away_team.short_name || dbMatch.away_team.name}`
  //         notificationBody = `${this.theSportsService.matchStatusEnum[score[1]]}: ${score[2][0]} - ${score[3][0]}`
  //         image = dbMatch.competition?.logo
  //       } else if (
  //         dbMatch.home_scores[0] !== score[2][0] ||
  //         dbMatch.home_scores[5] !== score[2][5] ||
  //         dbMatch.home_scores[6] !== score[2][6]
  //       ) {
  //         notificationTitle = `${dbMatch.home_team.short_name || dbMatch.home_team.name} - ${dbMatch.away_team.short_name || dbMatch.away_team.name}`
  //         image = dbMatch.home_team?.logo
  //         if (
  //           dbMatch.home_scores[0] > score[2][0] ||
  //           dbMatch.home_scores[5] > score[2][5] ||
  //           dbMatch.home_scores[6] > score[2][6]
  //         ) {
  //           notificationBody = `Score Correction: ${score[2][0]} - ${score[3][0]}`
  //         } else {
  //           notificationBody = `Goal: [${score[2][0]}] - ${score[3][0]}`
  //         }
  //       } else if (
  //         dbMatch.away_scores[0] !== score[3][0] ||
  //         dbMatch.away_scores[5] !== score[3][5] ||
  //         dbMatch.away_scores[6] !== score[3][6]
  //       ) {
  //         notificationTitle = `${dbMatch.home_team.short_name || dbMatch.home_team.name} - ${dbMatch.away_team.short_name || dbMatch.away_team.name}`
  //         if (
  //           dbMatch.away_scores[0] > score[3][0] ||
  //           dbMatch.away_scores[5] > score[3][5] ||
  //           dbMatch.away_scores[6] > score[3][6]
  //         ) {
  //           notificationBody = `Score Correction: ${score[2][0]} - ${score[3][0]}`
  //         } else {
  //           notificationBody = `Goal: ${score[2][0]} - [${score[3][0]}]`
  //         }
  //         image = dbMatch.away_team?.logo
  //       } else if (dbMatch.home_scores[2] !== score[2][2]) {
  //         notificationTitle = `${dbMatch.home_team.short_name || dbMatch.home_team.name} - ${dbMatch.away_team.short_name || dbMatch.away_team.name}`
  //         notificationBody = `Red Card: ${score[2][0]} - ${score[3][0]}`
  //         image = dbMatch.home_team?.logo
  //       } else if (dbMatch.away_scores[2] !== score[3][2]) {
  //         notificationTitle = `${dbMatch.home_team.short_name || dbMatch.home_team.name} - ${dbMatch.away_team.short_name || dbMatch.away_team.name}`
  //         notificationBody = `Red Card: ${score[2][0]} - ${score[3][0]}`
  //         image = dbMatch.away_team?.logo
  //       } else return

  //       // await this.processStatusNotification(id, score);
  //       await Promise.all([
  //         axios.post(`${Env.get('WEBSOCKET_URL')}/match`, [data]),
  //         this.matchModel.updateOne(
  //           { id },
  //           {
  //             $set: {
  //               home_scores: score[2],
  //               away_scores: score[3],
  //               kickoff_timestamp: score[4],
  //               status_id: score[1],
  //               scoreUpdatedAt: Math.floor(Date.now() / 1000),
  //               ...set,
  //             },
  //           }
  //         ),
  //       ])

  //       await this.processMatchNotification({
  //         match_id: id,
  //         title: notificationTitle,
  //         body: notificationBody,
  //         image: `${image}!w50`,
  //         url: `spotip://match/${id}`,
  //       })
  //       console.log(`Match ${id} scores updated successfully!`)
  //     } catch (error) {
  //       console.error(`Error processing websocket data for ${data.id}`, error.message)
  //     }
  //   }
}

const MatchService = new MatchServiceClass()
export default MatchService
