import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                }
            }
        ]
    }
})

const cartsModel = mongoose.model('carts', cartsSchema);

export default cartsModel;