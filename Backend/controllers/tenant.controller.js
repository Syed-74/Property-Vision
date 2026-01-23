const Tenant = require("../models/tenant.model");
const Rent = require("../models/rent.models");
const Unit = require("../models/unit.model");

/* CREATE TENANT */
exports.createTenant = async (req, res) => {
  try {
    const tenant = await Tenant.create(req.body);

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
  const tenant = await Tenant.findByIdAndUpdate(
    req.params.id,
    { status: "Vacated", isDeleted: true },
    { new: true }
  );

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
