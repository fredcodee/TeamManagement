const mongoose = require('mongoose');
const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    date : {
        type: Date,
        default: Date.now
    },
    
    organization_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    }
});

module.exports = mongoose.model('Role', roleSchema);
