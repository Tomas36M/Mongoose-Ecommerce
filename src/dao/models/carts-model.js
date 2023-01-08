import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({
    products: {
        type: Array
    }
})

const cartsModel = mongoose.model('carts', cartsSchema);

export default cartsModel;