import "server-only";

import { MongoClient, type Db } from "mongodb";

const cache = globalThis as typeof globalThis & {
  partsAndLabelsMongo?: Promise<MongoClient>;
};

/** Connect lazily: builds and pages without database queries need no MongoDB. */
export async function getDatabase(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  const databaseName = process.env.MONGODB_DB;

  if (!uri || !databaseName) {
    throw new Error("Set MONGODB_URI and MONGODB_DB in .env.local.");
  }

  if (!cache.partsAndLabelsMongo) {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    cache.partsAndLabelsMongo = client.connect().catch(async (error: unknown) => {
      cache.partsAndLabelsMongo = undefined;
      await client.close().catch(() => undefined);
      throw error;
    });
  }

  return (await cache.partsAndLabelsMongo).db(databaseName);
}
