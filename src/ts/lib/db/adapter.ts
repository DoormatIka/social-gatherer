import { TwitterUser, TwitterJSON } from "../socials/twitter";
import a from "../../../../init.json"

class Adapter {
    constructor() {}
    JSONToObject(json: unknown) {}
}

class TwitterAdapter implements Adapter {
    constructor() {}
    JSONToObject(jsonU: unknown): TwitterUser {
        const json = jsonU as TwitterJSON
        const twit = new TwitterUser(json.bearerToken, json.userId, json.msRefresh);
        twit.setTwitterMemory(json.innateMemory);
        return twit;
    }
}

// converting.
const adapter = new TwitterAdapter()
const ww = adapter.JSONToObject(a[123].twitterList[0])
console.log(ww);