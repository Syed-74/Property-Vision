const express = require("express");

const router = express.Router();

const {
  createTenant,
  getAllTenants,
  getTenantById,
  updateTenant,
  deleteTenant,
} = require("../controllers/tenant.controller");

router.post("/create", createTenant);
router.get("/all", getAllTenants);
router.get("/:id", getTenantById);
router.put("/update/:id", updateTenant);
router.delete("/delete/:id", deleteTenant);

module.exports = router;
