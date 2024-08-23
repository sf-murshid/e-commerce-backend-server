import express from 'express';
import { Order } from '../models/order.model.js';
import mongoose from 'mongoose';
import { OrderItem } from '../models/orderItem.model.js';
import { Product } from '../models/product.model.js';
import { User } from '../models/users.model.js';

const route = express.Router();

route.get('/', async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name')
    .sort({ dateOrdered: -1 });

  if (!orders) {
    return res.status(400).send({ message: 'orders fetching failed !!' });
  }

  return res.status(200).send(orders);
});

route.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send({ message: 'Invalid Order Id  !!' });
  }
  const order = await Order.findById(req.params.id)
    .populate({
      path: 'orderItems',
      populate: {
        path: 'product',
        select: 'name price catagory',
        populate: {
          path: 'catagory',
          select: 'name color',
        },
      },
    })
    .populate('user', 'name email');

  if (!order) {
    return res.status(400).send({ message: 'order fetching failed !!' });
  }

  return res.status(200).send(order);
});

route.post('/', async (req, res) => {
  const orderItemIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      const product = await Product.findById(orderItem.product);
      if (!product) {
        return res.status(400).send({ message: "Product doesn't exist" });
      }
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );
  const orderItemsIdsResolve = await orderItemIds;

  const totalCounts = Promise.all(
    orderItemsIdsResolve.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        'product',
        'price'
      );
      const count = orderItem.product.price * orderItem.quantity;
      return count;
    })
  );

  const totalCount = (await totalCounts).reduce((a, b) => a + b, 0);

  let order = new Order({
    orderItems: orderItemsIdsResolve,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalCount,
    user: req.body.user,
    dateOrdered: req.body.dateOrdered,
  });

  order = await order.save();
  if (!order) {
    return res.status(400).send({ message: 'new Order creation failed !!' });
  }
  return res.status(200).send(order);
});

route.put('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send({ message: 'Invalid credential !!' });
  }
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );

  if (!order) {
    return res.status(400).send({ message: 'Order is not updated !!' });
  }
  return res.status(200).send(order);
});

route.delete('/:id', (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send({ message: 'Invalid credential !!' });
  }

  Order.findByIdAndDelete(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItemId) => {
          await OrderItem.findByIdAndDelete(orderItemId);
        });
        return res
          .status(200)
          .send({ message: 'Successfully Order is deleted !!' });
      } else {
        return res.status(400).send({ message: 'Order is not deleted !!' });
      }
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

route.get('/get/totalSales', async (req, res) => {
  const totalSales = await Order.aggregate([
    {
      $group: { _id: null, totalSales: { $sum: '$totalPrice' } },
    },
  ]);
  if (!totalSales) {
    return res.status(400).send({ message: "Orders sales can't be generated" });
  }
  return res.status(200).send({ totalSales: totalSales.pop().totalSales });
});

route.get('/get/orderCount', async (req, res) => {
  const orderCount = await Order.countDocuments();
  if (!orderCount) {
    return res.status(400).send({ message: 'fetching order count failed !!' });
  }
  return res.status(200).send({ orderCount: orderCount });
});

route.get('/get/userOrders/:userId', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.userId)) {
    return res.status(400).send({ message: 'Invalid credential !!' });
  }
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(400).send({ message: 'User not found !!' });
  }
  const orders = await Order.find({ user: req.params.userId }).populate({
    path: 'orderItems',
    populate: {
      path: 'product',
      select: 'name price catagory',
      populate: {
        path: 'catagory',
        select: 'name color',
      },
    },
  });
  if (!orders) {
    return res
      .status(400)
      .send({ message: "fetching user's orders failed !!" });
  }
  return res.status(200).send(orders);
});

export default route;
