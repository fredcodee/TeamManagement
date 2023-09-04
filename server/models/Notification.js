const mongoose = require('mongoose')
const notificationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notification: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    link: {
        type: String,
        default: null
    } ,
    organization_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    }
})
const Notification = mongoose.model('Notification', notificationSchema)
module.exports = Notification