import env from '#start/env'
import { defineConfig } from '@rlanz/bull-queue'

export default defineConfig({
  defaultConnection: {
    host: env.get('QUEUE_REDIS_HOST'),
    port: env.get('QUEUE_REDIS_PORT'),
    password: env.get('QUEUE_REDIS_PASSWORD'),
  },

  queueNames: ['default', 'match'],

  queue: {},

  worker: {
    concurrency: 4,
  },

  jobs: {
    /*
    |--------------------------------------------------------------------------
    | Default Job Attempts
    |--------------------------------------------------------------------------
    |
    | The default number of attempts after which the job will be marked as
    | failed. You can also set the number of attempts on individual jobs
    | as well.
    |
    | @see https://docs.bullmq.io/guide/retrying-failing-jobs
    |
    */
    attempts: 5,

    /*
    |--------------------------------------------------------------------------
    | Auto-Removal of Jobs
    |--------------------------------------------------------------------------
    |
    | Numbers of jobs to keep in the completed and failed queues before they
    | are removed. This is important to keep the size of these queues in
    | control. Set the value to false to disable auto-removal.
    |
    | @see https://docs.bullmq.io/guide/queues/auto-removal-of-jobs
    |
    */
    removeOnComplete: 1,
    removeOnFail: 10,
    backoff: {
      type: 'exponential',
      delay: 5000, // 1 hour in milliseconds
    },
  },
})

const workers = [
  {
    name: 'match-worker',
    concurrency: 12,
    queues: ['match'],
  },
  {
    name: 'default-worker',
    concurrency: 2,
    queues: ['default'],
  },
]

export { workers }
