const mongoose = require('mongoose');
const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    date : {    
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Organization', organizationSchema);

