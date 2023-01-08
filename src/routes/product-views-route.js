import { Router } from "express";
import productModel from "../dao/models/products-model.js";

const router = Router();

router.get('/', async (req, res) => {
    const products = await productModel.find().lean().exec();
    res.render('index', {
        products
    });
})

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const product = await productModel.findOne({_id: id}).lean().exec();
    res.render('one-product', {
        product
    });
})

export default router;