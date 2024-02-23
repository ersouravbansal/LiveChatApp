const express = require('express');
const messagesController = require('../controllers/messagesController');
const authController = require('../controllers/authController');

const router = express.Router();

// Messages routes
router.get('/messages/:chatroom', messagesController.getMessages);
router.post('/messages', messagesController.postMessage);
router.get('/initialize', messagesController.initialize);
router.get('/chatrooms', messagesController.getChatrooms);

// Authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/update', authController.update);
router.delete('/deleteuser', authController.deleteUser);
router.post('/logout', authController.logout);

module.exports = router;
