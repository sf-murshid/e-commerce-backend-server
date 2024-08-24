import mongoose from 'mongoose';
import express from 'express';
import { User } from '../models/users.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const route = express.Router();

route.post('/register', async (req, res) => {
  const hashPassword = bcrypt.hashSync(req.body.password, 10);
  if (!hashPassword)
    return res.status(400).send({ message: 'hashing password failed !!' });

  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
    street: req.body.street,
    apartment: req.body.apartment,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
  });

  user = await user.save();

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: 'new user creation failed !!' });
  }

  return res.status(200).send(user);
});

route.get('/', async (req, res) => {
  const users = await User.find();
  if (!users) {
    return res.status(400).send({ message: 'fetching users is failed !!' });
  }

  return res.status(200).send(users);
});

route.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId) {
    return res.status(400).send({ message: 'Invalid userID !!' });
  }
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(400).send({ message: 'fetching user is failed !!' });
  }

  return res.status(200).send(user);
});

route.get('/get/count', async (req, res) => {
  const userCount = await User.countDocuments();

  if (!userCount) {
    return res.status(400).send({ message: 'user count failed !!' });
  }
  return res.status(200).send({ userCount });
});

route.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.JWT_SECRET;
  if (!user) {
    return res.status(400).send('The user not found');
  }

  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = jwt.sign(
      {
        userId: user._id,
        isAdmin: user.isAdmin,
      },
      secret,
      { expiresIn: '1d' }
    );

    res.status(200).send({ user: user.email, token: token });
  } else {
    res.status(400).send('password is wrong!');
  }
});

route.put('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId) {
    return res.status(400).send({ message: 'Invalid userID !!' });
  }
  const existUser = await User.findById(req.params.id);
  let newPassword = '';
  if (req.body.password) {
    newPassword = bcrypt.hashSync(req.body.password, 10);
    if (!newPassword)
      return res.status(400).send({ message: 'hashing password failed !!' });
  } else {
    newPassword = existUser.password;
  }
  let user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      password: newPassword,
      street: req.body.street,
      apartment: req.body.apartment,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
    },
    { new: true }
  );

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: 'user updatation failed !!' });
  }

  return res.status(200).send(user);
});

route.delete('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId) {
    return res.status(400).send({ message: 'Invalid userID !!' });
  }
  User.findByIdAndDelete(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .send({ message: 'user is successfully deleted !!' });
      }
    })
    .catch((err) => {
      return res.status(400).send({ err });
    });
});

export default route;
