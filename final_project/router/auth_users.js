const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

const isValid = (username) => {
  return users.some(user => user.username === username);
};


regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  if (users.find(user => user.username === username)) {
      return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});


//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid username or password" });
  }

  const accessToken = jwt.sign({ username }, "fingerprint_customer", { expiresIn: "1h" });
  req.session.authorization = { accessToken };
  return res.status(200).json({ message: "User logged in", accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user;

  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews[username] = review;
  return res.json({ message: "Review added/modified", reviews: books[isbn].reviews });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user;

  if (!books[isbn] || !books[isbn].reviews[username]) {
      return res.status(404).json({ message: "Review not found" });
  }

  delete books[isbn].reviews[username];
  return res.json({ message: "Review deleted", reviews: books[isbn].reviews });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
