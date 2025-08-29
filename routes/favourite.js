const router = require("express").Router();
const User = require("../model/user");
const { authenticateToken } = require("./userAuth");

// add book to favourite
router.put("/add-book-to-favourite", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookFavourite = userData.favourites.includes(bookid);
    if (isBookFavourite) {
      return res.status(200).json({ message: "Book is already in favourites" });
    }
    await User.findByIdAndUpdate(id, { $push: { favourites: bookid } });
    return res.status(200).json({ message: "Book Added to favourites" });
  } catch (error) {
    res.status(500).json({ message: "Intenal server error" });
  }
});

// remove from favourite
router.put(
  "/remove-book-from-favourite",
  authenticateToken,
  async (req, res) => {
    try {
      const { bookid, id } = req.headers;
      const userData = await User.findById(id);
      const isBookFavourite = userData.favourites.includes(bookid);
      if (isBookFavourite) {
        await User.findByIdAndUpdate(id, { $pull: { favourites: bookid } });
        return res
          .status(200)
          .json({ message: "Removed Book from favourites" });
      }
    } catch (error) {
      res.status(500).json({ message: "Intenal server error" });
    }
  }
);
// get Favourite books of a particular user
router.get("/get-favourite-books", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("favourites");
    const favouriteBook = userData.favourites;
    res.status(200).json({
      status: "Success",
      data: favouriteBook,
    });
  } catch (error) {
    res.status(500).json({ message: "Intenal server error" });
  }
});

module.exports = router;
