const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../Controller/user.controller.js');
const authMiddleware = require('../Middleware/auth.middleware.js');
const userModel = require('../Models/user.model.js'); 

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    })
],
    userController.registerUser
);

router.post('/verify-email', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
],
    userController.verifyEmail
);

router.post('/resend-otp', [
    body('email').isEmail().withMessage('Invalid Email')
],
    userController.resendOTP
);

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
],
    userController.loginUser
);

router.post('/forgot-password', [
    body('email').isEmail().withMessage('Invalid Email')
],
    userController.forgotPassword
);

router.post('/reset-password', [
    body('token').isString().withMessage('Invalid token'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    })
],
    userController.resetPassword
);

router.get('/profile', authMiddleware.authUser, userController.getProfile);
router.get('/logout', authMiddleware.authUser, userController.logoutUser);

module.exports = router;