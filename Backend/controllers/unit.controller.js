const Unit = require("../models/unit.model");

/* =========================
   CREATE UNIT
========================= */
exports.createUnit = async (req, res) => {
  try {
    const unit = await Unit.create(req.body);
    res.status(201).json({ success: true, data: unit });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* =========================
   GET UNITS BY PROPERTY
========================= */
exports.getUnitsByProperty = async (req, res) => {
  try {
    const units = await Unit.find({
      propertyId: req.params.propertyId,
      isDeleted: false,
    })
      .populate("floorId", "floorNumber floorName")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: units });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   UPDATE UNIT
========================= */
exports.updateUnit = async (req, res) => {
  try {
    const unit = await Unit.findByIdAndUpdate(
      req.params.unitId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!unit) {
      return res.status(404).json({ success: false, message: "Unit not found" });
    }

    res.json({ success: true, data: unit });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* =========================
   SOFT DELETE UNIT
========================= */
exports.deleteUnit = async (req, res) => {
  try {
    await Unit.findByIdAndUpdate(req.params.unitId, { isDeleted: true });
    res.json({ success: true, message: "Unit deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
