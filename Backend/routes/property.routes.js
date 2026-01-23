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

// const {
//   createUnit,
//   getUnitsByProperty,
//   updateUnit,
//   deleteUnit,
// } = require("../controllers/unit.controller");

/* =========================
   PROPERTY CRUD
========================= */
router.post("/", upload.single("propertyimgUrl"), createProperty);
router.get("/", getAllProperties);
router.get("/:id", getPropertyById);
router.put("/:id", upload.single("propertyimgUrl"), updateProperty);
router.delete("/:id", deleteProperty);

/* =========================
   PROPERTY → UNITS CRUD
========================= */
// router.post("/:propertyId/units", createUnit);          // CREATE
// router.get("/:propertyId/units", getUnitsByProperty);   // READ
// router.put("/:propertyId/units/:unitId", updateUnit);   // UPDATE
// router.delete("/:propertyId/units/:unitId", deleteUnit);// DELETE

module.exports = router;
