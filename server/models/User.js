const mongoose = require('mongoose');
const UserRoles = require('./UserRoles');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
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
    organization_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true  
    }],
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }],
});


module.exports = mongoose.model('User', userSchema);