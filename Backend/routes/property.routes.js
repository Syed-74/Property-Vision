const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");

const {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} = require("../controllers/property.controller");

/* =========================
   PROPERTY CRUD
========================= */
router.post("/", upload.single("propertyimgUrl"), createProperty);
router.get("/", getAllProperties);
router.get("/:id", getPropertyById);
router.put("/:id", upload.single("propertyimgUrl"), updateProperty);
router.delete("/:id", deleteProperty);



module.exports = router;
