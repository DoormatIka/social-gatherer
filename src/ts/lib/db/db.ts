import { JsonDB, Config } from "node-json-db";
import { YoutubeJSON } from "../yt";

type Paths = "youtube" | "twitter"
export class DB {
    private db: JsonDB;
    constructor(filename?: string) {
        this.db = new JsonDB(new Config(filename ?? "data", true, false, "/"))
    }
    async get(path: Paths) {

    }
    async push(path: Paths) {

    }

    async getYoutube() {
        
    }
}