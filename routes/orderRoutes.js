const express = require("express");
const Order = require("../models/order");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Place an order (User)
router.post("/", protect, async (req, res) => {
  try {
    const { items, totalAmount, shippingInfo } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No items in the order" });
    }

    // Validate shippingInfo
    const requiredFields = ["name", "address", "phone", "pin", "city", "state"];
    for (const field of requiredFields) {
      if (!shippingInfo?.[field]) {
        return res.status(400).json({ error: `Missing field: ${field}` });
      }
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      shippingInfo,
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("❌ Order placement failed:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// ✅ Get current user's orders
router.get("/mine", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("❌ Fetch user orders failed:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// ✅ Admin: Get all orders
router.get("/", protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: "Admin access only" });
    }

    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("❌ Fetch all orders failed:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// ✅ Admin: Confirm an order
router.patch("/:id/confirm", protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: "Admin access only" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = "Confirmed";
    await order.save();

    res.json({ message: "Order confirmed", order });
  } catch (err) {
    console.error("❌ Confirm order failed:", err);
    res.status(500).json({ error: "Failed to confirm order" });
  }
});

// ✅ Admin: Reject an order
router.patch("/:id/reject", protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: "Admin access only" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = "Rejected";
    await order.save();

    res.json({ message: "Order rejected", order });
  } catch (err) {
    console.error("❌ Reject order failed:", err);
    res.status(500).json({ error: "Failed to reject order" });
  }
});

module.exports = router;
