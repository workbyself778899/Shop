const router = require("express").Router();
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");
// Sign up
router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    //Check username length
    if (username.length < 4) {
      return res.status(400).json({
        message: "Username length should be greater than 3",
      });
    }
    // Check username already exist
    const existingUsername = await User.findOne({ username: username });
    if (existingUsername) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    // Check email already exist
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Check password length
    if (password.length <= 5) {
      return res.status(400).json({
        message: "Password length should be greater than 5",
      });
    }

    //Creating user
    const hashPass = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashPass,
      address,
    });
    await newUser.save();
    return res.status(200).json({ message: "Signup Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});
// sing in
router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      res.status(400).json({ message: "UserName doesn't exist" });
    }
    // compare password
    await bcrypt.compare(password, existingUser.password, (err, data) => {
      if (data) {
        const authClaims = [
          { name: existingUser.username },
          { role: existingUser.role },
        ];
        const token = jwt.sign({ authClaims }, "mykey12", {
          expiresIn: "30d",
        });
        res.status(200).json({
          message: "SignIn Successfully",
          id: existingUser._id,
          role: existingUser.role,
          token,
        });
      } else res.status(400).json({ message: "Wrong Password", err });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});
// Get user Information
router.get("/get-user-information", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const data = await User.findById(id).select("-password");
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Intenal server error" });
  }
});
// Updata address of user
router.put("/update-address", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { address } = req.body;
    await User.findByIdAndUpdate(id, { address: address });
    return res.status(200).json({ message: "Address Updated Successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Intenal server error from put updatae-address",
      error,
    });
  }
});

module.exports = router;
