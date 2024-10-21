import mongoose from 'mongoose'

export async function QueryDB(collectionName: string, query: any = {}, options: any = {}) {
  try {
    // Get the MongoDB native driver collection object
    if (!mongoose.connection.db) {
      throw new Error('Database connection is not established')
    }
    const collection = mongoose.connection.db.collection(collectionName)

    // Perform operations using the native driver methods
    const cursor = collection.find(query)

    if (options.select) cursor.project(options.select)

    const results = await cursor.toArray()

    return results
  } catch (error) {
    console.error('Error accessing collection:', error)
    throw error
  }
}
