import axios from "axios";

type TwitchStreamsResponse = {
    data: {
        id: string,
        user_id: string,
        user_login: string,
        user_name: string,
        game_id: string,
        game_name: string,
        type: string,
        title: string,
        viewer_count: number,
        started_at: string,
        language: string,
        thumbnail_url: string,
        tag_ids: Array<string>,
        tags: Array<string>,
        is_mature: boolean
    }[],
    pagination: { cursor: string }
}

export class TwitchAPI {
  constructor(
    private username: string,
    private clientID: string,
    private bearerToken: string, 
  ) {}
  public async getStream() {
    const params = new URLSearchParams();
    params.append("user_login", this.username);
    const response = await axios.get("https://api.twitch.tv/helix/streams", {
      params: params,
      headers: {
        "Authorization": `Bearer ${this.bearerToken}`,
        "Client-Id"    : this.clientID
      }
    })
    const res: TwitchStreamsResponse = response.data;
    return res.data;
  }
}
