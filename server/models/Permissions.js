const mongoose = require('mongoose');
const permissionsSchema = new mongoose.Schema({
    name: {
        type: String,
    }
});

const Permission = mongoose.model('Permissions', permissionsSchema);
module.exports = Permission;