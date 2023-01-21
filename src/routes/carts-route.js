import { Router } from "express";
import cartsModel from "../dao/models/carts-model.js";
import CartManager from "../dao/file-system/carts-manager.js";
import productModel from "../dao/models/products-model.js";

const router = Router();
const manager = new CartManager('./src/dao/file-system/data/carts.json')

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const result = await cartsModel.findOne({ _id: id }).populate('products.product')

        console.log(result);
        if (result) {
            res.status(200).send(result)
        } else {
            res.status(400).send({ status: 'Not Found', message: `El id: ${id} no existe` })
        }
    } catch (err) {
        res.status(500).send({ status: 500, message: 'Hay un error en el servidor: ' + err });
    }
})

router.post('/', async (req, res) => {
    try {
        const result = await cartsModel.create(req.body);
        if (result) {
            await manager.addCart(result._id);
            res.status(200).send(result)
        }
    } catch (err) {
        res.status(500).send({ status: 'Server error', message: err })
    }
})

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cartDoc = await cartsModel.findOne({ _id: cid });
        const productDoc = await productModel.findOne({ _id: pid });
        if (cartDoc && productDoc) {
            const index = cartDoc.products.map(e => e.product).indexOf(pid);
            if (index >= 0) {
                const quantity = cartDoc.products[index].quantity;
                await cartsModel.updateOne({ _id: cid, 'products.product': pid }, { $set: { 'products.$.quantity': quantity + 1 } });
            } else {
                await cartsModel.updateOne({ _id: cid }, { $push: { products: { product: pid, quantity: 1 } } });
            }
            await manager.addProductToCart(cid, pid);
            res.status(200).send({ status: 'sucess' });
        } else {
            res.status(400).send({ status: 'Not Found', message: `El carrito o el producto a agregar no existe. Verificar id` })
        }
    } catch (err) {
        res.status(500).send({ status: 'Server Error', message: `Hay un problema en el servidor` + err })
    }
})

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cartDoc = await cartsModel.findOne({ _id: cid });
        const productDoc = await productModel.findOne({ _id: pid });
        if (cartDoc && productDoc) {
            const index = cartDoc.products.map(e => e.product).indexOf(pid);
            if (index >= 0) {
                const quantity = cartDoc.products[index].quantity;
                if (quantity > 1) {
                    await cartsModel.updateOne({ _id: cid, 'products.product': pid }, { $set: { 'products.$.quantity': quantity - 1 } });
                } else {
                    await cartsModel.updateOne({ _id: cid }, { $pull: { "products": { "product": pid } } });
                }
            } else {
                return res.status(400).send({ status: 'Not Found', message: `El producto a eliminar no existe.` })
            }
            res.status(200).send({ status: 'sucess' });
        } else {
            res.status(400).send({ status: 'Not Found', message: `El carrito o el producto a agregar no existe. Verificar id` })
        }
    } catch (err) {
        res.status(500).send({ status: 'Server Error', message: `Hay un problema en el servidor` + err })
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const result = await cartsModel.updateOne({ _id: id }, { $set: { products: [] } });
        if (result.matchedCount > 0) {
            res.status(200).send(result)
        } else {
            res.status(400).send({ status: 'Not Found', message: `El id: ${id} no existe` })
        }
    } catch (err) {
        res.status(500).send({ status: 500, message: 'Hay un error en el servidor: ' + err });
    }
})

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const result = await cartsModel.updateOne({ _id: id }, { $set: { products: req.body } });
        if (result.matchedCount > 0) {
            res.status(200).send(result)
        } else {
            res.status(400).send({ status: 'Not Found', message: `El id: ${id} no existe` })
        }
    } catch (err) {
        res.status(500).send({ status: 500, message: 'Hay un error en el servidor: ' + err });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cartDoc = await cartsModel.findOne({ _id: cid });
        const productDoc = await productModel.findOne({ _id: pid });
        if (cartDoc && productDoc) {
            const index = cartDoc.products.map(e => e.product).indexOf(pid);
            if (index >= 0) {
                await cartsModel.updateOne({ _id: cid, 'products.product': pid }, { $set: { 'products.$.quantity': req.body.quantity } });
            } else {
                return res.status(400).send({ status: 'Not Found', message: `El producto a cambiar no existe.` })
            }
            res.status(200).send({ status: 'sucess' });
        } else {
            res.status(400).send({ status: 'Not Found', message: `El carrito o el producto a agregar no existe. Verificar id` })
        }
    } catch (err) {
        res.status(500).send({ status: 'Server Error', message: `Hay un problema en el servidor` + err })
    }
})






export default router