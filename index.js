//libraries
import express from 'express';
import dotenv from 'dotenv';
import dbConnect from './config/db.js';
import cors from 'cors'
import authJwt from './middleware/jwt.auth.js'
import errorHandler from './middleware/error-handler.js'
import morgan from 'morgan';


//dotenv config
dotenv.config(
    {
        path: './.env'
    }
)


//app config
const app = express();
const PORT = process.env.PORT || 3000

//middleware
app.use(express.json({limit: "16KB"}))
app.use(cors({origin: process.env.CORS_ORIGIN}))
app.use(morgan('tiny'))
// app.use(authJwt())
app.use(errorHandler)


//database connection
dbConnect()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at PORT: ${PORT}`);
    })
})
.catch((err) => {
    console.log(`MongoDB Connection failed`, err);
})

// routes
import productRoute from './routes/product.routes.js'
app.use('/product',productRoute)

import catagoryRoute from './routes/catagory.routes.js'
app.use('/catagory',catagoryRoute)

import usersRoute from './routes/users.routes.js'
app.use('/users', usersRoute)

import orderRoute from './routes/order.routes.js'
app.use('/orders', orderRoute)