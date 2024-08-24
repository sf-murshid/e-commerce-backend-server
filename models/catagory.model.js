import mongoose from 'mongoose';

const catagorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '#BDFFFD',
  },
  icon: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
});

export const Catagory = mongoose.model('Catagory', catagorySchema);
