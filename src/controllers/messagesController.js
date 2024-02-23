const Message = require('../models/Message');
const { generateName, generateLoremIpsum } = require('../utils/loremIpsumGenerator');

let io;

const messagesController = {
  setSocketIO: (socketIO) => {
    io = socketIO;
  },

  async getMessages(req, res) {
    try {
      const messages = await Message.find({ chatroom: req.params.chatroom });
      res.send(messages);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve messages' });
    }
  },

  async postMessage(req, res) {
    try {
      const { user } = req.session;

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized - Please login to send messages.' });
      }

      const messageData = {
        ...req.body,
        name: user.username,
      };

      const message = new Message(messageData);
      await message.save();

      io.to(req.body.chatroom).emit('message', messageData);

      res.sendStatus(200);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to post message' });
    }
  },
  
  async initialize(req, res) {
    try {
      const chatrooms = ['Politics', 'Cricket', 'Business'];

      for (const chatroom of chatrooms) {
        for (let i = 1; i <= 10; i++) {
          const username = generateName();
          const messageContent = generateLoremIpsum();
          const messageData = {
            name: username,
            message: messageContent,
            chatroom: chatroom,
          };

          const message = new Message(messageData);
          await message.save();
        }
      }

      res.sendStatus(200);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getChatrooms(req, res) {
    try {
      const chatrooms = await Message.distinct('chatroom');
      res.send(chatrooms);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getInitialMessages(req, res) {
    try {
      const initialMessages = await Message.find().limit(10).sort({ createdAt: 'desc' });
      res.send(initialMessages);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getRecentMessages(req, res) {
    try {
      const recentMessages = await Message.find().limit(5).sort({ createdAt: 'desc' });
      res.send(recentMessages);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // ... other controller methods
};

module.exports = messagesController;
