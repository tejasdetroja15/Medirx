const userModel = require('../Models/user.model.js');
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../Models/blacklist.model.js');

module.exports.authUser = async (req, res, next) => {
    try {
        // Get token from cookie or authorization header
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        
        // Check if token exists
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Access denied. No token provided.' 
            });
        }

        // Check if token is blacklisted (logged out)
        const isBlacklisted = await blacklistTokenModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ 
                success: false,
                message: 'Session expired. Please login again.' 
            });
        }
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user by id
        const user = await userModel.findById(decoded._id);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found.' 
            });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: 'Email not verified. Please verify your email to access this resource.'
            });
        }

        // Attach user to request object
        req.user = user;
        req.token = token;
        
        // Proceed to next middleware/route handler
        next();
    } catch (error) {
        // Handle token validation errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token. Please login again.' 
            });
        }
        
        // Handle token expiration
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                message: 'Token expired. Please login again.' 
            });
        }
        
        // Handle other errors
        console.error('Auth middleware error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Internal server error during authentication.' 
        });
    }
};

module.exports.isAdmin = async (req, res, next) => {
    try {
        // This middleware should be used after authUser middleware
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        
        // Check if user has admin role (you would need to add a role field to your user model)
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }
        
        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during authorization check.'
        });
    }
};

module.exports.refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
        
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token not provided'
            });
        }
        
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        // Find user
        const user = await userModel.findById(decoded._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Generate new access token
        const newAccessToken = user.generateAuthToken();
        
        // Set new token in cookie
        res.cookie('token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        
        // Send new token in response
        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            token: newAccessToken
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired refresh token. Please login again.'
            });
        }
        
        console.error('Token refresh error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during token refresh'
        });
    }
};