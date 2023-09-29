const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const {expires} = require("express-session/session/cookie");
const regd_users = express.Router();
//const session = require('express-session')

//regd_users.use(session({secret:"fingerpint",resave: true, saveUninitialized: true}))

let users = [];

/*
const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user)=>{
      return user.username === username});
  return userswithsamename.length > 0;
}

 */
const isValid = (username) => {
  return users.some(user => user.username === username);
};
/*
const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validUsers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  })
     return validUsers.length > 0;
}

 */

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

//only registered users can log in
regd_users.post("/login", (req,res) => {
  //Write your code here
    /*
     let username = req.body.username
    let password = req.body.password
    if (!username || !password){
        return res.status(404).json({message: "Username and or/ password not provided"})
    }

   if (authenticatedUser(username, password)){
  let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }

     */
     const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and/or password not provided!" });
    }
    if (authenticatedUser(username, password)) {
        const accessToken = jwt.sign({username: username}, 'access', {expiresIn: 60 * 60});
        req.session.authorization = {accessToken, username};
        return res.status(200).send("User successfully logged in");
        } else {
            return res.status(401).json({message: "Invalid Login. Check username and password"});
        }


});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
     const isbn = req.params.isbn
    if (!isbn){
        return res.status(401).send("ISBN required")
    }
    let book = books[isbn]
    if (book){
        let review = req.query.review
        let reviewer = req.session.authorization['username']
        if (review){
            book['reviews'][reviewer] = review
            books[isbn] = book
        }else {
            return res.send("review is empty")
        }
        res.send(`The review for the book with ISBN ${isbn} has been added/updated`)
    }else {
        res.send("Unable to find ISBN!")
    }


 // return res.status(300).json({message: "Yet to be implemented"});
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
   const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).send("Unable to find  ISBN!");
    }

    delete books[isbn]['reviews'];

    return res.status(200).send(`The review for the book with ISBN ${isbn} has been deleted.`)
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
