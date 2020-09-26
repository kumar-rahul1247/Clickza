const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic:{
        type: String,
        required: false
    },
    followers: [{type: ObjectId, ref: "User"}],
    followings: [{type: ObjectId, ref: "User"}]

});

mongoose.model("User", userSchema);