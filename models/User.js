const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'like'
        }
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'comment'
        }
    ]
});

module.exports = User = mongoose.model('user', UserSchema);
