import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const usersSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String
})

usersSchema.plugin(mongoosePaginate);

const userModel = mongoose.model('users', usersSchema);

export default userModel;