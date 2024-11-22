const conexion = require("../database/db");
exports.playChannel = async (req, res) => {
  const channelId = req.params.id;

  conexion.query(
    "SELECT * FROM channels WHERE id = ?",
    [channelId],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error al cargar el canal");
      } else if (results.length === 0) {
        res.status(404).send("Canal no encontrado");
      } else {
        res.render("dashboard/player", { channel: results[0] });
      }
    }
  );
};
