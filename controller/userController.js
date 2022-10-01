import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

import userModel from "../model/userModel.js";
import tokenModel from "../model/tokenModel.js";
import genarateToken from "../utils/genarateToken.js";

export const registerNewUserController = async (req, res) => {
  const { userName, email, password } = req.body;

  // check email and password is present

  if (!email)
    return res.status(401).send({ message: "must have a email to register" });
  if (!password)
    return res
      .status(401)
      .send({ message: "must have a password to register" });

  // ******
  try {
    const exists = await userModel.findOne({ email });

    // check user exists
    if (exists) return res.status(404).send({ message: "user already exists" });

    // gen salt and hashed password

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // create and save user

    const newUser = new userModel({
      userName: userName,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // create access and refresh token

    const { accessToken, refreshToken } = await genarateToken(email);

    // send response

    res.status(201).send({
      message: "successfully created a new user",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(501).send({ message: "internel server error", error });
  }
};

export const loginUserController = async (req, res) => {
  const { email, password } = req.body;

  try {
    // check user exists
    const exists = await userModel.findOne({ email });
    if (!exists) return res.status(404).send({ message: "user not exists" });

    const isPasswordMatched = await bcrypt.compare(password, exists.password);

    if (!isPasswordMatched)
      return res.status(401).send({ message: "password don't matchs" });

    const { accessToken, refreshToken } = await genarateToken(email);
    res
      .status(201)
      .send({ message: "logged in successfully", accessToken, refreshToken });
  } catch (error) {
    res.status(501).send({ message: "internel server error", error });
  }
};
