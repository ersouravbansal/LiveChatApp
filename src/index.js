// src/index.js
require('dotenv').config();
const connectDB = require("./db");
const express = require("express");
const socketio = require("socket.io");
const { createServer } = require("http");
const socketSetup = require("./socket");
const routes = require("./routes");

const app = express();
const server = createServer(app);
const io = socketio(server);
const messagesController = require('./controllers/messagesController');
// Pass io instance to the controller
messagesController.setSocketIO(io);
// Database connectivity
connectDB();

const port = process.env.PORT || 3000;
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup Socket.IO
socketSetup(io);

// Setup routes
app.use("/", routes);

server.listen(port, () => {
  console.log(`Server is running on the port ${port}`);
});
