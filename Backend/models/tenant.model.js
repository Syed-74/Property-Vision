const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema(
  {
    tenantCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    fullName: { type: String, required: true },
    phone: String,
    email: String,

    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PropertiesManagement",
      required: true,
    },

    floorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Floor",
      required: true,
    },

    unitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      required: true,
      unique: true, // ❗ One tenant per unit
    },

    rentAmount: { type: Number, required: true },
    maintenanceAmount: { type: Number, default: 0 },

    leaseStartDate: { type: Date, required: true },
    leaseEndDate: Date,

    status: {
      type: String,
      enum: ["Active", "Vacated"],
      default: "Active",
    },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tenant", tenantSchema);
