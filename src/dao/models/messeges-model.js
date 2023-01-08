import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        unique: true
    },
    message: {
        type: String,
        required: true,
        maxLength: 256
    }
})

const messageModel = mongoose.model('chat', messageSchema);

export default messageModel;