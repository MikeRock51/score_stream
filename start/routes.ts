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
const MatchesController = () => import('../app/Controllers/matches_controller.js')
const CompetitionController = () => import('../app/Controllers/competition_controller.js')
const TeamController = () => import('../app/Controllers/team_controller.js')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('tweet', [TweetsController, 'tweetTest'])

router.get('job', [TweetsController, 'jobTest'])

router.patch('webSocket', [TweetsController, 'processWebsocketUpdate'])

router
  .group(() => {
    router.post('/data/pull', [MatchesController, 'pullMatchesFromAPI'])
    router.post('/data/pull/byDate', [MatchesController, 'pullMatchesByDate'])
  })
  .prefix('matches')

router
  .group(() => {
    router.post('/data/pull', [CompetitionController, 'pullCompetitionsFromAPI'])
  })
  .prefix('competitions')

router
  .group(() => {
    router.post('/data/pull', [TeamController, 'pullTeamsFromAPI'])
  })
  .prefix('teams')
