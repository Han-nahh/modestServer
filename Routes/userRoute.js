const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController'); // Adjust the path

// api/user
router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/login', userController.loginUser);


module.exports = router;
