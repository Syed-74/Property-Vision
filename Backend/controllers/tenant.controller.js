const Tenant = require("../models/tenant.model");

/* ================= CREATE TENANT ================= */

exports.createTenant = async (req, res) => {
  try {
    // Check duplicate tenantId
    const existingTenant = await Tenant.findOne({
      tenantId: req.body.tenantId,
      isDeleted: false,
    });

    if (existingTenant) {
      return res.status(400).json({
        success: false,
        message: "Tenant already exists with this Tenant ID",
      });
    }

    const tenant = await Tenant.create({
      ...req.body,
      createdBy: req.user?.id || null, // from auth middleware
    });

    res.status(201).json({
      success: true,
      message: "Tenant created successfully",
      data: tenant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create tenant",
      error: error.message,
    });
  }
};

/* ================= GET ALL TENANTS ================= */

exports.getAllTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find({ isDeleted: false })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tenants.length,
      data: tenants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tenants",
      error: error.message,
    });
  }
};

/* ================= GET TENANT BY ID ================= */

exports.getTenantById = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate("createdBy", "name email");

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    res.status(200).json({
      success: true,
      data: tenant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tenant",
      error: error.message,
    });
  }
};

/* ================= UPDATE TENANT ================= */

exports.updateTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    ).populate("createdBy", "name email");

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found or already deleted",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tenant updated successfully",
      data: tenant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update tenant",
      error: error.message,
    });
  }
};

/* ================= DELETE TENANT (SOFT DELETE) ================= */

exports.deleteTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tenant deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete tenant",
      error: error.message,
    });
  }
};
