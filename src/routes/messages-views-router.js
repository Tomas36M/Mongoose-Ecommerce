import { Router } from "express";
import messageModel from "../dao/models/messeges-model.js";

const router = Router();

router.get('/', async (req, res) => {
    const messages = await messageModel.find().lean().exec();
    res.render('chat', {
        messages
    });
})

export default router;