import { TwitchAPI } from "./api";
import { TwitchLive } from "./live";

import { twitch_clientID, twitch_clientSecret } from "../../../../../secrets/api.json"
import {TokenManager} from "./tokenmanager";

export type TwitchJSON = {
    clientID: string,
    username: string,
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
 * Recommended msRefresh - 15000ms / 15s
 */
export class TwitchUser {
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
  }
  
  getStreamListener() {
    return this.live.getStreamListener();
  }
  async enableStreamListener() {
    await this.live.enableStreamListener();
  }
 
  ////////// needed methods ////////////
  getJSON(): TwitchJSON {
    return {
      clientID: this.clientID,
      username: this.username,
      bearerToken: this.bearerToken,
      msRefresh: this.msRefresh
    }
  }
}

async function main() {
  const manager = new TokenManager(twitch_clientID, twitch_clientSecret);
  await manager.refreshToken();
  const token = manager.getBearerToken();
  if (token) {
    const lilyn = new TwitchUser(twitch_clientID, "RTGame", token, 1000);
    lilyn.enableStreamListener();
    lilyn.getStreamListener().on("live", () => {})
  }  
}
main()

export class TwitchFactory {
    convertJSON(json: TwitchJSON[]) {
        return json.map(c => new TwitchUser(c.clientID, c.username, c.bearerToken, c.msRefresh));
    }
}
export class TwitchSerializer {
    convertObject(tc: TwitchUser[]) {
        return tc.map(c => c.getJSON());
    }
}

