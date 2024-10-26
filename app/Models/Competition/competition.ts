import { buildSchema, modelOptions, mongoose, prop } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: {
    toObject: { virtuals: true },
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
  },
})
class Competition {
  @prop({ required: true, unique: true })
  public id!: string

  @prop({ required: true })
  public name!: string

  @prop()
  public short_name: string = ''

  @prop()
  public logo: string = ''

  @prop({ select: false })
  public createdAt!: number

  @prop({ select: false })
  public updatedAt!: number
}

const CompetitionSchema = buildSchema(Competition)

CompetitionSchema.index({ id: 1 }, { unique: true })

const CompetitionModel = mongoose.model(Competition.name, CompetitionSchema)

export { Competition, CompetitionModel, CompetitionSchema }
