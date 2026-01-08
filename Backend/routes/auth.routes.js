const express = require("express");
const {
  registerUser,
  loginUser,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  changePassword
} = require("../controllers/auth.controllers");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * PUBLIC ROUTES
 */
router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/admins", protect, authorize("admin"), getAllAdmins);
router.put("/admin/:id", protect, authorize("admin"), updateAdmin);
router.delete("/admin/:id", protect, authorize("admin"), deleteAdmin);

router.put(
  "/change-password",
  protect,
  authorize("admin"),
  changePassword
);


/**
 * PROTECTED ROUTES (Example)
 * Only logged-in admin can access
 */
router.get(
  "/admin/dashboard", // Changed from /profile to /admin/dashboard
  protect,
  authorize("admin"),
  (req, res) => {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  }
);

module.exports = router;
