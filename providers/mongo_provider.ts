import type { ApplicationService } from '@adonisjs/core/types'
import { connectMongoDB } from '#config/database'

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the top level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
| @example:
|
| public async ready () {
|   const Database = this.app.container.resolveBinding('Adonis/Lucid/Database')
|   const Event = this.app.container.resolveBinding('Adonis/Core/Event')
|   Event.on('db:query', Database.prettyPrint)
| }
|
*/

export default class MongoProvider {
  constructor(protected app: ApplicationService) {}

  public async register() {
    const mongoConnection = await connectMongoDB()

    this.app.container.singleton('Mongoose' as any, () => {
      // mongoConnection?.plugin(require('mongoose-paginate-v2'));
      return mongoConnection
    })
    // Register your own bindings
  }

  public async boot() {}

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
    // await this.app.container.use('Mongoose').disconnect();
  }
}
