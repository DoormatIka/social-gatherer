import { TwitchAPI } from "./api";
import { TwitchLive } from "./live";
import { Background, Color, Foreground, colorlog } from "../../../utils/printcolor";
import { User, UserJSON } from "../user";

export interface TwitchJSON extends UserJSON {
    clientID: string,
    bearerToken: string,
    msRefresh: number,
}

/**
 * Twitch class to interact with the Twitch API
 * @param clientID - can be found in Twitch API
 * @param bearerToken - from class TokenManager
 * @param msRefresh - time interval (ms) to refresh the API for updates
 * @param username - name of the channel you're tracking
 * 
 * Recommended msRefresh - 20000ms / 20s
 */
export class TwitchUser implements User<TwitchJSON, unknown> {
  private path = "/twitch"
  private api: TwitchAPI
  private live: TwitchLive
  constructor(
    public clientID: string,
    public username: string,
    public bearerToken: string,
    public msRefresh: number
  ) {
    this.api = new TwitchAPI(this.username, this.clientID, this.bearerToken);
    this.live = new TwitchLive(this.api, this.msRefresh);
    if (this.msRefresh < 20000) {
      console.log(colorlog(
        `%>[WARN]%<: ${this.toString()} | %>msRefresh too low!%< Should be above %>20000ms%<.`,
        new Color({bg: Background.red}), new Color({fg: Foreground.yellow}), new Color({fg: Foreground.yellow})
      ))
    }
  }
  
  getStreamListener() {
    return this.live.getStreamListener();
  }
  async enableStreamListener() {
    await this.live.enableStreamListener();
  }
  toString() {
    return `TwitchUser (${this.username}) [Refresh (ms): ${this.msRefresh}]`
  }

  ////////// needed methods ////////////
  getJSON(): TwitchJSON {
    return {
      clientID: this.clientID,
      userId: this.username,
      bearerToken: this.bearerToken,
      msRefresh: this.msRefresh
    }
  }
  getPath() {
    return this.path;
  }
  setJSON(memory: unknown) {};
}

export class TwitchFactory {
    convertJSON(json: TwitchJSON[]) {
        return json.map(c => new TwitchUser(c.clientID, c.userId, c.bearerToken, c.msRefresh));
    }
}
