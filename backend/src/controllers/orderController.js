import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentIntentId, totalPrice } = req.body;
    const userId = req.user.id; // From JWT token

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.name || !shippingAddress.email || !shippingAddress.address) {
      return res.status(400).json({ message: 'Shipping address is incomplete' });
    }

    // Create the order
    const order = new Order({
      userId,
      items,
      shippingAddress,
      paymentIntentId,
      totalPrice,
      isPaid: true,
      paidAt: new Date(),
      status: 'processing',
    });

    // Decrease stock for each product
    for (const item of items) {
      const product = await Product.findOne({ id: item.productId });
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        await product.save();
      }
    }

    await order.save();

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all orders for the authenticated user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a specific order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure the order belongs to the user
    if (order.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all orders (admin only - for future use)
export const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = '',
    } = req.query;

    const query = status ? { status } : {};

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
