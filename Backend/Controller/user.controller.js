const userModel = require("../Models/user.model.js");
const userService = require('../service/user.service.js');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require("../Models/blacklist.model.js");
const emailService = require('../service/email.service.js');
const crypto = require('crypto');
const { console } = require("inspector");


module.exports.registerUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname, email, password } = req.body;

        // Check if user already exists
        console.log(`Checking if user with email ${email} already exists`);
        const existingUser = await userService.findUserByEmail(email);
        console.log(`User exists: ${!!existingUser}`);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashPassword = await userModel.hashPassword(password);

        // Remove the checkUserExists call in createUser by modifying your service call
        const user = await userModel.create({
            fullname: {
                firstname: fullname.firstname,
                lastname: fullname.lastname
            },
            email,
            password: hashPassword
        });

        // Generate OTP for email verification
        const otp = user.generateOTP();
        await user.save();

        // Send verification email
        await emailService.sendVerificationEmail(email, otp, fullname.firstname);

        res.status(201).json({ 
            message: 'Registration successful. Please check your email for verification OTP.',
            userId: user._id 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
};
module.exports.verifyEmail = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, otp } = req.body;

        const user = await userService.findUserForVerification(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        if (!user.verifyOTP(otp)) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Mark user as verified
        user.isVerified = true;
        user.otp = undefined;
        await user.save();

        const token = user.generateAuthToken();
        res.status(200).json({ 
            message: 'Email verified successfully',
            token,
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({ message: 'Server error during email verification', error: error.message });
    }
};

module.exports.resendOTP = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;

        const user = await userService.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        // Generate new OTP
        const otp = user.generateOTP();
        await user.save();

        // Send verification email
        await emailService.sendVerificationEmail(email, otp, user.fullname.firstname);

        res.status(200).json({ message: 'OTP resent successfully' });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ message: 'Server error during OTP resend', error: error.message });
    }
};

module.exports.loginUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!user.isVerified) {
            return res.status(401).json({ message: 'Please verify your email before logging in' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = user.generateAuthToken();
        res.cookie('token', token, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        
        return res.status(200).json({ 
            message: 'Login successful',
            token, 
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
};

module.exports.forgotPassword = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;

        const user = await userService.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset token
        const resetToken = user.generateResetPasswordToken();
        await user.save();

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Send password reset email
        await emailService.sendPasswordResetEmail(email, resetUrl, user.fullname.firstname);

        res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Server error during password reset request', error: error.message });
    }
};

module.exports.resetPassword = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { token, password } = req.body;

        // Hash the token from the URL
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Find user with the token and check if token is still valid
        const user = await userService.findUserByResetToken(hashedToken);

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired password reset token' });
        }

        // Update password
        await userService.updatePassword(user, password);

        res.status(200).json({ message: 'Password reset successful. You can now login with your new password.' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error during password reset', error: error.message });
    }
};

module.exports.getProfile = async (req, res, next) => {
    try {
        res.status(200).json({
            _id: req.user._id,
            fullname: req.user.fullname,
            email: req.user.email,
            isVerified: req.user.isVerified,
            createdAt: req.user.createdAt
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error while fetching profile', error: error.message });
    }
};

module.exports.logoutUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        
        if (token) {
            await blacklistTokenModel.create({ token });
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
        }
        
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error during logout', error: error.message });
    }
};

module.exports.updateProfile = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname } = req.body;
        const userId = req.user._id;

        const updatedUser = await userService.updateUser(userId, {
            fullname: {
                firstname: fullname.firstname,
                lastname: fullname.lastname
            }
        });

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                _id: updatedUser._id,
                fullname: updatedUser.fullname,
                email: updatedUser.email,
                isVerified: updatedUser.isVerified
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error during profile update', error: error.message });
    }
};