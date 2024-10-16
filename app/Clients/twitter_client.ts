import { TwitterApi } from 'twitter-api-v2'
import env from '#start/env'

const bearerToken = env.get('BEARER_TOKEN')
if (!bearerToken) {
  throw new Error('BEARER_TOKEN is not defined')
}
const TwitterClient = new TwitterApi({
  appKey: env.get('API_KEY') as string,
  appSecret: env.get('API_SECRET') as string,
  accessToken: env.get('ACCESS_TOKEN') as string,
  accessSecret: env.get('ACCESS_SECRET') as string,
})

export default TwitterClient

// await twitterClient.v2.tweet('Testing, testing, rubber ducky...')
