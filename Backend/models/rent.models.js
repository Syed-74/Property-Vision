const mongoose = require("mongoose");

const rentSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    unitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      required: true,
    },

    month: {
      type: String, // YYYY-MM
      required: true,
    },

    rentAmount: { type: Number, required: true },
    maintenanceAmount: { type: Number, default: 0 },

    totalAmount: { type: Number, required: true },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Late"],
      default: "Pending",
    },

    paidOn: Date,
  },
  { timestamps: true }
);

// ❗ Prevent duplicate month
rentSchema.index({ tenantId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("Rent", rentSchema);
