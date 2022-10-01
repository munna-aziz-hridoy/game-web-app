import { Router } from "express";
import {
  registerNewUserController,
  loginUserController,
} from "../controller/userController.js";

const router = Router();

router.route("/register-user").post(registerNewUserController);
router.route("/login-user").post(loginUserController);

export default router;
