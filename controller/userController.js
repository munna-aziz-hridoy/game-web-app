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
      email: newUser.email,
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
      return res.status(401).send({ message: "password don't match" });

    const { accessToken, refreshToken } = await genarateToken(email);
    res.status(201).send({
      message: "logged in successfully",
      accessToken,
      refreshToken,
      email: exists.email,
    });
  } catch (error) {
    res.status(501).send({ message: "internel server error", error });
  }
};

// check user is logged in

export const checkUserController = async (req, res) => {
  const email = req.decoded.email;

  try {
    const exists = await userModel.findOne({ email });

    if (!exists) {
      return res.status(401).send({ message: "user not found" });
    }
    return res
      .status(201)
      .send({ success: true, message: "User found", user: email });
  } catch (error) {
    res.status(501).send({ message: "internel server error", error });
  }
};

// update user information

export const updateUserController = async (req, res) => {
  const {
    firstName,
    lastName,
    zipCode,
    phone,
    streetAddress,
    password,
    email,
    city,
  } = req.body;

  try {
    // check user exists
    const exists = await userModel.findOne({ email });

    if (!exists) return res.status(404).send({ message: "user not exists" });

    const isPasswordMatched = await bcrypt.compare(password, exists.password);
    if (!isPasswordMatched)
      return res.status(401).send({ message: "password don't matchs" });

    const updatedDoc = {
      $set: {
        userName: `${firstName} ${lastName}`,
        zip: zipCode,
        phone,
        streetAddress,
        city,
      },
    };
    const response = await userModel.updateOne({ email }, updatedDoc);
    res.status(201).send({ success: true, ...response });
  } catch (error) {
    res.status(501).send({ message: "internel server error", error });
  }
};
