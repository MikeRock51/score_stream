import type { HttpContext } from '@adonisjs/core/http'

import CompetitionService from '../Services/competition_service.js'
import { ApiQueryParams } from '../Clients/the_sports_client.js'

export default class CompetitionsController {
  constructor(private competitionService = CompetitionService) {}

  public pullCompetitionsFromAPI({ request, response }: HttpContext) {
    const query: ApiQueryParams = request.body()

    try {
      this.competitionService.pullCompetitionsFromAPI(query)
      return response.status(200).json({
        status: 'success',
        message: 'Competitions pulled from API',
      })
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }
}
