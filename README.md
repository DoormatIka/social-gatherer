# social-gatherer
social-gatherer is a wrapper for popular social media apps. It introduces new methods to listen to events that happen in them.

Right now, it only has events for when you post... I'll add more when I have time.

## Important
Work in Progress!
I should add a no-API option..

## Installation
Requirements: `node, git` and some amount of patience. (my dumbass doesnt know how to publish an npm module)

Assuming you already set up a separate project.
```sh
git clone https://github.com/DoormatIka/social-gatherer
cd social-gatherer
npm install
npm run build
npm i axios node-json-db twitter-api-v2 typed-emitter yt-channel-info
```

## Usage
Get every file in `src/js` and copy-paste them to wherever in your project.
Go to the Wiki Page.

### Example
No Cache
```ts
const lily = new YouTubeChannel("lilyn", 10000);
await lily.validate() // returns true if it's valid
await lily.enableVideoEvent(); // enables video tracking
lily.getEventEmitter()
    .on("newUpload", (id, author, title, duration) => {
        console.log(`Video ID: ${id}, ${author}, ${title}`);
    })
```

With Cache
```ts
const db = new Cache("cache");
const youtube = await db.get("youtube");

if (isYoutube(youtube)) { // type checking, remove this for vanilla node.js
    youtube.forEach(async v => {
        // enable everything in the cache
        await v.enableVideoEvent();
        v.getEventEmitter()
            .on("newUpload", (id, author, title, duration) => {
                    console.log(`Video ID: ${id}, ${author}, ${title}`);
            })
    })
    db.pushYoutube(youtube) // update the cache to whatever changes you made
}
```

## Getting the APIs
[Twitter API](https://developer.twitter.com/en/docs/twitter-api/getting-started/getting-access-to-the-twitter-api)

[Twitch API](https://dev.twitch.tv/docs/authentication/register-app/) (Follow steps 1-10)

## FAQ
How do you get the userID's of the Youtube channels with an `@` on them?

Get to the page source of the youtube channel and Ctrl+F "channelid" on the newly opened page source. It's formatted on JSON so you'll find it. It's at the very first result.

#### Supported Websites
Twitch - Live Events

Youtube - Live Events

Twitter - Live Events & Delayed Events

#### Made for Kurix (SleepyBubbles' Discord Bot)
