const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    username: String,
    password: String,
    role: { type: String, default: 'user' } // Providing a default value for the role field
});

exports.User = mongoose.model('User', userSchema);