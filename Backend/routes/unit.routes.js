const express = require("express");
const router = express.Router();
const controller = require("../controllers/unit.controller");

router.post("/", controller.createUnit);                 // CREATE
router.get("/property/:propertyId", controller.getUnitsByProperty); // READ
router.put("/:unitId", controller.updateUnit);            // UPDATE
router.delete("/:unitId", controller.deleteUnit);         // SOFT DELETE

module.exports = router;
