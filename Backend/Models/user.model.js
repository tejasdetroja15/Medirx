const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true, 
            minlength: [3, 'First name must be at least 3 characters long'],
        },
        lastname: {
            type: String,
            minlength: [3, 'Last name must be at least 3 characters long'],
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Email must be at least 5 characters long'],
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        code: {
            type: String,
            select: false
        },
        expiresAt: {
            type: Date,
            select: false
        }
    },
    resetPasswordToken: {
        type: String,
        select: false
    },
    resetPasswordExpires: {
        type: Date,
        select: false
    },
    socketId: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });


userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
};


userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

userSchema.methods.generateOTP = function () {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set OTP expiration time (10 minutes)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    
    this.otp = {
        code: otp,
        expiresAt: expiresAt
    };
    
    return otp;
};

userSchema.methods.verifyOTP = function (submittedOTP) {
    // Check if OTP has expired
    if (this.otp.expiresAt < new Date()) {
        return false;
    }
    
    // Check if OTP matches
    return this.otp.code === submittedOTP;
};

userSchema.methods.generateResetPasswordToken = function () {
    // Generate a random token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Hash the token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    
    // Set token expiration (10 minutes)
    this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    
    return resetToken;
};

const userModel = mongoose.model('user', userSchema);

module.exports = userModel; 