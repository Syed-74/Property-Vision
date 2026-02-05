const Tenant = require("../models/tenant.model");
const Rent = require("../models/rent.models");
const Unit = require("../models/unit.model");

/* CREATE TENANT */
// tenant.controller.js
// tenant.controller.js
exports.createTenant = async (req, res) => {
  try {
    const files = req.files || {};

    const tenant = await Tenant.create({
      ...req.body,
      aadhaarCard: files.aadhaarCard?.[0]?.path,
      panCard: files.panCard?.[0]?.path,
      bondPaper: files.bondPaper?.[0]?.path,
    });

    await Unit.findByIdAndUpdate(tenant.unitId, {
      availabilityStatus: "Occupied",
    });

    res.status(201).json({ success: true, data: tenant });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};




/* GET ALL TENANTS */
exports.getAllTenants = async (req, res) => {
  const tenants = await Tenant.find({ isDeleted: false })
    .populate("propertyId", "propertyName")
    .populate("floorId", "floorNumber floorName")
    .populate("unitId", "unitNumber");

  res.json({ success: true, data: tenants });
};

/* VACATE TENANT */
exports.deleteTenant = async (req, res) => {
  const tenant = await Tenant.findById(req.params.id);

  await Tenant.findByIdAndUpdate(req.params.id, {
    status: "Vacated",
    isDeleted: true,
    unitId: null,
  });

  await Unit.findByIdAndUpdate(tenant.unitId, {
    availabilityStatus: "Available",
  });

  res.json({ success: true });
};


/* ADD MONTHLY RENT */
exports.addMonthlyRent = async (req, res) => {
  const tenant = await Tenant.findById(req.params.tenantId);

  const rent = await Rent.create({
    tenantId: tenant._id,
    unitId: tenant.unitId,
    month: req.body.month,
    rentAmount: req.body.rentAmount,
    maintenanceAmount: req.body.maintenanceAmount || 0,
    totalAmount:
      Number(req.body.rentAmount) +
      Number(req.body.maintenanceAmount || 0),
    paymentStatus: req.body.paymentStatus,
    paidOn: req.body.paidOn,
  });

  res.json({ success: true, data: rent });
};

/* GET RENT HISTORY */
exports.getTenantRents = async (req, res) => {
  const rents = await Rent.find({ tenantId: req.params.tenantId })
    .sort({ month: -1 });

  res.json({ success: true, data: rents });
};


exports.getTenantById = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id)
      .populate("propertyId", "propertyName")
      .populate("floorId", "floorName floorNumber")
      .populate("unitId", "unitNumber");

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    res.json({ success: true, data: tenant });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};


/* UPDATE RENT */
exports.updateRent = async (req, res) => {
  try {
    const rent = await Rent.findByIdAndUpdate(
      req.params.rentId,
      {
        rentAmount: req.body.rentAmount,
        maintenanceAmount: req.body.maintenanceAmount,
        paymentStatus: req.body.paymentStatus,
        paidOn: req.body.paidOn,
        totalAmount:
          Number(req.body.rentAmount) +
          Number(req.body.maintenanceAmount || 0),
      },
      { new: true }
    );

    res.json({ success: true, data: rent });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/* DELETE RENT */
exports.deleteRent = async (req, res) => {
  await Rent.findByIdAndDelete(req.params.rentId);
  res.json({ success: true });
};

/* DOWNLOAD RECEIPT */
const { generateReceiptPDF } = require("../utils/pdfGenerator");
exports.downloadRentReceipt = async (req, res) => {
  try {
    const rent = await Rent.findById(req.params.rentId);
    if (!rent) return res.status(404).json({ message: "Rent record not found" });

    // Ensure payment is Paid
    if (rent.paymentStatus !== "Paid") {
      return res.status(400).json({ message: "Receipt available only for Paid records" });
    }

    const tenant = await Tenant.findById(rent.tenantId)
      .populate("unitId", "unitNumber");

    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    generateReceiptPDF(rent, tenant, res);

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error generating receipt" });
  }
};
