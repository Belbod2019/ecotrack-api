require("dotenv").config();
const express   = require("express");
const cors      = require("cors");
const helmet    = require("helmet");
const morgan    = require("morgan");
const connectDB = require("./config/db");

const authRoutes      = require("./routes/auth");
const emissionRoutes  = require("./routes/emissions");

connectDB();

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Health check
app.get("/", (req, res) => res.json({ message: "🌿 EcoTrack API is running" }));

// Routes
app.use("/api/auth",      authRoutes);
app.use("/api/emissions", emissionRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));