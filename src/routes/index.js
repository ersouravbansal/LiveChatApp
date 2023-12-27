// src/routes/index.js
const express = require('express');
const messagesController = require('../controllers/messagesController');
const authController = require('../controllers/authController');
const router = express.Router();
router.get('/messages/:chatroom', messagesController.getMessages);
router.post('/messages', messagesController.postMessage);
router.get('/initialize', messagesController.initialize);
router.get('/chatrooms', messagesController.getChatrooms);
router.post("/register", authController.register);
router.post('/login',authController.login);
router.put('/update',authController.update);
router.delete('/deleteuser',authController.deleteUser);

module.exports = router;
