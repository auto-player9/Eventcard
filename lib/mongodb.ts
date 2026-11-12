import { MongoClient, type Db } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri).connect().catch((e) => {
      global._mongoClientPromise = undefined;
      throw e;
    });
  }
  const client = await global._mongoClientPromise;
  return client.db(process.env.MONGODB_DB || "eventcard");
}

export type GuestAnswer = { name: string; attending: boolean };
export type RsvpDoc = {
  guests: GuestAnswer[];
  message: string;
  invite: string | null; // the ?g= list the link was sent with
  lang: string;
  createdAt: Date;
  userAgent?: string;
};

export async function rsvps() {
  return (await getDb()).collection<RsvpDoc>("rsvps");
}
