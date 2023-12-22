// src/routes/index.js
const express = require('express');
const messagesController = require('../controllers/messagesController');

const router = express.Router();

router.get('/messages/:chatroom', messagesController.getMessages);
router.post('/messages', messagesController.postMessage);
router.get('/initialize', messagesController.initialize);
router.get('/chatrooms', messagesController.getChatrooms);

module.exports = router;
