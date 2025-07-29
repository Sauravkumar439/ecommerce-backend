const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId, // ✅ Accept ObjectId for internal products
          ref: "Product",
          required: true,
        },
        title: String,
        image: String,
        price: Number,
        qty: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingInfo: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: String, required: true },
      pin: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
    },
    status: {
      type: String,
      default: "Pending", // Can be 'Pending', 'Confirmed', etc.
    },
  },
  { timestamps: true }
);

// Fix to avoid OverwriteModelError in dev environments
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

module.exports = Order;
