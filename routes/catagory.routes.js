import express from 'express'
import { Catagory } from '../models/catagory.model.js'
import mongoose from 'mongoose'

const router = express.Router()

router.post('/', async (req, res) => {
    let catagory = new Catagory({
        name: req.body.name,
        color: req.body.color,
        icon: req.body.icon,
        image: req.body.image
    })

    catagory = await catagory.save();
    if (!catagory) {
        res.status(400).json({ success: false, message: "catagory creation failed !!" })
    }
    res.send(catagory);
})

router.get('/', async (req, res) => {
    let catagoryList = await Catagory.find();
    if (!catagoryList) {
        res.status(400).json({ message: "fetching catagoryList failed !!" })
    }

    res.send(catagoryList)
})

router.get('/:id', async (req, res) => {
    if(!mongoose.isValidObjectId){
        return res.status(400).send({message: "Invalid catagoryID !!"})
    }
    let catagory = await Catagory.findById(req.params.id);
    if (!catagory) {
        return res.status(400).json({ message: "fetching catagory failed !!" })
    }

    res.send(catagory)
})

router.delete('/:id', async (req, res) => {
    if(!mongoose.isValidObjectId){
        return res.status(400).send({message: "Invalid catagoryID !!"})
    }
    const catagory = await Catagory.findByIdAndDelete(_id);
    if (!catagory) {
        return res.status(400).json({ success: false, message: "catagory is not found" })
    }
    res.status(200).send({ success: true });
})

router.put('/:id', async (req, res) => {
    if(!mongoose.isValidObjectId){
        return res.status(400).send({message: "Invalid catagoryID !!"})
    }
    let catagory = await Catagory.findByIdAndUpdate(_id, {
        name: req.body.name,
        color: req.body.color,
        icon: req.body.icon,
        image: req.body.icon
    },
    { new: true }
)
    if (!catagory) {
        return res.status(400).json({ success: false, message: "catagory is not found" })
    }
    res.status(200).send({ success: true, catagory });
})

export default router;