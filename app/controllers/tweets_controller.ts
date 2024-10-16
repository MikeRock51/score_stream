import type { HttpContext } from '@adonisjs/core/http'
import TwitterClient from '../Clients/twitter_client.js'

export default class TweetsController {
  constructor(private twitterClient = TwitterClient) {}

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
}
