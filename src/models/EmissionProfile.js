const mongoose = require("mongoose");

const EmissionProfileSchema = new mongoose.Schema({
  vehicleType: {
    type: String,
    enum: ["truck", "van", "ship", "plane", "rail"],
    required: true,
  },
  // kg of CO2 per tonne per km
  emissionFactor: { type: Number, required: true },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("EmissionProfile", EmissionProfileSchema);