import { Router } from "express";
import messageModel from "../dao/models/messeges-model.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const result = await messageModel.find();
        res.status(200).send(result)
    } catch (err) {
        res.status(500).send({status: 'Server Error', message: err})
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const result = await messageModel.findOne({_id: id})
        if(result){
            res.status(200).send(result)
        } else {
            res.status(400).send({status: 'Not Found', message: `El id: ${id} no existe`})
        }       
    } catch (err) {
        res.status(500).send({status: 'Server Error', message: err})
    }
})

router.post('/', async (req, res) => {
    try {
        const result = await messageModel.create(req.body);
        const messages = await messageModel.find();
        req.app.get("io").sockets.emit("messages", messages);
        res.status(200).send(result)
    } catch (err) {
        res.status(500).send({status: 'Server Error', message: err})
    }
})

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const result = await messageModel.updateOne({_id: id})
        if(result.matchedCount){
            res.status(200).send(result);
        } else {
            res.status(400).send({status: 'Not Found', message: `El id: ${id} no existe`})
        }
    } catch (err) {
        res.status(500).send({status: 'Server Error', message: err})
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await messageModel.deleteOne({_id: id});
        if(result.deletedCount){
            res.status(200).send(result);
        } else {
            res.status(400).send({status: 'Not found', message: `El id ${id} no existe`});
        }
    } catch (err) {
        res.status(500).send({status: 'Server Error', message: err});
    }
})

export default router;