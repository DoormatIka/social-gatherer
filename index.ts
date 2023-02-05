import {
  YouTubeChannel,
  TwitterUser,
  Cache,
} from "./src/ts/index";

async function main() {
    const cache = new Cache("wtf");
    const yt = new YouTubeChannel("UCRC6cNamj9tYAO6h_RXd5xA", 10000);
    yt.setJSON({ previousVideoID: "QC8DGihRCFM" })
    console.log( await yt.getDelayedVideos() );

    await cache.pushYoutube(yt);
}
main()