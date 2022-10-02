import axios from "axios";
import { config } from "dotenv";
config();

const getData = async (param, token, id) => {
  const url = `${process.env.GET_URL}/${param}`;
  const headers = {
    Accept: "application/json",
    "Client-ID": process.env.TWITCH_CLIENT_ID,
    Authorization: `Bearer ${token}`,
  };

  let fieldData = `fields *,screenshots.image_id,cover.image_id,platforms.name,genres.name,game_modes.name,similar_games.id; limit 100;`;

  if (id) {
    fieldData = `fields *,screenshots.image_id,cover.image_id,platforms.name,genres.name,game_modes.name,similar_games.id; where id = (${id});`;
  }

  const { data } = await axios({
    url,
    method: "POST",
    headers,
    data: fieldData,
  });

  return data;
};

export default getData;
