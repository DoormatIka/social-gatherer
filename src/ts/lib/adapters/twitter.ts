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
    /* Make the Mock data
    await db.delete("/")
    await db.push("/twitter", [] as TwitterJSON[], true);
    for (let i = 0; i <= 15; i++) {
        const t = new TwitterUser(
            `${i}`, `${Math.random() * 4000}`, Math.random() * 10000
        );
        t.setInnateMemory({ tweet_id: `${Math.random() * 10}`, time: "" });
        await db.push(`/twitter[${i}]`, t, true)
    }
    await db.save() 
    */
    
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
    const data = await twitterAdapter(db);
    console.log(data)
}
main()
