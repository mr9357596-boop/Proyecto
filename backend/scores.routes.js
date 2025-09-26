const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Ruta al archivo donde guardamos las puntuaciones
const scoresFile = path.join(__dirname, "data", "scores.json");

// 🔹 GET: obtener todas las puntuaciones
router.get("/", (req, res) => {
  fs.readFile(scoresFile, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error leyendo scores" });
    }
    const scores = JSON.parse(data);
    res.json(scores);
  });
});

// 🔹 POST: guardar una nueva puntuación
router.post("/", (req, res) => {
  const newScore = req.body; // { name: "Maria", score: 120, level: 3 }

  fs.readFile(scoresFile, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error leyendo scores" });
    }

    let scores = JSON.parse(data);

    // Agregamos la nueva puntuación al arreglo
    scores.push(newScore);

    // Ordenamos por score descendente
    scores.sort((a, b) => b.score - a.score);

    // Guardamos nuevamente en el archivo
    fs.writeFile(scoresFile, JSON.stringify(scores, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: "Error guardando scores" });
      }
      res.json({ message: "Puntuación guardada correctamente", scores });
    });
  });
});

module.exports = router;
