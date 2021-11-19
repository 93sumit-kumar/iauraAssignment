const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserDataSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
    enum: ["Admin", "User"],
  },
  accessToken: {
    type: String,
  },
  status: {
    type: Number,
    default: 1,
  },
});

const User = mongoose.model("userData", UserDataSchema);

module.exports = User;
