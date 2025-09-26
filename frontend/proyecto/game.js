// Obtener elementos del DOM
const startScreen = document.getElementById('start-screen');
const gamePlay = document.getElementById('game-play');
const endScreen = document.getElementById('end-screen');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const gameCanvas = document.getElementById('gameCanvas');
const finalScoreDisplay = document.getElementById('finalScore');
const finalLevelDisplay = document.getElementById('finalLevel');
const playerNameInput = document.getElementById('playerNameInput');
const leaderboardTableBody = document.querySelector('#leaderboard tbody');
const currentScoreDisplay = document.getElementById('currentScore');
const currentLevelDisplay = document.getElementById('currentLevel');
const changeNameButton = document.getElementById('changeNameButton');

const ctx = gameCanvas.getContext('2d');

// Variables del juego
let player = {
    x: 50,
    y: 370,
    width: 30,
    height: 30,
    color: '#00ff00',
    velocityY: 0,
    isJumping: false
};
let obstacles = [];
let score = 0;
let level = 1;
let isGameOver = false;
let playerName = 'Jugador Anónimo';

let scoreInterval;

const gravity = 0.5;
const jumpStrength = -10;
const obstacleSpeedBase = 3;

// Mostrar pantallas
function showScreen(screenId) {
    const screens = [startScreen, gamePlay, endScreen];
    screens.forEach(screen => {
        if (screen.id === screenId) {
            screen.classList.add('active');
        } else {
            screen.classList.remove('active');
        }
    });
}

// Bucle principal
function gameLoop() {
    if (isGameOver) {
        endGame();
        return;
    }

    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Jugador
    player.velocityY += gravity;
    player.y += player.velocityY;

    if (player.y > 370) {
        player.y = 370;
        player.velocityY = 0;
        player.isJumping = false;
    }

    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Obstáculos
    obstacles.forEach((obstacle, index) => {
        obstacle.x -= obstacle.speed;
        ctx.fillStyle = '#00ff00';

        // Dibujar obstáculo basado en su tipo
        if (obstacle.type === 'square') {
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        } else if (obstacle.type === 'triangle') {
            ctx.beginPath();
            ctx.moveTo(obstacle.x, obstacle.y + obstacle.height);
            ctx.lineTo(obstacle.x + obstacle.width / 2, obstacle.y);
            ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
            ctx.closePath();
            ctx.fill();
        }

        // Detección de colisión (se mantiene la lógica de colisión de rectángulo a rectángulo)
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            isGameOver = true;
        }

        // Eliminar obstáculos que salen de la pantalla
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
        }
    });

    // Nivel dinámico
    const newLevel = Math.floor(score / 50) + 1;
    if (newLevel !== level) {
        level = newLevel;
        currentLevelDisplay.textContent = level;
    }

    requestAnimationFrame(gameLoop);
}

// Iniciar juego
function startGame() {
    playerName = playerNameInput.value || 'Jugador Anónimo';
    
    score = 0;
    level = 1;
    isGameOver = false;
    obstacles = [];
    player.y = 370;
    player.velocityY = 0;
    currentScoreDisplay.textContent = score;
    currentLevelDisplay.textContent = level;

    showScreen('game-play');

    requestAnimationFrame(gameLoop);

    setTimeout(createObstacle, 1000);

    scoreInterval = setInterval(() => {
        score++;
        currentScoreDisplay.textContent = score;
    }, 100);
}

// Terminar juego
function endGame() {
    clearInterval(scoreInterval);
    saveScore();
    renderLeaderboard();
    finalScoreDisplay.textContent = score;
    finalLevelDisplay.textContent = level;
    showScreen('end-screen');
}

// Crear obstáculos
function createObstacle() {
    if (isGameOver) return;
    
    const obstacleHeight = 20 + Math.random() * 50;
    const obstacleWidth = 20 + Math.random() * 30;
    const obstacleY = 400 - obstacleHeight;
    const speed = obstacleSpeedBase + level * 0.5;

    // Elegir una forma aleatoria
    const forms = ['square', 'triangle'];
    const randomForm = forms[Math.floor(Math.random() * forms.length)];

    obstacles.push({
        x: gameCanvas.width,
        y: obstacleY,
        width: obstacleWidth,
        height: obstacleHeight,
        speed: speed,
        type: randomForm
    });
    
    // Llamada recursiva para el siguiente obstáculo
    const nextObstacleTime = 2000 - (level * 100);
    setTimeout(createObstacle, nextObstacleTime > 500 ? nextObstacleTime : 500);
}

// Saltar
function handleJump(event) {
    if (event.code === 'Space' && !player.isJumping && !isGameOver) {
        player.velocityY = jumpStrength;
        player.isJumping = true;
    }
}

// Leaderboard
function getLeaderboard() {
    const leaderboard = localStorage.getItem('retroRunnerLeaderboard');
    return leaderboard ? JSON.parse(leaderboard) : [];
}

function saveScore() {
    let leaderboard = getLeaderboard();
    const newEntry = { name: playerName, score, level };

    // Buscar si el jugador ya existe en la tabla de clasificación
    const existingPlayerIndex = leaderboard.findIndex(entry => entry.name === playerName);

    if (existingPlayerIndex !== -1) {
        // El jugador ya existe, verificar si la nueva puntuación es mayor
        if (newEntry.score > leaderboard[existingPlayerIndex].score) {
            // Eliminar la entrada antigua y agregar la nueva con mejor puntuación
            leaderboard.splice(existingPlayerIndex, 1);
            leaderboard.push(newEntry);
        }
    } else {
        // El jugador no existe, agregarlo a la tabla
        leaderboard.push(newEntry);
    }

    // Ordenar la tabla de clasificación de mayor a menor puntuación
    leaderboard.sort((a, b) => b.score - a.score);

    // Limitar la tabla a los 4 mejores jugadores
    if (leaderboard.length > 4) {
        leaderboard.length = 4;
    }

    // Guardar la tabla actualizada en el almacenamiento local
    localStorage.setItem('retroRunnerLeaderboard', JSON.stringify(leaderboard));
}

function renderLeaderboard() {
    const leaderboard = getLeaderboard();
    leaderboardTableBody.innerHTML = '';

    if (leaderboard.length === 0) {
        leaderboardTableBody.innerHTML = '<tr><td colspan="4">No hay puntuaciones aún. ¡Sé el primero!</td></tr>';
        return;
    }

    leaderboard.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.score}</td>
            <td>${entry.level}</td>
        `;
        leaderboardTableBody.appendChild(row);
    });
}

// Función para reiniciar y cambiar el nombre
function restartAndChangeName() {
    showScreen('start-screen');
    playerNameInput.value = '';
}

// Eventos
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
document.addEventListener('keydown', handleJump);
changeNameButton.addEventListener('click', restartAndChangeName);

window.onload = () => {
    showScreen('start-screen');
    renderLeaderboard();
};