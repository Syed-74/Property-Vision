// controllers/floor.controller.js
const Floor = require("../models/floors.model");

/* =========================
   CREATE FLOOR
========================= */
exports.createFloor = async (req, res) => {
  try {
    const floor = await Floor.create(req.body);
    res.status(201).json({ success: true, data: floor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* =========================
   UPDATE FLOOR
========================= */
exports.updateFloor = async (req, res) => {
  try {
    const floor = await Floor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!floor) {
      return res.status(404).json({ success: false, message: "Floor not found" });
    }

    res.status(200).json({ success: true, data: floor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* =========================
   SOFT DELETE FLOOR
========================= */
exports.deleteFloor = async (req, res) => {
  try {
    const floor = await Floor.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, isActive: false },
      { new: true }
    );

    if (!floor) {
      return res.status(404).json({ success: false, message: "Floor not found" });
    }

    res.status(200).json({ success: true, message: "Floor deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* =========================
   GET SINGLE FLOOR
========================= */
exports.getFloorById = async (req, res) => {
  try {
    const floor = await Floor.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!floor) {
      return res.status(404).json({ success: false, message: "Floor not found" });
    }

    res.status(200).json({ success: true, data: floor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* =========================
   GET ALL FLOORS (BY PROPERTY)
========================= */
exports.getFloorsByProperty = async (req, res) => {
  try {
    const floors = await Floor.find({
      propertyId: req.params.propertyId,
      isDeleted: false,
    }).sort({ floorNumber: 1 });

    res.status(200).json({ success: true, data: floors });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


exports.getAllFloors = async (req, res) => {
  try {
    const floors = await Floor.find({ isDeleted: false })
      .populate("propertyId", "propertyName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: floors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
