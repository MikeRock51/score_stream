import type { HttpContext } from '@adonisjs/core/http'

import MatchService from '../Services/match_service.js'
import { ApiQueryParams } from '../Clients/the_sports_client.js'

export default class MatchesController {
  constructor(private matchService = MatchService) {}

  public async pullMatchesFromAPI({ request, response }: HttpContext) {
    const query: ApiQueryParams = request.body()

    try {
      await this.matchService.pullMatchesFromAPIJob(query)

      return response.status(200).json({
        status: 'success',
        message: 'Matches pulled from API',
      })
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }

  public async pullMatchesByDate({ request, response }: HttpContext) {
    const query = request.qs()

    try {
      await this.matchService.pullMatchesByDateJob(query)

      return response.status(200).json({
        status: 'success',
        message: 'Matches pulled successfully',
      })
    } catch (error) {
      return response.status(500).json({
        status: 'failed',
        message: error.message,
      })
    }
  }
}
