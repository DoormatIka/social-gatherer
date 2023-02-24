import { TwitterUser, CustomBrowser } from "@lilyn/twitter-scraper";
import { Background, Color, Foreground, colorlog } from "../../../utils/printcolor";
import { User, UserJSON } from "../base";

export class TwitterUserScraper implements User<TwitterScraperJSON, TwitterScraperMemory> {
    private path: string = "/twitscrape"
    private browser: CustomBrowser
    private scraper: TwitterUser
    private tweetId: string = ""
    constructor(
        private at: string, 
        private msRefresh: number, 
        private timeout?: number,
    ) {
        this.browser = new CustomBrowser();
        this.scraper = new TwitterUser(this.browser, this.at, this.msRefresh, this.timeout);
        if (this.msRefresh < 30000) {
            console.log(colorlog(
                `%>[WARN]%<: ${this.toString()} | %>msRefresh too low!%< Should be above %>30000ms%<.`,
                new Color({bg: Background.red}), new Color({fg: Foreground.yellow}), new Color({fg: Foreground.yellow})
            ))
        }
    }
    async init(headless: boolean, execPath: string = "C:/Program Files/Google/Chrome/Application/chrome.exe") {
        await this.browser.init({
            headless: headless,
            execPath: execPath
        })
        await this.scraper.init()
    }
    async getDelayedTweets() {
        if (this.tweetId.length === 0) return;
        return await this.scraper.getTweetsUntilID(this.tweetId)
    }
    async getEnableEventEmitter() {
        return await this.scraper.getEmitter();
    }

    // Necessary
    getPath() { return this.path }
    getJSON(): TwitterScraperJSON {
        return {
            msRefresh: this.msRefresh,
            userId: this.at,
            timeout: this.timeout,
            memory: {
                tweetid: this.tweetId
            }
        }
    }
    setJSON(memory: TwitterScraperMemory) {
        this.tweetId = memory.tweetid;
    }
}

export interface TwitterScraperJSON extends UserJSON {
    msRefresh: number,
    timeout?: number,
    memory: TwitterScraperMemory,
}
interface TwitterScraperMemory {
    tweetid: string
}

export class TwitterScraperFactory {
    convertJSON(json: TwitterScraperJSON[]) {
        return json.map(v => {
            const init = new TwitterUserScraper(v.userId, v.msRefresh, v.timeout);
            init.setJSON(v.memory);
            return init;
        })
    }
}