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
// Twitch //
async function main() {
  // get the token refresher on
  const manager = new TokenManager(twitch_clientID, twitch_clientSecret);
  await manager.refreshToken();
  const token = manager.getBearerToken();
  if (token) {
    // make a new object to manager your channel with
    const lilyn = new TwitchUser(twitch_clientID, "RTGame", token, 10000);
    lilyn.enableStreamListener();
    console.log(`Listening to ${lilyn.toString()}`)
    // listen to when a twitch account goes live
    lilyn.getStreamListener().on("live", () => {})
  }
}
main()
```

With Cache
```ts
// To Do.
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
