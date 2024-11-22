const express = require("express");
const router = express.Router();
const channelController = require("../controllers/channelController");

router.get("/", (req, res) => {
  res.render("layouts/dashboard", {
    user: req.user,
    title: "Dashboard",
    body: "../dashboard/home",
  });
});

router.get("/fm", (req, res) => {
  res.render("layouts/dashboard", {
    user: req.user,
    title: "FM",
    body: "../dashboard/fm",
  });
});

router.get("/tv", (req, res) => {
  res.render("layouts/dashboard", {
    user: req.user,
    title: "TV",
    body: "../dashboard/tv",
  });
});

router.get("/player/:id", channelController.playChannel, (req, res) => {
  res.render("layouts/dashboard", {
    user: req.user,
    title: "Player",
    body: "../dashboard/player",
  });
});

router.get("/profile", (req, res) => {
  res.render("layouts/dashboard", {
    user: req.user,
    title: "Perfil",
    body: "../dashboard/profile",
  });
});

module.exports = router;
