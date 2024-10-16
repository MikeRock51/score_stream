import type { ApplicationService } from '@adonisjs/core/types'
import redis from '@adonisjs/redis/services/main'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {
    const Redis = redis.connection('main')

    Redis.on('connect', () => {
      console.log('Redis connected successfully! ✅✅✅')
    })
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
