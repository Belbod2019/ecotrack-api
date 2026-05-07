require("dotenv").config();
const mongoose = require("mongoose");
const EmissionProfile = require("../models/EmissionProfile");
const connectDB = require("../config/db");

const profiles = [
  {
    vehicleType: "truck",
    emissionFactor: 0.1,
    description:
      "Heavy goods vehicle (HGV). Standard diesel truck used for road freight. Avg 0.1 kg CO2 per tonne per km.",
  },
  {
    vehicleType: "van",
    emissionFactor: 0.2,
    description:
      "Light commercial vehicle. Used for last-mile delivery in urban areas. Higher factor due to smaller load capacity.",
  },
  {
    vehicleType: "ship",
    emissionFactor: 0.012,
    description:
      "Ocean freight / cargo ship. Most carbon-efficient transport for long-distance bulk goods.",
  },
  {
    vehicleType: "plane",
    emissionFactor: 0.602,
    description:
      "Air freight. Highest carbon emitter per tonne per km. Used for urgent or high-value shipments.",
  },
  {
    vehicleType: "rail",
    emissionFactor: 0.028,
    description:
      "Rail freight. Low-emission land transport. Efficient for medium to long distance inland routes.",
  },
];

const seedDB = async () => {
  try {
    await connectDB();

    // Clear existing profiles
    await EmissionProfile.deleteMany();
    console.log("🗑️  Cleared existing emission profiles");

    // Insert new profiles
    const inserted = await EmissionProfile.insertMany(profiles);
    console.log(`✅ Seeded ${inserted.length} emission profiles:`);

    inserted.forEach((p) => {
      console.log(
        `   - ${p.vehicleType.toUpperCase()}: ${p.emissionFactor} kg CO2/tonne/km`
      );
    });

    console.log("\n🌿 Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
};

seedDB();