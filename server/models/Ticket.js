const mongoose = require('mongoose');
const TicketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['open', 'closed', 'in progress', 'resolved'],
        default: 'open'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low'
    },
    deadLine: {
        type: Date,
    },
    type: {
        type: String,
        enum: ['bug', 'feature', 'task'],
        default: 'bug'
    },
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    organization_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    assigned_to: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: Date,
    pinned: {
        type: Boolean,
        default: false
    },

});
const Ticket = mongoose.model('Ticket', TicketSchema);
module.exports = Ticket;

    