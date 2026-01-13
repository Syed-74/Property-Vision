const Auth = require("../models/auth.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

// REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, mobileNumber, address } = req.body;

    if (!username || !email || !password || !mobileNumber || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await Auth.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Auth.create({
      username,
      email,
      password: hashedPassword,
      mobileNumber,
      address,
      role: "subadmin",
    });

    res.status(201).json({
      token: generateToken(user),
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Auth.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    res.status(200).json({
      token: generateToken(user),
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL ADMINS
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Auth.find().select("-password");
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE ADMIN
exports.updateAdmin = async (req, res) => {
  const admin = await Auth.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).select("-password");

  res.status(200).json(admin);
};

// DELETE ADMIN
exports.deleteAdmin = async (req, res) => {
  await Auth.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Admin deleted successfully" });
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await Auth.findById(req.user._id).select("+password");

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  const id = req?.user || req?.user?._id;
  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required" });
  }
  try {
    const user = await Auth.findById(id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
