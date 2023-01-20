import { Router } from "express";
import cartsModel from "../dao/models/carts-model.js";

const router = Router();

router.get('/', async (req, res) => {
    const carts = await cartsModel.find().lean().exec();
    res.render('cart', {
        carts
    });
});

export default router;