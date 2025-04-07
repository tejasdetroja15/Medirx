const userModel = require('../Models/user.model.js');

module.exports.createUser = async ({
    firstname, lastname, email, password
}) => {
    if (!firstname || !email || !password) {
        throw new Error('All fields are required');
    }
    
    
    const user = await userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password
    });

    return user;
};

module.exports.findUserByEmail = async (email) => {
    try {
        console.log(`Finding user by email: ${email}`); 
        return await userModel.findOne({ email });
    } catch (error) {
        console.error('Error finding user by email:', error); 
        throw error;
    }
};

module.exports.findUserById = async (id) => {
    return await userModel.findById(id);
};

module.exports.updateUser = async (id, updateData) => {
    return await userModel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    });
};

module.exports.updatePassword = async (user, newPassword) => {
    const hashedPassword = await userModel.hashPassword(newPassword);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    return await user.save(); 
};

module.exports.findUserByResetToken = async (hashedToken) => {
    return await userModel.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
    });
};

module.exports.findUserForVerification = async (email) => {
    return await userModel.findOne({ email }).select('+otp.code +otp.expiresAt');
};

module.exports.checkUserExists = async (email) => {
    const user = await userModel.findOne({ email });
    return !!user;
};