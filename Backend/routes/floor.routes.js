const express = require("express");
const router = express.Router();
const floorController = require("../controllers/floors.controllers");

router.post("/", floorController.createFloor);
router.put("/:id", floorController.updateFloor);
router.delete("/:id", floorController.deleteFloor);
router.get("/", floorController.getAllFloors); // ✅ ADD THIS
router.get("/:id", floorController.getFloorById);
router.get("/property/:propertyId", floorController.getFloorsByProperty);

module.exports = router;
