import Env from '#start/env'
import mongoose from 'mongoose'
// const databaseConfig: DatabaseConfig = {
//   connection: Env.get('DB_CONNECTION'),

//   connections: {
//     pg: {
//       client: 'pg',
//       connection: {
//         host: Env.get('PG_HOST'),
//         port: Env.get('PG_PORT'),
//         user: Env.get('PG_USER'),
//         password: Env.get('PG_PASSWORD', ''),
//         database: Env.get('PG_DB_NAME'),
//       },
//       migrations: {
//         naturalSort: true,
//       },
//       healthCheck: false,
//       debug: false,
//     },
//   },
// }

// export default databaseConfig

export async function connectMongoDB() {
  const DB_PROD = Env.get('DB_PROD')
  const DB_DEV = Env.get('DB_LOCAL')
  const NODE_ENV = Env.get('NODE_ENV')

  let DATABASE = DB_DEV
  let connectionType = 'MONGODB LOCAL DATABASE CONNECTION'

  if (NODE_ENV === 'production') {
    DATABASE = DB_PROD
    connectionType = 'MONGODB PRODUCTION DATABASE CONNECTION'
  }

  try {
    const mongoConnection = await mongoose.connect(DATABASE!)

    // mongoConnection.plugin(paginate);
    console.info(`✅✅✅ ➡ ${connectionType} IS SUCCESSFUL!`)

    return mongoConnection
  } catch (err: any) {
    // log to console
    err.message += ` ${connectionType}: Incorrect/Invalid Database string or Invalid Mongoose options.\nPlease make sure your mongodb connection string '${DATABASE}' is correct and your mongoose options are correct.`

    console.error('error', err.message)
    console.error(err)
    // save to error log file
    console.error(err)
  }
}
