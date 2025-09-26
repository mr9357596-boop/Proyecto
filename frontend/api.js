// URL base de nuestro backend
// Cambia localhost:3000 por tu URL si subes el backend a Render/Railway
const BASE_URL = "http://localhost:3000/scores";

/**
 * Función para obtener todas las puntuaciones
 * Devuelve un array de objetos: { name, score, level }
 */
async function obtenerScores() {
  try {
    const response = await fetch(BASE_URL);
    const scores = await response.json();
    return scores;
  } catch (error) {
    console.error("Error obteniendo scores:", error);
    // Si el servidor no está disponible, usamos localStorage
    return JSON.parse(localStorage.getItem("scores") || "[]");
  }
}

/**
 * Función para guardar una puntuación
 * @param {string} name - Nombre del jugador
 * @param {number} score - Puntaje obtenido
 * @param {number} level - Nivel alcanzado
 */
async function guardarScore(name, score, level) {
  const newScore = { name, score, level };

  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newScore)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error guardando score:", error);
    // Guardamos temporalmente en localStorage si falla el servidor
    const scores = JSON.parse(localStorage.getItem("scores") || "[]");
    scores.push(newScore);
    localStorage.setItem("scores", JSON.stringify(scores));
    return { message: "Guardado temporal en localStorage", scores };
  }
}
