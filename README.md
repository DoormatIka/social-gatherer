# social-gatherer
social-gatherer is a wrapper for popular social media apps. It introduces new methods to listen to events that happen in a website!

## Important
Work in Progress!
I should add a no-API option..

## Installation
Requirements: `node, git, and patience`
```sh
git clone https://github.com/DoormatIka/social-gatherer
cd social-gatherer
npm install
npm run build
```

## Usage
Get every file in `src/js` and copy-paste them to wherever in your project.

```js
const { YouTubeChannel, TwitterUser } = require("./lib/index.js");
// import { YouTubeChannel, TwitterUser } from "where you put this"
async function main() {
    const penguinz0 = new YouTubeChannel("penguinz0", 5000);
    await penguinz0.validate() // don't forget to validate the channelID
    const listener = await penguinz0.getVideoListener();

    listener.on("newUpload", (info) => {
        console.log(info);
        // listen to the new uploads by the youtube channel
        // info returns the video ID of the video
    })
    listener.on("subscribeMilestone", (milestone, subCount) => {
        console.log(milestone, subCount)
        // listen to subscriber milestones that happened
    })
}
```

#### Getting the APIs
[Twitter API](https://developer.twitter.com/en/docs/twitter-api/getting-started/getting-access-to-the-twitter-api)

#### Supported Websites
Incomplete Functionality:
Everything.

Complete Functionality:
None, yet.
