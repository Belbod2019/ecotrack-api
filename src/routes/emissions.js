const express = require("express");
const router  = express.Router();
const { calculate, getProfiles, createProfile } = require("../controllers/emissionsController");
const { protect } = require("../middleware/auth");

router.get("/profiles",  protect, getProfiles);
router.post("/profiles", protect, createProfile);
router.post("/calculate", protect, calculate);

module.exports = router;