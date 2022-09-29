import axios from "axios";
import { config } from "dotenv";
config();

export const allGamesController = async (req, res) => {
  const token = res.accessToken;
  const url = process.env.GET_GAME_URL;
  const headers = {
    "Client-ID": process.env.TWITCH_CLIENT_ID,
    Authorization: `Bearer ${token}`,
  };
  try {
    const { data } = await axios.post(url, {}, { headers });
    res.status(200).send(data);
  } catch (error) {
    res.status(501).send({ message: "internel server error", error });
  }
};
