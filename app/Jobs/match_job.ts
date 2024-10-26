import MatchService from '../Services/match_service.js'
import { Job } from '@rlanz/bull-queue'

interface MatchJobPayload {
  method: string
  args: any[]
  // message: string
}

export default class MatchJob extends Job {
  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url
  }

  public queue = 'match'

  matchService = MatchService

  /**
   * Base Entry point
   */
  async handle(payload: MatchJobPayload) {
    try {
      const method = (
        this.matchService[payload.method as keyof typeof this.matchService] as Function
      ).bind(this.matchService)
      await method(...payload.args)
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue() {}
}
