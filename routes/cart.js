const router = require("express").Router();
const User = require("../model/user");
const { authenticateToken } = require("./userAuth");

// put book to add
router.put("/add-to-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookInCart = userData.cart.includes(bookid);
    if (isBookInCart) {
      return res.json({
        status: "Success",
        message: "Book is already in Cart",
      });
    }
    await User.findByIdAndUpdate(id, {
      $push: { cart: bookid },
    });
    return res.json({
      status: "Success",
      message: "Book Added to Cart",
    });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred" });
  }
});

// remove from cart

router.put("/remove-from-cart/:bookid", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.params;
    const { id } = req.headers;
    await User.findByIdAndUpdate(id, {
      $pull: { cart: bookid },
    });
    res.status(200).json({
      status: "Success",
      message: "Book removed from Cart",
    });
  } catch (error) {
    res.status(500).json({ message: "Intenal server error" });
  }
});

// get cart of particular user
router.get("/get-user-cart", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("cart");
    const cart = userData.cart.reverse();
    res.status(200).json({
      status: "Success",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Intenal server error" });
  }
});

module.exports = router;
