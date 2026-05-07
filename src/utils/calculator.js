/**
 * Calculate carbon emissions
 * @param {number} distanceKm   - Distance in kilometers
 * @param {number} weightTonnes - Cargo weight in tonnes
 * @param {number} factor       - Emission factor (kg CO2 per tonne per km)
 * @returns {object} - emissions in kg and tonnes
 */
const calculateEmissions = (distanceKm, weightTonnes, factor) => {
  const emissionsKg = distanceKm * weightTonnes * factor;
  const emissionsTonnes = emissionsKg / 1000;
  return {
    distanceKm,
    weightTonnes,
    emissionsKg: +emissionsKg.toFixed(4),
    emissionsTonnes: +emissionsTonnes.toFixed(6),
  };
};

module.exports = { calculateEmissions };