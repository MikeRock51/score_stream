// import Queue from '@rlanz/bull-queue/services/main'
import TheSportsClient, { ApiQueryParams } from '../Clients/the_sports_client.js'
import { CompetitionModel } from '../Models/Competition/competition.js'

class CompetitionServiceClass {
  constructor(
    private theSportsClient = TheSportsClient,
    public competitionModel = CompetitionModel
  ) {}

  public async pullCompetitionsFromAPI(query: ApiQueryParams = {}) {
    const competitions = await this.theSportsClient.getDataFromApi(
      this.theSportsClient.endpoints.competitions,
      query
    )

    for (const competition of competitions) {
      await this.competitionModel.create(competition)

      console.log(`Competition ${competition.id} created`)
    }
  }
}

const CompetitionService = new CompetitionServiceClass()
export default CompetitionService
