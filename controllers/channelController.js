const conexion = require("../database/db");

exports.getChannels = (req, res) => {
  conexion.query("SELECT * FROM channels", (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error al obtener los canales");
    } else {
      res.render("dashboard/tv", { channels: results });
    }
  });
};
