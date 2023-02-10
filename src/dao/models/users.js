import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const usersSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: String,
    cart_id: String,
    rol: {
        type: String,
        default: 'user'
    }
})

usersSchema.plugin(mongoosePaginate);

const userModel = mongoose.model('users', usersSchema);

export default userModel;