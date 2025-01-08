const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController'); 

// api/user
router.get('/count-customers',userController.countCustomers)
router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/login', userController.loginUser);

router.post('/request-password-reset', userController.requestPasswordReset);
router.post('/reset-password', userController.resetPassword);

// admin specific routes
router.post('/adminlogin',userController.loginUserAdmin);
router.post('/addadmin', userController.createAdmin);


module.exports = router;
