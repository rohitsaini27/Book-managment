const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: String,
    email: { type: String, required: true },
    phone: String,
    phoneVerified: { type: Boolean, default: false},
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    address: String,
    avatar: { type: String, default: "hh"},
    isActive: { type: Boolean, default: false},
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
module.exports = User;