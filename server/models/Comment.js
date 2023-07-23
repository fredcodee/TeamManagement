const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    ticket_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at:{
        type: Date,
        default: null
    }
});
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;