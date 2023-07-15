const mongoose = require('mongoose');
const UserRoles = require('./UserRoles');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },  
    password: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
    organization_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true  
    },
    organization_admin: {
        type: Boolean,
        default: false
    },
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }],
});


module.exports = mongoose.model('User', userSchema);