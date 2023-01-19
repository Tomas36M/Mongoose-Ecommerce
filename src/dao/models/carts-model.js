import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({
    products: {
        type: Array,
        ref: 'products'
    }
})

const cartsModel = mongoose.model('carts', cartsSchema);

export default cartsModel;