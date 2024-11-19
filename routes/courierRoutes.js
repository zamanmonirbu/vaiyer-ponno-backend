const express = require("express");
const router = express.Router();
const {
  registerCourier,
  loginCourier,
  getCourierProfile,
  updateCourierProfile,
  getAllCouriers
} = require("../controllers/courierController");
const { courierAuth } = require("../middleware/authMiddleware"); // Protect middleware

// POST /api/couriers/register
router.post("/register", registerCourier);

// POST /api/couriers/login
router.post("/login", loginCourier);

// GET /api/couriers/profile (Protected Route)
router.get("/profile/:courierId", getCourierProfile);

router.put("/profile/:courierId", updateCourierProfile);

router.get("/", getAllCouriers); // Route to get all couriers



module.exports = router;
