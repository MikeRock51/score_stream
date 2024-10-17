import MatchService from '#services/match_service'
import { Job } from '@rlanz/bull-queue'

type MatchServiceMethods = keyof typeof MatchService

export interface MatchJobPayload<T extends MatchServiceMethods> {
  method: T
  args: Parameters<(typeof MatchService)[T]>
}

export default class MatchJob extends Job {
  constructor(
    public job: Job,
    private matchService = MatchService
  ) {
    super()
  }

  static get $$filepath() {
    return import.meta.url
  }

  async handle<T extends MatchServiceMethods>(payload: MatchJobPayload<T>) {
    const { method, args } = payload
    const job = this.job
    try {
      this.logger.info(`${job.getId()} - Job Match.${method} started`)
      await (this.matchService[method] as Function)(...args)
      this.logger.info(`${job.getId()} - Job Match.${method} ended`)
    } catch (error: any) {
      this.logger.error(`${job.getId()} - Job Match.${method} error`)
      error.message = `${job.getId()} - Job Match.${method} error with ${args} ` + error.message
      console.error(error)
    }
  }

  async rescue<T extends MatchServiceMethods>(payload: MatchJobPayload<T>) {}
}

export const MatchJobKey = '#app/job/match_job'
