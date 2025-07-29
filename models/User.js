const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "https://avatars.githubusercontent.com/u/00000000?v=4", // Default avatar
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Prevent OverwriteModelError by checking if model exists
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
