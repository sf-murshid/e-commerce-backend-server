import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      toLowerCase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [6, 'Password length should be atleast 6 charecters'],
    },
    street: {
      type: String,
      default: '',
    },
    apartment: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    zip: {
      type: String,
      default: '000000',
    },
    country: {
      type: String,
      default: '',
    },
    phone: {
      type: Number,
      default: 0,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
