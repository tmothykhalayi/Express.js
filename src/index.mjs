import express from "express";
//express validation
import { checkSchema, query } from 'express-validator';
//importing the schema
import { createUserValidationSchema } from './utils/validationschema.mjs';  // Import the validation schema
//importing routerfrom express
import usersRouter from './routes/users.mjs'; // Import the users router
//import mockusers from constants
import { mockusers } from './utils/constants.mjs'; // Import the mock users data
//import middelware.mjs
import { loggingMiddleware } from './utils/middlewares.mjs'; // Import the logging middleware
//import products router
import productsRouter from './routes/products.mjs'; // Import the products router
//importing cookies
import cookieParser from 'cookie-parser';
//importing session
import session from "express-session";
//IMPORTING passport
import passport from "passport";
//importing local strategy and its file directory 
import LocalStrategy from "passport-local";
import { mockusers } from "./utils/constants.mjs";
//express instance  
const app = express();
//registering passport
app.use(passport.initialize());
app.use(passport.session());




// Middleware to parse JSON bodies
app.use(express.json()); // This will allow us to handle JSON bodies in POST requests
app.use(cookieParser());
app.use(session{
  secret: "dev timothy",
  saveuninitialised; true,
  resave: true
  cookie: {secure: false
    maxAge: 6000,

  },
  store.mongostore({
    client: require('mongoose').connection.client,
    ttl: 14*24*60*60
  }),
});
// Mount the users router
app.use('/api/users', usersRouter);
//middleware to log requests

// Home route
app.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  console.log(req.session.views);
  req.session.visited=true;
  req.session.views = req.session.views ? req.session.views + 1 : 1;

  res.cookie('hello', 'world' {maxAge:6000}); // Simple hello world response
  res.send("Hello World"); // Simple hello world response
});

// Get all users with optional query parameter
app.get ,('/api/users', (req, res) => {
  const { username, displayname } = req.query; // Extract query parameters

  // If query parameters exist, filter the users
  if (username) {
    const filteredUsers = mockusers.filter(user =>
      user.username.toLowerCase().includes(username.toLowerCase()) // Filter by username
    );
    return res.send(filteredUsers); // Return filtered list
  }

  if (displayname) {
    const filteredUsers = mockusers.filter(user =>
      user.displayname.toLowerCase().includes(displayname.toLowerCase()) // Filter by displayname
    );
    return res.send(filteredUsers); // Return filtered list
  }

  // If no query parameters, return all users
  res.send(mockusers);
});

// POST request to add a new user
app.post('/api/users',checkSchema(createUserValidationSchema ),(req, res) => {
  const { username, displayname } = req.body; // Extract data from the body

  if (!username || !displayname) {
    return res.status(400).send('Username and displayname are required'); // Send error if data is missing
  }

  // Create a new user object
  const newUser = {
    id: mockusers.length + 1, // Simple ID generation
    username,
    displayname
  };

  mockusers.push(newUser); // Add the new user to the mockusers array
  return res.status(201).send(newUser); // Respond with the new user and a 201 status code
});

// Route to get all products
app.get('/api/products', (req, res) => {
  res.send([
    { id: 1, name: 'lemons', price: 100 },
    { id: 2, name: 'banana', price: 50 },
    { id: 3, name: 'apple', price: 80 }
  ]); // Send the list of products
});

// Get a specific user by ID
app.get('/api/users/:id', (req, res) => {
  const parseId = parseInt(req.params.id); // Parse the ID from the URL
  if (isNaN(parseId)) {
    return res.status(400).send('Invalid id'); // If ID is invalid
  }

  const finduser = mockusers.find(user => user.id === parseId); // Find user by ID
  if (!finduser) {
    return res.status(404).send('User not found'); // If user not found
  }

  res.send(finduser); // Send found user details
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//put request to update user
app.put('/api/users/:id', (req, res) => {
  const { body, params: { id } } = req;
  const parseId = parseInt(id);

  if (isNaN(parseId)) {
    return res.status(400).send('Invalid id');
  }

  const userIndex = mockusers.findIndex(user => user.id === parseId);
  if (userIndex === -1) {
    return res.status(404).send('User not found');
  }

  mockusers[userIndex] = { id: parseId, ...body };
  return res.status(200).send(mockusers[userIndex]);
});

//patch request
app.patch('/api/users/:id', (req, res) => {
  const { body, params: { id } } = req;
  const parseId = parseInt(id);

  if (isNaN(parseId)) {
    return res.status(400).send('Invalid id');
  }

  const userIndex = mockusers.findIndex(user => user.id === parseId);
  if (userIndex === -1) {
    return res.status(404).send('User not found');
  }

  // Update the user properties that are passed in the body
  mockusers[userIndex] = { ...mockusers[userIndex], ...body };
  return res.status(200).send(mockusers[userIndex]);
});

//delete request
app.delete('/api/users/:id', (req, res) => {
  const { params: { id } } = req;
  const parseId = parseInt(id);

  if (isNaN(parseId)) {
    return res.status(400).send('Invalid id');
  }

  const userIndex = mockusers.findIndex(user => user.id === parseId);
  if (userIndex === -1) {
    return res.status(404).send('User not found');
  }

  mockusers.splice(userIndex, 1); // Remove the user from the array
  return res.status(200).send({ message: 'User deleted successfully' });
});

//setting up session logins
app.post('/api/auth', (req, res) =>{
  const {username, password} = req.body;
  if(username === 'admin' && password === 'admin'){
    req.session.user = {username};
    return res.status(200).send('Login successful');
  }
  return res.status(401).send('Invalid credentials');

});
app.get('/api/auth/status', (req, res) =>{
  if(req.session.user){
    return res.status(200).send('Logged in');
  }
  return res.status(401).send('Not logged in');
});

//virtually sessions
app.get('/api/cart', (req, res) => {
  If(!req.session.user) return res.status(401).send('Not logged in');
  const {body :item} = req;
  const {cart}=req.session.user;
  If(cart) {
    cart.push(item);
  }
  else{
    req.session.user.cart = [item];
  }
  return res.status(200).send(req.session.user.cart);
});

app.get('/api/cart', (req, res) => {
  If(!req.session.user) return res.status(401).send('Not logged in');
  const {cart}=req.session.user;
  return res.status(200).send(cart);
});
//posting passport
app.post('/api/auth', passport.authenticate('local'), (req, res) => {
  return res.status(200).send('Login successful');

});

app.get('/api/auth/status', (req, res) => {
  if(req.user){
    return res.status(200).send('Logged in');
  }
  return res.status(401).send('Not logged in');
});
//logout function
app.post('/api/auth/logout', (req, res) =>{
  req.logout();
  return res.status(200).send('Logged out');
});

