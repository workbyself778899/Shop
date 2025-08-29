const mongoose = require("mongoose");
const conn = async () => {
  try {
    await mongoose.connect(`${process.env.URL}`);
    console.log("Database is connected..");
  } catch (err) {
    console.log(err);
  }
};

conn();
