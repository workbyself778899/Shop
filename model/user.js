const mongoose = require("mongoose");
const user = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/128/3135/3135715.png",
    },
    favourites: [
      {
        type: mongoose.Types.ObjectId,
        ref: "books",
      },
    ],

    cart: [
      {
        type: mongoose.Types.ObjectId,
        ref: "books",
      },
    ],

    orders: [
      {
        type: mongoose.Types.ObjectId,
        ref: "order",
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("user", user);
