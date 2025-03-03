import express from "express";
// express validation
import { checkSchema } from 'express-validator';
// importing the schema
import { createUserValidationSchema } from './utils/validationschema.mjs';  // Import the validation schema
// importing router from express
import usersRouter from './routes/users.mjs'; // Import the users router
// importing mockusers from constants
import { mockusers } from './utils/constants.mjs'; // Import the mock users data
// importing middleware
import { loggingMiddleware } from './utils/middlewares.mjs'; // Import the logging middleware
// importing products router
import productsRouter from './routes/products.mjs'; // Import the products router
// importing cookies
import cookieParser from 'cookie-parser';
// importing session
import session from "express-session";
// IMPORTING passport
import passport from "passport";
import LocalStrategy from "passport-local";
// importing mockusers
import { mockusers } from './utils/constants.mjs';
// express instance  
const app = express();

// register passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware to parse JSON bodies
app.use(express.json()); // This will allow us to handle JSON bodies in POST requests
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: "dev timothy",
  saveUninitialized: true,  // Fixed typo
  resave: true,
  cookie: { secure: false, maxAge: 6000 },  // Fixed syntax
  store: new (require('connect-mongo'))({
    client: require('mongoose').connection.client,
    ttl: 14 * 24 * 60 * 60 // 14 days
  })
}));

// Passport Local Strategy for authentication
passport.use(new LocalStrategy(
  (username, password, done) => {
    const user = mockusers.find(u => u.username === username);
    if (!user || user.password !== password) {
      return done(null, false, { message: 'Invalid credentials' });
    }
    return done(null, user);
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = mockusers.find(u => u.id === id);
  done(null, user);
});

// Middleware to log requests
app.use(loggingMiddleware);

// Mount the users router
app.use('/api/users', usersRouter);

// Home route
app.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  console.log(req.session.views);
  req.session.visited = true;
  req.session.views = req.session.views ? req.session.views + 1 : 1;

  res.cookie('hello', 'world', { maxAge: 6000 }); // Fixed syntax
  res.send("Hello World");
});

// Get all users with optional query parameter
app.get('/api/users', (req, res) => {
  const { username, displayname } = req.query; // Extract query parameters

  // If query parameters exist, filter the users
  if (username) {
    const filteredUsers = mockusers.filter(user =>
      user.username.toLowerCase().includes(username.toLowerCase())
    );
    return res.send(filteredUsers);
  }

  if (displayname) {
    const filteredUsers = mockusers.filter(user =>
      user.displayname.toLowerCase().includes(displayname.toLowerCase())
    );
    return res.send(filteredUsers);
  }

  // If no query parameters, return all users
  res.send(mockusers);
});

// POST request to add a new user
app.post('/api/users', checkSchema(createUserValidationSchema), (req, res) => {
  const { username, displayname } = req.body; // Extract data from the body

  if (!username || !displayname) {
    return res.status(400).send('Username and displayname are required');
  }

  // Create a new user object
  const newUser = {
    id: mockusers.length + 1, // Simple ID generation
    username,
    displayname
  };

  mockusers.push(newUser); // Add the new user to the mockusers array
  return res.status(201).send(newUser);
});

// Route to get all products
app.get('/api/products', (req, res) => {
  res.send([
    { id: 1, name: 'lemons', price: 100 },
    { id: 2, name: 'banana', price: 50 },
    { id: 3, name: 'apple', price: 80 }
  ]);
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

// PUT request to update a user
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

// PATCH request to update some user data
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

// DELETE request to delete a user
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

// POST request for session login
app.post('/api/auth', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    req.session.user = { username };
    return res.status(200).send('Login successful');
  }
  return res.status(401).send('Invalid credentials');
});

// GET request for authentication status
app.get('/api/auth/status', (req, res) => {
  if (req.session.user) {
    return res.status(200).send('Logged in');
  }
  return res.status(401).send('Not logged in');
});

// Cart functionality
app.post('/api/cart', (req, res) => {
  if (!req.session.user) return res.status(401).send('Not logged in');
  const { item } = req.body;
  const { cart } = req.session.user;
  if (cart) {
    cart.push(item);
  } else {
    req.session.user.cart = [item];
  }
  return res.status(200).send(req.session.user.cart);
});

// GET request to get cart items
app.get('/api/cart', (req, res) => {
  if (!req.session.user) return res.status(401).send('Not logged in');
  const { cart } = req.session.user;
  return res.status(200).send(cart);
});

// POST request for Passport authentication
app.post('/api/auth/passport', passport.authenticate('local'), (req, res) => {
  return res.status(200).send('Login successful');
});

// GET request for Passport authentication status
app.get('/api/auth/passport/status', (req, res) => {
  if (req.user) {
    return res.status(200).send('Logged in');
  }
  return res.status(401).send('Not logged in');
});

// POST request to log out
app.post('/api/auth/logout', (req, res) => {
  req.logout();
  return res.status(200).send('Logged out');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
