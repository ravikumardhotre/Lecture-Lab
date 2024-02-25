const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    deletedAt: { type: Date }
});

module.exports = mongoose.model('Instructor', instructorSchema);
