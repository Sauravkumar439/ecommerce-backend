const express = require("express");
const router = express.Router();

const Order = require("../models/order");
const User = require("../models/user");
const Product = require("../models/product");

const adminMiddleware = require("../middleware/adminMiddleware");

// ✅ GET /api/admin/orders - Get all orders (admin only)
router.get("/orders", adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ PUT /api/admin/orders/:id/confirm - Confirm an order (admin only)
router.put("/orders/:id/confirm", adminMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = "Confirmed";
    await order.save();

    res.json({ message: "Order confirmed", order });
  } catch (error) {
    console.error("Error confirming order:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ GET /api/admin/stats - Get dashboard summary stats (admin only)
router.get("/stats", adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const allOrders = await Order.find();
    const totalRevenue = allOrders.reduce((acc, order) => acc + order.totalAmount, 0);

    res.json({ totalUsers, totalProducts, totalOrders, totalRevenue });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ error: "Failed to load dashboard stats" });
  }
});

// ✅ GET /api/admin/revenue?days=7 - Revenue trend (last 7 or 30 days)
router.get("/revenue", adminMiddleware, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const revenueData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate },
          status: "Confirmed", // only count confirmed orders
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(revenueData);
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    res.status(500).json({ error: "Failed to fetch revenue graph data" });
  }
});

module.exports = router;
