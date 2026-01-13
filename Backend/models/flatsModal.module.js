const mongoose = require("mongoose");

const flatsModelSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PropertiesManagement",
      required: true,
    },
    flatName: {
      type: String,
      required: true,
    },
    flatNo: {
      type: String,
      required: true,
    },
    floorNo: {
      type: String,
    },
    bedRoom: {
      type: Number,
      default: 0,
    },
    bathRoom: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const FlatsModel = mongoose.model("Flats", flatsModelSchema);

module.exports = FlatsModel;
