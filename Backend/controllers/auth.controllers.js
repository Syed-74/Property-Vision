const Auth = require("../models/auth.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendResetEmail } = require("../utils/mailjet");

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
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    // ❌ remove password before sending
    user.password = undefined;

    res.status(200).json({
      success: true,
      token,
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

exports.getAdminProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      mobileNumber: req.user.mobileNumber,
      role: req.user.role,
    },
  });
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Auth.findOne({ email });
    if (!user) {
      return res.status(200).json({
        message: "If this email exists, a reset link has been sent",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendResetEmail({
      to: user.email,
      name: user.username,
      resetUrl,
    });

    res.status(200).json({
      success: true,
      message: "Password reset link sent",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* =========================
   RESET PASSWORD
========================= */
exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await Auth.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Token invalid or expired" });
    }

    if (req.body.password.length < 6) {
      return res.status(400).json({ message: "Password too short" });
    }

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

