const Labor = require("../models/labor.model");

// CREATE LABOR
exports.createLabor = async (req, res) => {
  try {
    const labor = await Labor.create(req.body);
    res.status(201).json({
      success: true,
      message: "Labor registered successfully",
      data: labor
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// GET ALL ACTIVE LABORS
exports.getAllLabors = async (req, res) => {
  try {
    const labors = await Labor.find({ isActive: true }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: labors.length,
      data: labors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// GET LABOR BY ID
exports.getLaborById = async (req, res) => {
  try {
    const labor = await Labor.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!labor) {
      return res.status(404).json({
        success: false,
        message: "Labor not found"
      });
    }

    res.status(200).json({
      success: true,
      data: labor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// UPDATE LABOR
exports.updateLabor = async (req, res) => {
  try {
    const labor = await Labor.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      req.body,
      { new: true, runValidators: true }
    );

    if (!labor) {
      return res.status(404).json({
        success: false,
        message: "Labor not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Labor updated successfully",
      data: labor
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// SOFT DELETE LABOR
exports.deleteLabor = async (req, res) => {
  try {
    const labor = await Labor.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!labor) {
      return res.status(404).json({
        success: false,
        message: "Labor not found or already deleted"
      });
    }

    res.status(200).json({
      success: true,
      message: "Labor deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
