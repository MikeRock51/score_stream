import type { HttpContext } from '@adonisjs/core/http'

import TeamService from '../Services/team_service.js'
import { ApiQueryParams } from '../Clients/the_sports_client.js'

export default class TeamsController {
  constructor(private teamService = TeamService) {}

  public pullTeamsFromAPI({ request, response }: HttpContext) {
    const query: ApiQueryParams = request.body()

    try {
      this.teamService.pullTeamsFromAPI(query)
      return response.status(200).json({
        status: 'success',
        message: 'Teams pulled from API',
      })
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }
}
