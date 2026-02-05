const PropertiesManagement = require('../models/Propertiesmanagement');
const generatePropertyId = require('../utils/generatePropertyId');
const mongoose = require('mongoose');
/* =========================
   CREATE PROPERTY
========================= */

exports.createProperty = async (req, res) => {
  try {
    const location = req.body.location
      ? JSON.parse(req.body.location)
      : {};

    const physicalDetails = req.body.physicalDetails
      ? JSON.parse(req.body.physicalDetails)
      : {};

    const financialDetails = req.body.financialDetails
      ? JSON.parse(req.body.financialDetails)
      : {};

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Property image is required",
      });
    }

    const propertyId = await generatePropertyId();

    const property = await PropertiesManagement.create({
      propertyId,
      propertyName: req.body.propertyName,
      propertyType: req.body.propertyType,
      ownershipType: req.body.ownershipType,
      description: req.body.description,

      location,
      physicalDetails,
      financialDetails,

      propertyimgUrl: `/uploads/${req.file.filename}`,
    });

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: property,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};  


/* =========================
   GET ALL PROPERTIES
========================= */
exports.getAllProperties = async (req, res) => {
  try {
    const filters = { isDeleted: false };

    // Optional filters
    if (req.query.propertyType) {
      filters.propertyType = req.query.propertyType;
    }
    if (req.query.propertyStatus) {
      filters.propertyStatus = req.query.propertyStatus;
    }
    if (req.query.city) {
      filters['location.city'] = req.query.city;
    }

    const properties = await PropertiesManagement.find(filters)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching properties',
      error: error.message,
    });
  }
};

/* =========================
   GET PROPERTY BY ID
========================= */
exports.getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await PropertiesManagement.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching property',
      error: error.message,
    });
  }
};

/* =========================
   UPDATE PROPERTY
========================= */


exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate Mongo ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid property ID" });
    }

    // ✅ Build update object safely
    const updatedData = {
      propertyName: req.body.propertyName,
      propertyType: req.body.propertyType,
      ownershipType: req.body.ownershipType,
      description: req.body.description,

      location: req.body.location
        ? JSON.parse(req.body.location)
        : undefined,

      physicalDetails: req.body.physicalDetails
        ? JSON.parse(req.body.physicalDetails)
        : undefined,

      financialDetails: req.body.financialDetails
        ? JSON.parse(req.body.financialDetails)
        : undefined,
    };

    // ✅ Update image only if new file uploaded
    if (req.file) {
      updatedData.propertyimgUrl = `/uploads/${req.file.filename}`;
    }

    // ✅ Remove undefined fields (prevents overwriting existing data)
    Object.keys(updatedData).forEach(
      key => updatedData[key] === undefined && delete updatedData[key]
    );

    // ✅ Soft-delete safe update
    const property = await PropertiesManagement.findOneAndUpdate(
      { _id: id, isDeleted: false },
      updatedData,
      { new: true, runValidators: true }
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found or deleted",
      });
    }

    res.json({
      success: true,
      message: "Property updated successfully",
      data: property,
    });
  } catch (error) {
    console.error("UPDATE PROPERTY ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================
   DELETE PROPERTY (SOFT DELETE)
========================= */
exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await PropertiesManagement.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        isDeleted: true,
        propertyStatus: 'Inactive',
        updatedBy: req.user?.id || null,
      },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting property',
      error: error.message,
    });
  }
};
