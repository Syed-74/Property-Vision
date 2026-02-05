const express = require("express");
const router = express.Router();
const laborController = require("../controllers/labor.controllers");

router.post("/", laborController.createLabor);
router.get("/", laborController.getAllLabors);
router.get("/:id", laborController.getLaborById);
router.put("/:id", laborController.updateLabor);
router.delete("/:id", laborController.deleteLabor);

module.exports = router;
