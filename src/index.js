// src/index.js
require('dotenv').config();
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { createServer } = require("http");
const socketSetup = require("./socket");
const routes = require("./routes");

const app = express();
const server = createServer(app);
const io = socketio(server);
const messagesController = require('./controllers/messagesController');
// Pass io instance to the controller
messagesController.setSocketIO(io);
const port = process.env.PORT || 3000;
const db_url = process.env.MongodbURI;
mongoose.connect(db_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup Socket.IO
socketSetup(io);

// Setup routes
app.use("/", routes);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
