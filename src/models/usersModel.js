const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    token:{
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;