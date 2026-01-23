const express = require("express");
const router = express.Router();
const controller = require("../controllers/tenant.controller");

router.post("/", controller.createTenant);
router.get("/", controller.getAllTenants);
router.delete("/:id", controller.deleteTenant);

router.post("/:tenantId/rents", controller.addMonthlyRent);
router.get("/:tenantId/rents", controller.getTenantRents);
router.get("/:id", controller.getTenantById);


module.exports = router;
