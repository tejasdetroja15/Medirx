const mongoose = require('mongoose');

const blacklistTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Token expires after 24 hours (in seconds)
  }
});

const blacklistTokenModel = mongoose.model('blacklist_token', blacklistTokenSchema);

module.exports = blacklistTokenModel;