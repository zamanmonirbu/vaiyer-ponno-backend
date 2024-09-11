const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: {
    type: String,
    default: 'Not Given', 
  },
  mobile: {
    type: String,
    default: '+8801', 
  },
  img: {
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/512/5853/5853761.png', 
  },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: [] }],
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: [] }],
  order: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: [] }],
  subCategory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', default: [] }],
  star: { type: Number, default: 0 },
  about: {
    type: String,
    default: 'Not Given', 
  },
  video: {
    type: String,
    default: 'https://www.youtube.com/watch?v=sPQfMe39oSs', 
  },
  // categoryVideo:[{type: String,default: 'https://www.youtube.com/watch?v=sPQfMe39oSs',}],
  
  accountNumbers: {
    type: [{ name: String, number: String }],
    default: [
      { name: 'Bank A', number: '12345678' },
      { name: 'Bank B', number: '87654321' },
      { name: 'Bank C', number: '11223344' },
      { name: 'Bank D', number: '44332211' },
    ],
  },
  isSeller: { type: Boolean, default: true },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location', // Link to Location model
  },
},
{ timestamps: true });

module.exports = mongoose.model('Seller', sellerSchema);
