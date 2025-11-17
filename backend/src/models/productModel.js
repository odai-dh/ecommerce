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

// Add indexes for better query performance
productSchema.index({ name: 'text', description: 'text' }); // Full-text search
productSchema.index({ category: 1 }); // Category filtering
productSchema.index({ price: 1 }); // Price sorting
productSchema.index({ createdAt: -1 }); // Latest products
productSchema.index({ rating: -1 }); // Top rated products

const Product = mongoose.model('Product', productSchema);

export default Product;