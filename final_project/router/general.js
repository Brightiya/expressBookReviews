const express = require('express');
let books = require("./booksdb.js");
const {json} = require("express");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
    let username = req.body.username
    let password = req.body.password

      if (username && password) {

        if (!isValid(username)) {
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registered. Now you can login"})
        } else {
            return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});
  /*  if (!username || !password){
        return res.status(400).json({message: "Username and or/ password not provided"})
    }
    if (users[username]){
        return res.status(409).json({message: "user already exists"})
    }

        users[username] = password
        return res.status(300).json({message: "User successfully registered"})


});
*/

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
   return  res.status(300).send(JSON.stringify({books}, null, 4))


});

public_users.get('/async-get-books',function (req, res) {

    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });

      get_books.then(() => console.log("Promise for Task 10 resolved"));

  });


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn

    return  res.status(300).send(JSON.stringify((books[isbn]), null, 4))


 });


public_users.get('/async-get-isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn
    isbn = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify((books[isbn]), null, 4)));
      });

      isbn.then(() => console.log("Promise for Task 11 resolved"));

  });
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
   let authorName = req.params.author;

    // Create an array to store books by the specified author
    let booksByAuthor = [];

    // Iterate over the books database and find books by the specified author
    for (let number in books) {
        if (books[number].author === authorName) {
            let book = books[number];
            let formattedBook = {
                "Author": book.author,
                "Title": book.title,
                "Reviews": book.reviews
            };
            booksByAuthor.push(formattedBook);
        }
    }

    // Check if we found any books by the specified author
    if (booksByAuthor.length > 0) {
        return res.status(300).json(booksByAuthor);
    } else {
        return res.status(404).json({ message: "No books found by the specified author!" });
    }

});

public_users.get('/async-get-author/:author',function (req, res) {
     let authorName = req.params.author
    authorName = new Promise((resolve, reject) => {
         // Create an array to store books by the specified author
    let booksByAuthor = [];

    // Iterate over the books database and find books by the specified author
    for (let number in books) {
        if (books[number].author === authorName) {
            let book = books[number];
            let formattedBook = {
                "Author": book.author,
                "Title": book.title,
                "Reviews": book.reviews
            };
            booksByAuthor.push(formattedBook);
        }
    }

    // Check if we found any books by the specified author
    if (booksByAuthor.length > 0) {
         resolve(res.send(JSON.stringify(booksByAuthor, null, 4)));
       //  return res.status(300).json(booksByAuthor);
    } else {
        return res.status(404).json({ message: "No books found by the specified author!" });
    }

      });

      authorName.then(() => console.log("Promise for Task 12 resolved"));

  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
     let bookTitle = req.params.title;


    // Create an array to store books by the specified author

    let booksByTitle = [];

    // Iterate over the books database and find books by the specified author
    for (let number in books) {
        if (books[number].title === bookTitle) {
            let book = books[number];
            let formattedBook = {
                "Author": book.author,
                "Title": book.title,
                "Reviews": book.reviews
            };
            booksByTitle.push(formattedBook);
        }
    }

    // Check if we found any books by the specified author
    if (booksByTitle.length > 0) {
        return res.status(300).json(booksByTitle);
    } else {
        return res.status(404).json({ message: "No books found by the specified title!" });
    }

});

public_users.get('/async-get-title/:title',function (req, res) {
    let bookTitle = req.params.title;
    bookTitle = new Promise((resolve, reject) => {

    // Create an array to store books by the specified author

    let booksByTitle = [];

    // Iterate over the books database and find books by the specified author
    for (let number in books) {
        if (books[number].title === bookTitle) {
            let book = books[number];
            let formattedBook = {
                "Author": book.author,
                "Title": book.title,
                "Reviews": book.reviews
            };
            booksByTitle.push(formattedBook);
        }
    }

    // Check if we found any books by the specified author
    if (booksByTitle.length > 0) {
         resolve(res.send(JSON.stringify((booksByTitle), null, 4)));
      //   return res.status(300).json(booksByTitle);
    } else {
        return res.status(404).json({ message: "No books found by the specified title!" });
    }

      });

      bookTitle.then(() => console.log("Promise for Task 13 resolved"));

  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    let isbn = req.params.isbn

    if (books[isbn]){
        return res.status(300).json(books[isbn].reviews)
    }else {
        return res.status(404).json({message: "No book found by the specified ISBN"})
    }

});



module.exports.general = public_users;
