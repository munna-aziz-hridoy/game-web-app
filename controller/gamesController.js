import axios from "axios";
import { config } from "dotenv";
import getData from "../utils/getData.js";
config();

export const allGamesController = async (req, res) => {
  const token = res.accessToken;

  try {
    const games = await getData("games", token);

    const data = games?.map((game) => {
      const { cover, first_release_date, screenshots, ...rest } = game;

      const gameData = {
        ...rest,
        cover:
          (cover &&
            `https://images.igdb.com/igdb/image/upload/t_screenshot_big/${cover?.image_id}.jpg`) ||
          null,
        screenshots:
          screenshots &&
          screenshots?.map((screenshot) => {
            return (
              `https://images.igdb.com/igdb/image/upload/t_screenshot_big/${screenshot?.image_id}.jpg` ||
              null
            );
          }),
        first_release_date: new Date(first_release_date * 1000),
      };

      return gameData;
    });

    res.status(200).send(data);
  } catch (error) {
    res.status(501).send({ message: "internel server error", error });
  }
};

export const singleGameController = async (req, res) => {
  const id = req.query.id;
  const token = res.accessToken;

  try {
    const singleGame = await getData("games", token, id);

    if (singleGame) {
      const { cover, first_release_date, screenshots, ...rest } = singleGame[0];

      const singleGameData = {
        ...rest,
        cover:
          (cover &&
            `https://images.igdb.com/igdb/image/upload/t_screenshot_big/${cover?.image_id}.jpg`) ||
          null,
        screenshots:
          screenshots &&
          screenshots?.map((screenshot) => {
            return (
              `https://images.igdb.com/igdb/image/upload/t_screenshot_big/${screenshot?.image_id}.jpg` ||
              null
            );
          }),
        first_release_date: new Date(first_release_date * 1000),
      };

      res.status(200).send(singleGameData);
    }
  } catch (error) {
    res.status(501).send({ message: "internel server error", error });
  }
};
