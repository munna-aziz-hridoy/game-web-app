import { Router } from "express";

import {
  allGamesController,
  singleGameController,
} from "../controller/gamesController.js";

const router = Router();

router.route("/all-games").get(allGamesController);
router.route("/single-game").get(singleGameController);

export default router;
