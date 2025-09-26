// server.js

// Importamos las dependencias que instalamos (express y cors)
const express = require("express");
const cors = require("cors");

// Importamos las rutas de puntuaciones
const scoresRoutes = require("./scores.routes");

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(cors());

// Ruta de prueba
app.get("/", (req, res) => {
    res.send("🚀 Servidor RunnerJS funcionando correctamente!");
});

// Usamos las rutas de puntuaciones bajo el prefijo '/api'
app.use("/api", scoresRoutes); // CAMBIO: Usamos /api como prefijo

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});