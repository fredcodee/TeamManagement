const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    date : {
        type: Date,
        default: Date.now
    },
    organization_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    info : {
        type: String,
    },
    tickets : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }],
});

module.exports = mongoose.model('Project', projectSchema);
