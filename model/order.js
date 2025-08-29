const mongoose = require("mongoose");
const order = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    book: {
      type: mongoose.Types.ObjectId,
      ref: "books", // This books is module of book.js
    },
    status: {
      type: String,
      default: "Order Placed",
      enum: ["Order Placed", "Out For Delivery", "Delivered", "Canceled"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", order);
