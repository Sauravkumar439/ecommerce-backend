// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const User = require("../models/User");

// // ✅ POST /api/admin-create — Create a new admin account (open for setup only)
// router.post("/", async (req, res) => {
//   try {
//     const { name, email, password, avatar } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ error: "Name, email, and password are required" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: "User with this email already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newAdmin = new User({
//       name,
//       email,
//       password: hashedPassword,
//       avatar,
//       isAdmin: true,
//     });

//     await newAdmin.save();

//     res.status(201).json({
//       message: "✅ Admin account created successfully!",
//       user: {
//         id: newAdmin._id,
//         name: newAdmin.name,
//         email: newAdmin.email,
//         avatar: newAdmin.avatar,
//         isAdmin: newAdmin.isAdmin,
//       },
//     });
//   } catch (error) {
//     console.error("❌ Error creating admin:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// module.exports = router;
