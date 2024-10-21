/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const TweetsController = () => import('../app/Controllers/tweets_controller.js')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('tweet', [TweetsController, 'tweetTest'])

router.get('job', [TweetsController, 'jobTest'])

router.patch('webSocket', [TweetsController, 'processWebsocketUpdate'])
