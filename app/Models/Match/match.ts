import { buildSchema, modelOptions, mongoose, prop } from '@typegoose/typegoose'
import { Competition, CompetitionModel } from '../Competition/competition.js'
import { Team, TeamModel } from '../Team/team.js'
import MatchHelpers from './MatchHelpers/index.js'

@modelOptions({
  schemaOptions: {
    toObject: { virtuals: true },
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
  },
})
class Match {
  @prop({ required: true, unique: true })
  public id!: string

  @prop()
  public season_id: string = ''

  @prop()
  public competition_id: string = ''

  @prop({ _id: false })
  public competition?: Partial<Competition>

  @prop({ required: true })
  public home_team_id: string = ''

  @prop({ _id: false })
  public home_team!: Partial<Team>

  @prop({ required: true })
  public away_team_id: string = ''

  @prop({ _id: false })
  public away_team!: Partial<Team>

  @prop({ required: true })
  public status_id!: number

  @prop()
  public match_time: number = 0

  @prop()
  public kickoff_timestamp: number = 0

  @prop()
  public venue_id: string = ''

  @prop()
  public referee_id: string = ''

  @prop()
  public note?: string // Remarks

  @prop({ type: () => [Number], required: true })
  public home_scores!: [number, number, number, number, number, number, number] // Home team score details

  @prop({ type: () => [Number], required: true })
  public away_scores!: [number, number, number, number, number, number, number] // Away team score details

  @prop()
  public home_position?: string // Home Team Ranking

  @prop()
  public away_position?: string // Away Team Ranking

  @prop()
  public related_id?: string // The match id of the other round in the double round

  @prop({ type: () => [Number] })
  public agg_score?: [number, number] // Total score of two rounds

  // @prop({ _id: false })
  // public environment?: Environment // Match environment

  @prop({ type: Number })
  public createdAt!: number

  @prop({ type: Number })
  public updatedAt!: number
}

const MatchSchema = buildSchema(Match)

// MatchSchema.index({ id: 1 }, { unique: true })
// MatchSchema.index({ home_team_id: 1 })
// MatchSchema.index({ away_team_id: 1 })
// MatchSchema.index({ competition_id: 1 })
// MatchSchema.index({ status_id: 1 })
// MatchSchema.index({ match_time: 1 })

MatchSchema.pre('save', async function (next) {
  try {
    let [homeTeam, awayTeam, competition] = await Promise.all([
      TeamModel.findOne({ id: this.home_team_id }).select({
        name: 1,
        short_name: 1,
        logo: 1,
        country_logo: 1,
        national: 1,
        _id: 0,
      }),
      TeamModel.findOne({ id: this.away_team_id }).select({
        name: 1,
        short_name: 1,
        logo: 1,
        country_logo: 1,
        national: 1,
        _id: 0,
      }),
      CompetitionModel.findOne({ id: this.competition_id }).select({
        name: 1,
        logo: 1,
        country: 1,
        category: 1,
        _id: 0,
      }),
    ])

    if (!homeTeam && this.home_team_id !== '') {
      homeTeam = (await MatchHelpers.pullTeam(this.home_team_id)) as any
    }
    if (!awayTeam && this.away_team_id !== '') {
      awayTeam = (await MatchHelpers.pullTeam(this.away_team_id)) as any
    }
    if (!competition && this.competition_id !== '') {
      competition = (await MatchHelpers.pullCompetition(this.competition_id)) as any
    }

    if (homeTeam) {
      this.home_team = {
        name: homeTeam.name,
        short_name: homeTeam.short_name,
        logo: homeTeam.logo,
      }
    }

    if (awayTeam) {
      this.away_team = {
        name: awayTeam.name,
        short_name: awayTeam.short_name,
        logo: awayTeam.logo,
      }
    }

    if (competition) {
      this.competition = {
        name: competition.name,
        short_name: competition.short_name,
        logo: competition.logo,
      }
    }
  } catch (error) {
    console.error('Error while pulling match data:', error.message)
  }

  next()
})

const MatchModel = mongoose.model(Match.name, MatchSchema)

export { Match, MatchModel, MatchSchema }
