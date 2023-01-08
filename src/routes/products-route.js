import { Router } from "express";
import productModel from "../dao/models/products-model.js";
import ProductManager from "../dao/file-system/products-manager.js";

const router = Router();
const manager = new ProductManager('./src/dao/file-system/data/products.json');

router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productModel.find().limit(limit);
        if (products) {
            const fileResult = await manager.getProducts(limit);
            console.log(fileResult);
            res.status(200).send(products);
        }
    } catch (err) {
        res.status(500).send({ status: 'Server error', message: err })
    }
})

router.get('/:uuid', async (req, res) => {
    try {
        const { uuid } = req.params;
        const product = await productModel.findOne({ _id: uuid });
        if(product){
            const fileResult = await manager.getProductById(uuid);
            console.log(fileResult);
            res.status(200).send(product);
        } else {
            res.status(400).send({status: 'Not found', message: `El id ${uuid} no existe`})
        }
    } catch (err) {
        res.status(500).send({ status: 'Server error', message: err });
    }
})

router.post('/', async (req, res) => {
    try {
        const result = await productModel.create(req.body);
        if (result) {
            const { title, description, price, thumbnails, code, category, stock } = req.body;
            await manager.addProduct(result._id, title, description, price, thumbnails, code, category, stock);
            req.app.get("io").sockets.emit("products", result);
            res.status(200).send(result);
        }
    } catch (err) {
        res.status(500).send({ status: 'Server error', message: err });
    }
})

router.put('/:uuid', async (req, res) => {
    try {
        const { uuid } = req.params;
        const productToReplace = req.body
        const result = await productModel.updateOne({ _id: uuid }, productToReplace);
        if(result.matchedCount){
            const fileResult = await manager.updateProduct(uuid, productToReplace);
            res.status(200).send(result);
            console.log(fileResult);
        } else {
            res.status(400).send({status: 'Not found', message: `El id ${uuid} no existe`});
        }
    } catch (err) {
        res.status(500).send({ status: 'Server error', message: err });
    }
}) 

router.delete('/:uuid', async (req, res) => {
    try {
        const { uuid } = req.params;
        const result = await productModel.deleteOne({ _id: uuid });
        if(result.deletedCount){
            const fileResult = await manager.deleteProduct(uuid);
            console.log(fileResult);
            res.status(200).send(result);
        } else {
            res.status(400).send({status: 'Not found', message: `El id ${uuid} no existe`});
        }
    } catch (err) {
        res.status(500).send({ status: 'Server error', message: err });
    }

})

export default router;