import { TwitterJSON, TwitterUser } from "../twitter"
import { JsonDB, Config } from "node-json-db"

/**
 * Manages the cache for the library's offline functionality.
 * @param filename - the filename of the cache/database
 */
export class DatabaseManager {
    private db: JsonDB;
    constructor(filename: string) {
        this.db = new JsonDB(new Config(filename, false, true, "/"))
    }
    /**
     * **Needs to be called first.**
     * 
     * Fills up the new database with blank data.
     */
    async init() {
        await this.db.load();
        await this.db.push("/twitter", [])
    }
    /**
     * Gets the cache's TwitterUser JSON
     * @returns An array of every TwitterUser JSON that's in the cache.
     */
    async getTwitterList() {
        if (!await this.twitterListExists()) return;
        return await this.db.getObject<TwitterJSON[]>("/twitter")
    }
    /**
     * Gets the cache's selected TwitterUser JSON
     * @param userId - the name of the twitter account "@LilynHana"
     * @returns A JSON to be used with the adapter.
     */
    async getTwitterUser(userId: string) {
        const index = await this.db.getIndex("/twitter", userId, "userId");
        if (index === -1) return;
        return await this.db.getObject<TwitterJSON>(`/twitter[${index}]`)
    }
    /**
     * Adds or updates a TwitterUser Object(s) into the cache/database
     * @param twitters - TwitterUser Objects you want to add to the cache/database
     */
    async setTwitterUser(...twitters: TwitterUser[]) {
        for (const twitter of twitters) {
            const index = await this.db.getIndex("/twitter", twitter.userId, "userId");
            if (index === -1) {
                await this.db.push(`/twitter[]`, twitter, true)
                return;
            }
            await this.db.push(`/twitter[${index}]`, twitter, true);
        }
    }
    /**
     * **Important**
     * 
     * Saves your cache/database.
     */
    async save() {
        await this.db.save();
    }
    /**
     * Checks if a TwitterList in cache exists.
     * @returns boolean
     */
    public async twitterListExists() {
        return await this.db.exists("/twitter");
    }
}

