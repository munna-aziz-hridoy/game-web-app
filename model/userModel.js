import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  userName: String,
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

const userModel = mongoose.model("userCollection", userSchema);

export default userModel;
