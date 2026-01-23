const PropertiesManagement = require('../models/Propertiesmanagement');
const generatePropertyId = require('../utils/generatePropertyId');
/* =========================
   CREATE PROPERTY
========================= */
// exports.createProperty = async (req, res) => {
//   try {
//     const propertyData = req.body;

//     // Optional: attach logged-in user
//     propertyData.createdBy = req.user?.id || null;

//     const property = await PropertiesManagement.create(propertyData);

//     return res.status(201).json({
//       success: true,
//       message: 'Property created successfully',
//       data: property,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: 'Error creating property',
//       error: error.message,
//     });
//   }
// };



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
// exports.updateProperty = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const updatedData = {
//       ...req.body,
//       updatedBy: req.user?.id || null,
//     };

//     const property = await PropertiesManagement.findOneAndUpdate(
//       { _id: id, isDeleted: false },
//       updatedData,
//       { new: true, runValidators: true }
//     );

//     if (!property) {
//       return res.status(404).json({
//         success: false,
//         message: 'Property not found',
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: 'Property updated successfully',
//       data: property,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: 'Error updating property',
//       error: error.message,
//     });
//   }
// };


exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID' });
    }

    const updatedData = { ...req.body };
    delete updatedData.propertyId;

    const property = await PropertiesManagement.findOneAndUpdate(
      { _id: id, isDeleted: false },
      updatedData,
      { new: true, runValidators: true }
    );

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: property,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
