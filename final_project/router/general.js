const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.json(books);
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
      return res.json(books[isbn]);
  }
  return res.status(404).json({ message: "Book not found" });
});


  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  const result = Object.values(books).filter(book => book.author.toLowerCase() === author);
  if (result.length > 0) {
      return res.json(result);
  }
  return res.status(404).json({ message: "No books found for this author" });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  const result = Object.values(books).filter(book => book.title.toLowerCase() === title);
  if (result.length > 0) {
      return res.json(result);
  }
  return res.status(404).json({ message: "No books found with this title" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
      return res.json(books[isbn].reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

// POST request to add a new book
public_users.post("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(400).json({ message: "Book already exists." });
  }

  const { title, author, review } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: "Title and author are required." });
  }

  books[isbn] = { title, author, review: review || "" };

  res.status(201).json({ message: "Book added successfully.", book: books[isbn] });
});

// PUT request to update a book
public_users.put("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  const { title, author, review } = req.body;

  if (title) books[isbn].title = title;
  if (author) books[isbn].author = author;
  if (review) books[isbn].review = review;

  res.json({ message: "Book updated successfully.", book: books[isbn] });
});


// DELETE request to remove a book
public_users.delete("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  delete books[isbn];
  res.json({ message: "Book deleted successfully." });
});


// GET reviews for a specific book
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  res.json({ reviews: books[isbn].review || "No reviews yet." });
});





module.exports.general = public_users;
