import { MatchJobPayload } from '../app/jobs/match_job.js'

declare module '@rlanz/bull-queue' {
  interface JobsList {
    '#app/job/match_job': MatchJobPayload<any>
  }
}
