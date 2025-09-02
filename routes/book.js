const router = require("express").Router();
const User = require("../model/user");
const { authenticateToken } = require("./userAuth");
const Book = require("../model/book");

// add book --admin
router.post("/add-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);
    if (user.role !== "admin") {
      return res
        .status(400)
        .json({ message: "Admin can only access this feature" });
    }

    const book = new Book({
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
    });
    await book.save();
    res.status(200).json({ message: "Book Added Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Intenal server error" });
  }
});

router.post("/update-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    await Book.findByIdAndUpdate(bookid, {
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
    });

    res.status(200).json({ message: "Book Updated Successfully" });
  } catch (error) {
    res.status(500).json({ message: "An  error occured in update book" });
  }
});

router.delete("/delete-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    const bookDelete = await Book.findByIdAndDelete(bookid);
    if (!bookDelete) return res.status(404).json({ message: "Book not found" });

    return res.status(200).json({ message: "Book Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred" });
  }
});

// get all books
router.get("/get-all-books", async (req, res) => {
  try {
    let sortOption = {};
    if (req.query.sort === "price_asc") {
      sortOption.price = 1;
    } else if (req.query.sort === "price_desc") {
      sortOption.price = -1;
    } else {
      // Default: latest books first
      sortOption.createdAt = -1;
    }
    const books = await Book.find().sort(sortOption);
    res.json({ data: books });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get recently added books limit 4 (show latest 4 book to user)
router.get("/get-recent-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(4);
    return res.json({ status: "Success", data: books });
  } catch (error) {
    return res.status(500).json({ message: "Error occure in get Book" });
  }
});

// get book by id
router.get("/get-book-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res
        .status(404)
        .json({ status: "Fail", message: "Book not found" });
    }

    return res.json({ status: "Success", data: book });
  } catch (error) {
    return res.status(500).json({
      message: "An internal server error occurred",
      error: error.message,
    });
  }
});

// New try

// Search books by title or author
router.get("/search-books", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res
        .status(400)
        .json({ message: "Query parameter 'q' is required" });
    }
    // Case-insensitive search in title or author
    const books = await Book.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { author: { $regex: q, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });
    return res.json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error occurred in search", error: error.message });
  }
});

// Get all books with optional price sorting
router.get("/", async (req, res) => {
  try {
    let sort = {};
    if (req.query.sort === "price_asc") {
      sort.price = 1; // ascending
    } else if (req.query.sort === "price_desc") {
      sort.price = -1; // descending
    }
    const books = await Book.find().sort(sort);
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
