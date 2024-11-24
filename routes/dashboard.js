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

// Renderizamos los canales en la vista TV
router.get("/tv", channelController.getChannels);

router.get("/add-channel", (req, res) => {
  res.render("dashboard/add-channel");
});

router.post("/add-channel", channelController.addChannel);

// Ruta para reproducir un canal
router.get("/channel/:id", channelController.getChannelById);

router.get("/profile", (req, res) => {
  res.render("layouts/dashboard", {
    user: req.user,
    title: "Perfil",
    body: "../dashboard/profile",
  });
});

module.exports = router;
