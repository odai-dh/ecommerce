import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  stock: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: Number, default: 0 },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;