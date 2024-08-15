import express from 'express'
import { Product } from '../models/product.model.js';
import { Catagory } from '../models/catagory.model.js';
import mongoose from 'mongoose';

const route = express.Router()

route.post('/', async(req, res) => {

    let catagory = await Catagory.findById(req.body.catagory);
    if(!catagory){
        return res.status(400).json({success: false, message: "Invalid Catagory !!"})
    }

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        catagory: req.body.catagory,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        isFeatured: req.body.isFeatured,
        dateCreated: req.body.dateCreated    
    })

    product = await product.save();
    if(!product){
        return res.status(400).json({success: false, message: "Product is not created"})
    }

    return res.status(200).send({product});
})

route.get('/', async(req,res) => {
    let filter = {}
    if(req.query.catagories) //http://localhost:8000/product?catagories=222,5245
    {
        filter = {catagory: req.query.catagories.split(',')}
    }
    const productList = await Product.find(filter).populate('catagory')

    if(!productList){
        return res.status(400).json({success: false, message: "fetching productList is failed !!"})
    }
    return res.status(200).send({productList});
})

route.get('/:id', async(req,res) => {
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).json({success: false, message: "Invalid id !!"});
    }
    const product = await Product.findById(req.params.id).populate('catagory');
    if(!product){
        return res.status(400).json({success: false, message: "Product is not found !!"});
    }
    return res.status(200).send({success: true, product});
})

route.delete('/:id', async(req,res) => {
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).json({success: false, message: "Invalid id !!"});
    }
    const product = await Product.findByIdAndDelete(req.params.id);
    if(!product){
        return res.status(400).json({success: false, message: "Product is not found !!"});
    }
    return res.status(200).send({success: true, message: "successfully deleted !!"});
})

route.put('/:id', async(req,res) => {
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).json({success: false, message: "Invalid Product Id !!"})
    }

    let catagory = await Catagory.findById(req.body.catagory);
    if(!catagory && catagory != null){
        return res.status(400).json({success: false, message: "Invalid Catagory !!"})
    }
    
    let product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            images: req.body.images,
            brand: req.body.brand,
            price: req.body.price,
            catagory: req.body.catagory,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            isFeatured: req.body.isFeatured,
            dateCreated: req.body.dateCreated
        },
        {new: true}
    )

    if(!product){
        return res.status(400).json({success: false, message: "product update failed !!"})
    }

    return res.status(200).send(product);
})

route.get('/get/count', async(req,res) => {
    const productCount = await Product.countDocuments()

    if(!productCount){
        return res.status(500).send({success: false})
    }

    return res.status(200).send({productCount: productCount})
})

route.get('/get/featured/:count', async(req,res) => {
    const count = req.params.count ? req.params.count : 0
    const product = await Product.find({isFeatured: true}).limit(count)

    if(!product){
        return res.status(500).send({success: false})
    }

    return res.status(200).send(product)
})

export default route