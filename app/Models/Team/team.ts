import { buildSchema, modelOptions, mongoose, prop } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: {
    toObject: { virtuals: true },
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
  },
})
class Team {
  @prop({ required: true, unique: true })
  public id!: string

  @prop()
  public competition_id: string = ''

  @prop()
  public country_id: string = ''

  @prop({ required: true })
  public name!: string

  @prop()
  public short_name: string = ''

  @prop()
  public logo: string = ''

  @prop({ required: true })
  public national!: number

  @prop()
  public country_logo?: string

  @prop({ select: false })
  public createdAt!: number

  @prop({ select: false })
  public updatedAt!: number
}

const TeamSchema = buildSchema(Team)

TeamSchema.index({ id: 1 }, { unique: true })

// TeamSchema.virtual('coach', {
//   ref: 'Coach',
//   localField: 'coach_id',
//   foreignField: 'id',
//   justOne: true,
// })

// TeamSchema.virtual('venue', {
//   ref: 'Venue',
//   localField: 'venue_id',
//   foreignField: 'id',
//   justOne: true,
// })

TeamSchema.virtual('country', {
  ref: 'Country',
  localField: 'country_id',
  foreignField: 'id',
  justOne: true,
})

const TeamModel = mongoose.model(Team.name, TeamSchema)

export { Team, TeamModel, TeamSchema }
