import MatchService from '#services/match_service'
import { Job } from '@rlanz/bull-queue'

interface MatchJobPayload {
  method: string
  // message: string
}

export default class MatchJob extends Job {
  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url
  }

  matchService = MatchService

  /**
   * Base Entry point
   */
  async handle(payload: MatchJobPayload) {
    ;((await this.matchService) as any)[payload.method]()
  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue(payload: MatchJobPayload) {}
}
