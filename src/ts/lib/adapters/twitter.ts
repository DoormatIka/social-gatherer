import { TwitterUser, TwitterJSON } from "../twitter"
/*
// the JSON schema
{ twitter: []
  youtube: [] }
*/
export function twitterAdapter(...data: TwitterJSON[]) {
    const adapted = [];
    for (const d of data) {
        const t = new TwitterUser(d.bearerToken, d.userId, d.msRefresh)
        t.setInnateMemory(d.innateMemory);
        adapted.push(t)
    }
    return adapted;
}
