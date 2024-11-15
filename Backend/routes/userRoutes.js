const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/:userId', userController.getUserById);
router.get('/', userController.getAllUsers);
router.put('/:userId/status', userController.updateUserStatus);
router.delete('/:userId', userController.deleteUser);

module.exports = router;
