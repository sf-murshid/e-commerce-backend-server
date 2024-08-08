import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    richDescription: {
        type: String,
        default:''
    },
    // image: {
    //     type: String,
    //     required: true
    // },
    images: [{
        type:String
    }],
    brand: {
        type: String,
        default:''
    },
    price: {
        type: Number,
        default: 0
    },
    // catagory:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Catagory",
    //     required: true
    // },
    countInStock: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    dateCreated:{
        type: Date,
        default: Date.now
    }


})

export const Product = mongoose.model('Product', productSchema);