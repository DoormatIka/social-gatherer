import { twitter_bearerToken } from "../../secrets/api.json"
import { DatabaseManager, twitterAdapter, TwitterUser } from "../ts/index"

async function main() {
    // the database needed to have offline functionality
    const d = new DatabaseManager("test");

    if (await d.twitterListExists()) {
        // if the database/cache is already filled with a LilynHana twitter account
        const lilyn = await d.getTwitterUser("LilynHana");
        if (!lilyn) return
        
        // converts the raw JS Object file that getTwitterUser() returns into a Class Object
        const twitterList = twitterAdapter(lilyn); // you can pass multiple users here
        
        // runs through every single twitter account to run code with
        for (const tw of twitterList) {
            // prints out the tweets you missed
            console.log( await tw.getDelayedTweets({ includeRetweets: true, includeReplies: false }) );
            await tw.enableTweetEvent();
            const e = tw.getEventEmitter();
            e.on("tweeted", (text, sens) => {
                console.log(text)
            })
            // update the database/cache with the functions you ran with
            await d.setTwitterUser(tw)
        }
    } else {
        // if the database/cache is empty, initialize the database
        await d.init();

        const lilyn = new TwitterUser(twitter_bearerToken, "LilynHana", 15000);
        // adds the lilyn twitterUser to database
        await d.setTwitterUser(lilyn);
    }
    await d.save();
}
main()