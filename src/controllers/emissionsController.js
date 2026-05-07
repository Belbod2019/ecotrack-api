const axios = require("axios");
const EmissionProfile = require("../models/EmissionProfile");
const User = require("../models/User");
const { calculateEmissions } = require("../utils/calculator");

// @POST /api/emissions/calculate
const calculate = async (req, res) => {
  try {
    const { originCoords, destinationCoords, weightTonnes, vehicleType } = req.body;

    if (!originCoords || !destinationCoords || !weightTonnes || !vehicleType)
      return res.status(400).json({ message: "All fields required" });

    // 1. Get emission profile from DB
    const profile = await EmissionProfile.findOne({ vehicleType });
    if (!profile)
      return res.status(404).json({ message: `No emission profile for: ${vehicleType}` });

    // 2. Get distance from Mapbox API
    const { lng: originLng, lat: originLat } = originCoords;
    const { lng: destLng,   lat: destLat   } = destinationCoords;

    const mapboxUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${originLng},${originLat};${destLng},${destLat}?access_token=${process.env.MAPBOX_TOKEN}`;

    const mapboxRes = await axios.get(mapboxUrl);
    const route = mapboxRes.data.routes[0];

    if (!route)
      return res.status(400).json({ message: "Could not calculate route distance" });

    const distanceKm = +(route.distance / 1000).toFixed(2);

    // 3. Calculate emissions
    const result = calculateEmissions(distanceKm, weightTonnes, profile.emissionFactor);

    // 4. Increment user's call count (billing tracking)
    await User.findByIdAndUpdate(req.user._id, { $inc: { callCount: 1 } });

    res.json({
      vehicleType,
      ...result,
      emissionFactor: profile.emissionFactor,
      unit: "kg CO2 per tonne per km",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/emissions/profiles  — list all vehicle profiles
const getProfiles = async (req, res) => {
  try {
    const profiles = await EmissionProfile.find();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/emissions/profiles  — seed or add a profile (admin use)
const createProfile = async (req, res) => {
  try {
    const { vehicleType, emissionFactor, description } = req.body;
    const profile = await EmissionProfile.create({ vehicleType, emissionFactor, description });
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { calculate, getProfiles, createProfile };