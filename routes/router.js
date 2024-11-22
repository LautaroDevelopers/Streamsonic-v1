const express = require("express");
const router = express.Router();
const dashboard = require("./dashboard");
const auth = require("./auth");
const landing = require("./landing");

const authController = require("../controllers/authController");
// note: landing
router.use("/home", landing);

// note: autenticación
router.use("/auth", auth);

// note: dashboard
router.use("/", authController.isAuthenticated, dashboard);

module.exports = router;
