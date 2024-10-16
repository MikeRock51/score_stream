/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const TweetsController = () => import('#controllers/tweets_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('tweet', [TweetsController, 'tweetTest'])
