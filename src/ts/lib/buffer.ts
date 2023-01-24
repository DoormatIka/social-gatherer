// this file is to store "Memory" to hard drive and get it from hard drive on start up
import { JsonDB, Config } from "node-json-db"
import tweets from "./mockTweets.json";
// handles offline functionality
// and missed tweets or posts
export class ExternalStorage<T> {
    private buffer: T[] = []
    constructor() {}
    get(): T[]  {
        return this.buffer;
    }
    set(element: T[]): void {
        this.buffer = element
    }
    add(element: T): void {
        this.buffer.push(element);
    }
}
// testing
/* emulating how i'll get the tweets with the massive data
async function main() {
    const twit = new Storage<{ id: number, val: number }>()
    const max_tweets = 5;
    let time = 11;
    while (true) {
        const fetched = fetch(max_tweets, time);
        if (fetched.length === 0) {
            break;
        }
        fetched.forEach(c => {
            twit.add(c)
        })
        time += max_tweets
    }
    console.log(twit)
}
main()
*/
// Mocking how Twitter gets tweets
// time - it maps to the id basically
// max_tweets - how much you wanna get (sorted by newest (higher id))
function fetch(max_tweets: number, time: number) {
    const selected = tweets.findIndex(v => v.id === time)
    if (!selected) return [];
    return tweets.slice(time, selected + max_tweets);
}
