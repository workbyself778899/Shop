const express = require("express");
const app = express();
require("dotenv").config();
require("./connect/conn");
const User = require("./routes/user");
const Books = require("./routes/book");
const Favourite = require("./routes/favourite");
const cors = require("cors");
const Cart = require("./routes/cart");
const Order = require("./routes/order");
app.use(cors());
app.use(express.json());
//routes
app.use("/api/v1", User);
app.use("/api/v1", Books);
app.use("/api/v1", Favourite);
app.use("/api/v1", Cart);
app.use("/api/v1", Order);

app.get("/", (req, res) => {
  res.send("Call from backend");
});
app.listen(process.env.PORT, () => {
  console.log("Sever is running");
});
