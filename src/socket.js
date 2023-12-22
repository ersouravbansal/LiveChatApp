// src/socket.js
const socketSetup = (io) => {
  io.on('connection', (socket) => {
    console.log('New connection Socket IO');

    // Handle joining a chatroom
    socket.on('join', (chatroom) => {
      socket.join(chatroom);
      console.log(`Socket ${socket.id} joined chatroom ${chatroom}`);
    });

    // Handle creating a new chatroom
    socket.on('createRoom', (newRoomName) => {
      console.log(`New chatroom created: ${newRoomName}`);
      io.emit('newRoom', newRoomName);
    });

    // Handle sending a message
    socket.on('sendMessage', (message) => {
      io.to(message.chatroom).emit('message', message);
    });

    // Handle disconnecting from a chatroom
    socket.on('leave', (chatroom) => {
      socket.leave(chatroom);
      console.log(`Socket ${socket.id} left chatroom ${chatroom}`);
    });

    // Handle disconnecting from the server
    socket.on('disconnect', () => {
      console.log(`Socket ${socket.id} disconnected`);
    });

    // ... add more socket.io event handlers as needed
  });
};

module.exports = socketSetup;
