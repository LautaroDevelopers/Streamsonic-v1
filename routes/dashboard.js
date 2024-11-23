const express = require("express");
const router = express.Router();
const conexion = require("../database/db");

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

router.get("/add-channel", (req, res) => {
  res.render("dashboard/add-channel"); // Crea esta vista.
});

router.post("/add-channel", (req, res) => {
  const { name, logo_url, video_url, category } = req.body;
  conexion.query(
    "INSERT INTO channels (name, logo_url, video_url, category) VALUES (?, ?, ?, ?)",
    [name, logo_url, video_url, category],
    (err) => {
      if (err) throw err;
      res.redirect("/channels"); // Redirige a la lista de canales.
    }
  );
});

router.get("/channels", (req, res) => {
  conexion.query("SELECT * FROM channels", (err, results) => {
    if (err) throw err;
    res.render("dashboard/channels", { channels: results });
  });
});

router.get("/channel/:id", (req, res) => {
  const channelId = req.params.id;
  conexion.query(
    "SELECT * FROM channels WHERE id = ?",
    [channelId],
    (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        res.render("dashboard/player", { channel: results[0] });
      } else {
        res.redirect("/channels");
      }
    }
  );
});

router.get("/profile", (req, res) => {
  res.render("layouts/dashboard", {
    user: req.user,
    title: "Perfil",
    body: "../dashboard/profile",
  });
});

module.exports = router;
