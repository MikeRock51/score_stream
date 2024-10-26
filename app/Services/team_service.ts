// import Queue from '@rlanz/bull-queue/services/main'
import TheSportsClient, { ApiQueryParams } from '../Clients/the_sports_client.js'
import { TeamModel } from '../Models/Team/team.js'

class TeamServiceClass {
  constructor(
    private theSportsClient = TheSportsClient,
    public teamModel = TeamModel
  ) {}

  public async pullTeamsFromAPI(query: ApiQueryParams = {}) {
    const teams = await this.theSportsClient.getDataFromApi(
      this.theSportsClient.endpoints.teams,
      query
    )

    for (const team of teams) {
      await this.teamModel.create(team)

      console.log(`Team ${team.id} created`)
    }
  }
}

const TeamService = new TeamServiceClass()
export default TeamService
