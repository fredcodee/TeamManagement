const mongoose = require('mongoose');
const rolePermissionsSchema = new mongoose.Schema({
    role_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    permission_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permissions'
    },
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    organization_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    }
});

const Role_Permissions = mongoose.model('Role_Permissions', rolePermissionsSchema);

module.exports = Role_Permissions;
