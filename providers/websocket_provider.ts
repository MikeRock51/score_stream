import type { ApplicationService } from '@adonisjs/core/types'
import mqtt from 'mqtt'
import Env from '#start/env'
import MatchService from '../app/Services/match_service.js'

export default class WebsocketProvider {
  constructor(
    protected app: ApplicationService,
    private matchService = MatchService
  ) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {
    if (this.isMainAppProcess()) {
      await this.initializeWebsocket()
    } else {
      console.log('Skipping WebsocketProvider initialization for non-main app process')
    }
  }

  private isMainAppProcess(): boolean {
    const runningProcess = process.argv[1].split('/').at(-1)
    return runningProcess !== 'ace'
    // && process.env.NODE_ENV !== 'development'
    // return false
  }

  private async initializeWebsocket() {
    const client = mqtt.connect(`mqtts://${Env.get('THESPORTSWEBSOCKETURL')}:8883`, {
      username: Env.get('THESPORTSUSER'),
      password: Env.get('THESPORTSSECRET'),
      rejectUnauthorized: false,
    })

    client.on('connect', async () => {
      console.log('Websocket connected successfully!')

      const topic = Env.get('WEBSOCKETTOPIC')
      if (topic) {
        client.subscribe(topic, (err) => {
          if (!err) {
            console.log(`Successfully subscribed to football topic!`)
          } else {
            console.error('Subscription error:', err)
          }
        })
      } else {
        console.error('Websocket topic is not defined')
      }
    })

    client.on('message', (_, message) => {
      // const matchService = this.app.container.use('App/Match/MatchService')
      try {
        // matchService.MatchService.processWebsocketUpdate(JSON.parse(message.toString()))
        this.matchService.processWebsocketUpdate(JSON.parse(message.toString()))
      } catch (error) {
        console.error('Error processing message:', error.message)
      }
    })

    client.on('error', (error) => {
      console.error('MQTT error:', error)
    })

    client.on('close', () => {
      console.log('Connection to MQTT broker closed')
      client.reconnect()
    })

    client.on('disconnect', () => {
      console.log('Connection to MQTT broker disconnected')
      client.reconnect()
    })

    // Make the MQTT client available globally
    this.app.container.singleton('Websocket/Client' as any, () => client)
  }

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
