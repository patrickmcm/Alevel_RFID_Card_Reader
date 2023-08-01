import { MongoClient, Db } from "mongodb";
import { config } from '../config';

let db: Db;

async function connectToDatabase(): Promise<void> {
  const client = new MongoClient(config.db.uri);

  try {
    await client.connect();
    db = client.db("main");
    console.log("[+] Connected to database")
  } catch (e: any) {
    console.error(e);
    throw e;
  }
}

// Call the function to connect to the database
connectToDatabase();

// Export a function to get the connected database
export default function getDB(): Db {
  if (!db) {
    throw new Error("Database not connected!");
  }
  return db;
}