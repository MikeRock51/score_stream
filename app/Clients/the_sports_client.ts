// import axios, { AxiosInstance, AxiosResponse } from 'axios'
// import 'dotenv/config'
// import { ApiQueryParams } from './ServicesDto'

class TheSportsClient {
  //   private axiosInstance: AxiosInstance
  //   private baseUrl = process.env.THESPORTSBASEURL
  //   private user = process.env.THESPORTSUSER
  //   private secret = process.env.THESPORTSSECRET
  constructor() {
    // this.axiosInstance = axios.create({
    //   baseURL: this.baseUrl,
    //   params: {
    //     user: this.user,
    //     secret: this.secret,
    //   },
    // })
  }

  public topCompetitions = [
    'z8yomo4h7wq0j6l',
    'vl7oqdehlyr510j',
    'jednm9whz0ryox8',
    'd23xmvkh43oqg8n',
    'gy0or5jhg6qwzv3',
    '4zp5rzghp5q82w1',
    'yl5ergphnzr8k0o',
    '9vjxm8ghx2r6odg',
    'kn54qllhg2qvy9d',
    'j1l4rjnh66nm7vx',
    'vl7oqdeheyr510j',
    '56ypq3nh0xmd7oj',
    'gpxwrxlhzzryk0j',
    'kdj2ryoh9eq1zpg',
    'v2y8m4zh3kql074',
    'l965mkyhn0r1ge4',
    '9k82rekho4repzj',
    '56ypq3nh1wmd7oj',
    'd23xmvkh43oqg8n',
    'z8yomo4h70vq0j6',
  ]

  public endpoints = {
    categories: '/category/list',
    countries: '/country/list',
    competitions: '/competition/additional/list',
    teams: '/team/additional/list',
    teamSquad: '/team/squad/list',
    teamInjuries: '/team/injury/list',
    seasonTeamStats: '/season/recent/team/stat',
    players: '/player/with_stat/list',
    matchPlayerStats: '/match/player_stats/list',
    seasonPlayerStats: '/season/recent/player/stat',
    playerTransfers: '/player/transfer/list',
    coaches: '/coach/list',
    referees: '/referee/list',
    venues: '/venue/list',
    stages: '/stage/list',
    matches: '/match/diary',
    matchesRecent: 'match/recent/list',
    seasonSchedule: '/match/season/recent',
    historicalMatchData: '/match/live/history',
    historicalPlayerStats: '/match/player_stats/detail',
    seasons: '/season/list',
    dataUpdates: '/data/update',
    matchLineup: '/match/lineup/detail',
    trends: '/match/trend/detail',
    h2h: '/match/analysis',
    standings: '/season/recent/table/detail',
    realtimeStandings: '/table/live',
    matchOdds: '/odds/history',
    oddsUpdate: '/odds/update',
    realTimeOdds: '/odds/live',

    // realTime: '/match/detail_live',
    misc: '/',
    // updateStandings: '/',
  }

  public matchStatusEnum = {
    1: 'Not Started',
    2: 'Kick Off! 👟⚽ (Match has Started)',
    3: 'Half Time 💆🏼‍♂️🧊',
    4: 'Second Half Started 👟⚽',
    5: 'Extra Time Started 👟⚽',
    7: 'Penalty Shootout Started 🥅🎯',
    8: 'Final Whistle 😮‍💨📢 (Match has Ended)',
    9: 'Match Delayed 🚩',
    10: 'Match Interrupted ⁉️',
    12: 'Match Canceled ❌',
  }

  //   public async getDataFromApi(
  //     endpoint: string,
  //     query: ApiQueryParams = {},
  //     returnQuery: boolean = false
  //   ) {
  //     const params = {
  //       page: query.page || '',
  //       time: query.time || '',
  //       uuid: query.uuid || '',
  //       tsp: query.tsp || '',
  //       date: query.date || '',
  //     }
  //     return this.getRequest(endpoint, params, returnQuery)
  //   }

  //   private async getRequest(
  //     endpoint: string,
  //     params: Record<string, any> = {},
  //     returnQuery: boolean = false
  //   ) {
  //     try {
  //       const response: AxiosResponse = await this.axiosInstance.get(endpoint, { params })

  //       if (!response.data.results) {
  //         throw new Error(response.data.err || response.data.msg)
  //       }

  //       if (returnQuery) {
  //         return response.data
  //       }

  //       return response.data.results
  //     } catch (error) {
  //       if (axios.isAxiosError(error)) {
  //         console.log(error.message)
  //         throw new Error(`API request failed: ${error.message}`)
  //       }
  //       throw error
  //     }
  //   }
}

export default new TheSportsClient()
