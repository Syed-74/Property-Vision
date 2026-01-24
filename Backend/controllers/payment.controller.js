const Rent = require("../models/rent.models");

exports.getAllPayments = async (req, res) => {
  try {
    const rents = await Rent.find()
      .populate({
        path: "tenantId",
        select: "fullName",
      })
      .populate({
        path: "unitId",
        select: "unitNumber propertyId",
        populate: {
          path: "propertyId",
          select: "propertyName",
        },
      })
      .sort({ createdAt: -1 });

    const payments = rents.map(r => ({
      _id: r._id,
      tenantName: r.tenantId?.fullName || "—",
      propertyName: r.unitId?.propertyId?.propertyName || "—",
      unitNumber: r.unitId?.unitNumber || "—",
      month: r.month,
      rentAmount: r.rentAmount,
      maintenanceAmount: r.maintenanceAmount,
      totalAmount: r.totalAmount,
      paymentStatus: r.paymentStatus,
      paidOn: r.paidOn,
    }));

    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: error.message,
    });
  }
};
