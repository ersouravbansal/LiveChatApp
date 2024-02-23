// src/index.js
require('dotenv').config();
const connectDB = require("./db");
const crypto = require('crypto');
const express = require("express");
const session = require("express-session");
const socketio = require("socket.io");
const { createServer } = require("http");
const socketSetup = require("./socket");
const routes = require("./routes");
const messagesController = require('./controllers/messagesController');

// Database connectivity
connectDB();

// Generate a random secret key for session encryption
const secretKey = crypto.randomBytes(32).toString('hex');

// Express app setup
const app = express();
const server = createServer(app);
const io = socketio(server);

// Pass io instance to the controller
messagesController.setSocketIO(io);

const port = process.env.PORT || 3000;

// Configure session middleware
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Adjust the cookie settings as needed
}));

// Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup Socket.IO
socketSetup(io);

// Setup routes
app.use("/", routes);

// Start the server
server.listen(port, () => {
  console.log(`Server is running on the port ${port}`);
});
