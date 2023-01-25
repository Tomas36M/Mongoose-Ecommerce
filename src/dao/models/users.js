import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const usersSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    rol: {
        type: String,
        default: 'usuario'
    }
})

usersSchema.plugin(mongoosePaginate);

const userModel = mongoose.model('users', usersSchema);

export default userModel;