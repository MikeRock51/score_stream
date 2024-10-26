import { TeamModel } from '../../Team/team.js'
import { CompetitionModel } from '../../Competition/competition.js'
import TheSportsClient from '../../../Clients/the_sports_client.js'

class MatchHelpers {
  constructor(
    private theSportsClient = TheSportsClient,
    private competitionModel = CompetitionModel,
    private teamModel = TeamModel
  ) {}

  public async pullCompetition(id: string) {
    try {
      const competition = await this.theSportsClient.getDataFromApi(
        this.theSportsClient.endpoints.competitions,
        {
          uuid: id,
        }
      )

      if (!competition) return

      const dbCompetition = await this.competitionModel.create(competition[0])
      console.log(`competition ${competition[0].name} pulled successfully`)

      return dbCompetition
    } catch (error) {
      console.error('Error pulling competition:', error.message)
    }
  }

  public async pullTeam(id: string) {
    try {
      const team = await this.theSportsClient.getDataFromApi(this.theSportsClient.endpoints.teams, {
        uuid: id,
      })

      if (!team) return

      const dbTeam = await this.teamModel.create(team[0])

      console.log(`Team ${team[0].name} pulled successfully`)

      return dbTeam
    } catch (error) {
      console.error('Error pulling team:', error.message)
    }
  }
}

export default new MatchHelpers()
