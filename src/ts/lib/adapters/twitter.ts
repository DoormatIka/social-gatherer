import { TwitterUser, TwitterJSON } from "../twitter"
// import {  } from "../yt" 
import { JsonDB, Config } from "node-json-db"
/*
const db = new Database;
const adaptedData = TwitterAdapter(db);

// the JSON schema
{ twitter: []
  youtube: [] }
*/
type Data = {
    twitter: TwitterJSON[],
    youtube: []
}
async function twitterAdapter(db: JsonDB) { 
    // convert the mock Data to Objects
    const adapted: TwitterUser[] = []
    const data = await db.getObject<TwitterJSON[]>("/twitter");
    for (const d of data) {
        const t = new TwitterUser(d.bearerToken, d.userId, d.msRefresh)
        t.setInnateMemory(d.innateMemory);
        adapted.push(t)
    }
    return adapted;
}

async function main() {
    const db = new JsonDB(new Config("test", false, true, "/"));
    await db.delete("/")
    const data = await twitterAdapter(db);
    for (const d of data) {
        d.getDelayedTweets();
    }
}
main()
