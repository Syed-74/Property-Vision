const express = require("express");
const router = express.Router();
const controller = require("../controllers/tenant.controller");
const upload = require("../middlewares/uploadTenant");



// router.post("/", controller.createTenant); // Removed duplicate without upload middleware
router.get("/", controller.getAllTenants);
router.delete("/:id", controller.deleteTenant);

router.post("/:tenantId/rents", controller.addMonthlyRent);
router.get("/:tenantId/rents", controller.getTenantRents);
router.get("/:id", controller.getTenantById);

router.put("/rents/:rentId", controller.updateRent);
router.delete("/rents/:rentId", controller.deleteRent);
router.get("/rents/:rentId/receipt", controller.downloadRentReceipt); // New Route for PDF

router.post("/", upload.fields([
    { name: "aadhaarCard", maxCount: 1 },
    { name: "panCard", maxCount: 1 },
    { name: "bondPaper", maxCount: 1 },
  ]),
  controller.createTenant,
);

module.exports = router;
