import type { HttpContext } from '@adonisjs/core/http'
import TwitterClient from '../Clients/twitter_client.js'
import MatchService from '#services/match_service'

export default class TweetsController {
  constructor(
    private twitterClient = TwitterClient,
    private matchService = MatchService
  ) {}

  public async tweetTest({ response }: HttpContext) {
    try {
      await this.twitterClient.v2.tweet('Testing, testing, rubber ducky...')

      response.status(200).send({
        status: true,
        message: 'Tweet sent successfully!',
      })
    } catch (error) {
      console.error(error)
      response.badRequest({
        status: false,
        message: error.message,
      })
    }
  }

  public async jobTest({ response }: HttpContext) {
    this.matchService.testJob()

    response.status(200).send({
      status: true,
      message: 'Job queued successfully!',
    })
  }
}
