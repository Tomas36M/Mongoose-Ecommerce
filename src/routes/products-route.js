import { Router } from "express";
import productModel from "../dao/models/products-model.js";
import ProductManager from "../dao/file-system/products-manager.js";

const router = Router();
const manager = new ProductManager('./src/dao/file-system/data/products.json');

router.get('/', async (req, res) => {
    try {
        const limit = req.query?.limit || 5
        const page = req.query?.page || 1

        const sort = req.query?.sort
        
        const query = req.query?.filter || req.body?.filter || ''
        const search = {};

        if(query){
            search["$or"] = [
                {title: {$regex: query }},// Expresiones Regulares
                {category: {$regex: query }}
            ]
        }

        const products = await productModel.paginate(search,{
            limit,
            page,
            lean: true,
            sort: sort ? {price: sort} : null
        });

        if (products) {
            res.status(200).send({status: 'sucess', ...products});
        } else {
            res.status(400).send({status: 'Not Found', message: 'No hay productos'})
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
            await manager.updateProduct(uuid, productToReplace);
            res.status(200).send(result);
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
        const products = await productModel.paginate({},{});
        if(result.deletedCount){
            await manager.deleteProduct(uuid);
            req.app.get("io").sockets.emit("products", products);
            res.status(200).send(result);
        } else {
            res.status(400).send({status: 'Not found', message: `El id ${uuid} no existe`});
        }
    } catch (err) {
        res.status(500).send({ status: 'Server error', message: err });
    }

})

export default router;