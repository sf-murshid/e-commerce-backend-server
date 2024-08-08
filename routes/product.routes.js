import express from 'express'
import { Product } from '../models/product.model.js';

const route = express.Router()

route.post('/', async(req, res) => {
    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    })
    product = await product.save();
    if(!product){
        return res.status(404).json({success: false})
    }
    return res.status(200).json({product})
})

export default route