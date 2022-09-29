import { Router } from "express";

import { allGamesController } from "../controller/gamesController.js";

const router = Router();

router.route("/all-games").get(allGamesController);

export default router;
