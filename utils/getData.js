import axios from "axios";
import { config } from "dotenv";
config();

const getData = async (param, token) => {
  const url = `${process.env.GET_URL}/${param}`;
  const headers = {
    Accept: "application/json",
    "Client-ID": process.env.TWITCH_CLIENT_ID,
    Authorization: `Bearer ${token}`,
  };

  const { data } = await axios({
    url,
    method: "POST",
    headers,
    data: "fields *,screenshots.image_id,cover.image_id,platforms.name,genres.name,game_modes.name,similar_games.id; limit 5;",
  });

  return data;
};

export default getData;
