import mongoose from "mongoose"
import { logger } from "@/lib/utils/logger"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/multilingual-chatbot"

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local. " +
      "Example: mongodb://localhost:27017/multilingual-chatbot or your MongoDB Atlas connection string",
  )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var myMongoose: MongooseCache | undefined
}

const cached: MongooseCache = global.myMongoose || { conn: null, promise: null }

if (!global.myMongoose) {
  global.myMongoose = cached
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(async (mongoose) => {
      logger.info("MongoDB connected successfully")

      try {
        const { seedCampusDataIfEmpty } = await import("@/lib/utils/seed-campus-data")
        await seedCampusDataIfEmpty()
      } catch (error) {
        logger.warn("Could not seed campus data:", error)
      }

      try {
        const { seedFAQsIfEmpty } = await import("@/lib/utils/seed-faqs")
        await seedFAQsIfEmpty()
      } catch (error) {
        logger.warn("Could not seed FAQs:", error)
      }

      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    logger.error("Failed to connect to MongoDB", e)
    throw new Error(
      "Database connection failed. Please check your MONGODB_URI in .env.local and ensure MongoDB is running.",
    )
  }

  return cached.conn
}
