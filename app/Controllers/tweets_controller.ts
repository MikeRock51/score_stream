import type { HttpContext } from '@adonisjs/core/http'
import TwitterClient from '../Clients/twitter_client.js'
import MatchService from '../Services/match_service.js'
import Queue from '@rlanz/bull-queue/services/main'
import MatchJob from '../Jobs/match_job.js'
import Env from '#start/env'

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

  public async processWebsocketUpdate({ response }: HttpContext) {
    const environment = Env.get('NODE_ENV')

    if (environment !== 'development') {
      return response.badRequest('Development environment only!')
    }
    const payload: any = [
      {
        id: '965mkyhyygxlr1g',
        score: ['965mkyhyygxlr1g', 7, [1, 0, 0, 0, 0, 2, 1], [1, 0, 1, 0, 0, 2, 2], 1728557865, ''],
      },
    ]
    await this.matchService.processWebsocketUpdate(payload)

    response.status(200).send({
      message: 'Jobs queued successfully!',
    })
  }

  public async jobTest({ response }: HttpContext) {
    const matches = await this.matchService.getMatchFromDB({ id: '965mkyhyygxlr1g' })
    // this.matchService.testJob()

    // Queue.dispatch(
    //   MatchJob,
    //   {
    //     method: this.matchService.testJob.name,
    //     args: [],
    //   }
    //   // { priority: 1 }
    // )

    response.status(200).send({
      status: true,
      message: 'Job queued successfully!',
      data: matches,
    })
  }
}
