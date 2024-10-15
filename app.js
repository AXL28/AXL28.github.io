// Variables para el sistema de juego
let level = localStorage.getItem('level') ? parseInt(localStorage.getItem('level')) : 1;
let points = localStorage.getItem('points') ? parseInt(localStorage.getItem('points')) : 0;
let coins = localStorage.getItem('coins') ? parseInt(localStorage.getItem('coins')) : 0;
let history = localStorage.getItem('history') ? JSON.parse(localStorage.getItem('history')) : [];
const pointsPerHabit = 20;
const maxPoints = 100;
const achievements = localStorage.getItem('achievements') ? JSON.parse(localStorage.getItem('achievements')) : [];

// Elementos del DOM
const levelDisplay = document.getElementById("level");
const pointsDisplay = document.getElementById("points");
const progressBar = document.getElementById("progress-bar");
const habitInput = document.getElementById("habit-input");
const habitList = document.getElementById("habit-list");
const addHabitBtn = document.getElementById("add-habit-btn");
const levelUpNotification = document.getElementById("level-up-notification");
const achievementsList = document.getElementById("achievements-list");
const completeSound = document.getElementById("complete-sound");
const levelUpSound = document.getElementById("level-up-sound");
const coinsDisplay = document.getElementById("coins");
const rankDisplay = document.getElementById("rank");
    const historyList = document.getElementById("history-list");
    const dailyMissionsContainer = document.getElementById("mission-list");
    const avatarImage = document.getElementById("user-avatar"); // Elemento del avatar
    
    // Cargar progreso
    function loadGame() {
        levelDisplay.textContent = level;
        pointsDisplay.textContent = points;
        coinsDisplay.textContent = coins;
        const progressPercentage = (points / maxPoints) * 100;
        progressBar.style.width = progressPercentage + "%";
        loadAchievements();
        loadHistory();
        updateRank();
        updateCoins();
    }
    
    // Función para agregar un hábito
    function addHabit() {
        const habitText = habitInput.value.trim();
        if (habitText === "") return;
    
        // Crear un nuevo hábito en la lista
        const habitItem = document.createElement("li");
        habitItem.className = "bg-gray-800 p-2 rounded-md flex justify-between items-center";
        habitItem.innerHTML = `
            <span>${habitText}</span>
            <button class="complete-btn bg-green-500 p-1 rounded-md">Completar</button>
        `;
    
        // Agregar el evento de "completar" al botón
        habitItem.querySelector(".complete-btn").addEventListener("click", () => {
            completeHabit(habitItem, habitText);
        });
    
        habitList.appendChild(habitItem);
        habitInput.value = ""; // Limpiar el input
    }
    
    // Función para completar un hábito
    function completeHabit(habitItem, habitText) {
        completeSound.play();
        habitList.removeChild(habitItem);
    
        points += pointsPerHabit;
        coins += 5; // Ganas 5 monedas por completar un hábito
        addHabitToHistory(habitText); // Añadir al historial
        updateCoins();
    
        if (points >= maxPoints) {
            levelUp();
        } else {
            updateGame();
        }
    
        saveGame();
    }
    
    // Función para subir de nivel
    function levelUp() {
        level++;
        points = points - maxPoints;
    
        levelUpSound.play();
        levelUpNotification.classList.remove("hidden");
        setTimeout(() => {
            levelUpNotification.classList.add("hidden");
        }, 2000);
    
        checkForAchievements();
        updateGame();
        saveGame();
    }
    
    // Función para actualizar la interfaz
    function updateGame() {
        levelDisplay.textContent = level;
        pointsDisplay.textContent = points;
    
        const progressPercentage = (points / maxPoints) * 100;
        progressBar.style.width = progressPercentage + "%";
    }
    
    // Guardar progreso en localStorage
    function saveGame() {
        localStorage.setItem('level', level);
        localStorage.setItem('points', points);
        localStorage.setItem('coins', coins);
        localStorage.setItem('history', JSON.stringify(history));
        localStorage.setItem('achievements', JSON.stringify(achievements));
    }
    
    // Función para cargar logros
    function loadAchievements() {
        achievementsList.innerHTML = "";
        achievements.forEach(achievement => {
            const li = document.createElement("li");
            li.textContent = achievement;
            achievementsList.appendChild(li);
        });
    }
    
    // Función para revisar logros
    function checkForAchievements() {
        const achievementLevels = [5, 10, 15];
        if (achievementLevels.includes(level)) {
            const achievement = `¡Has alcanzado el nivel ${level}!`;
            achievements.push(achievement);
    
            const li = document.createElement("li");
            li.textContent = achievement;
            achievementsList.appendChild(li);
        }
    }
    
    // Función para actualizar rango
    function updateRank() {
        if (level >= 10 && level < 20) {
            rankDisplay.textContent = "Guerrero de Hábitos";
        } else if (level >= 20 && level < 30) {
            rankDisplay.textContent = "Maestro del Tiempo";
        } else if (level >= 30) {
            rankDisplay.textContent = "Leyenda de los Hábitos";
        } else {
            rankDisplay.textContent = "Principiante";
        }
    }
    
    // Función para actualizar monedas
    function updateCoins() {
        coinsDisplay.textContent = coins;
    }
    
    // Función para agregar hábito al historial
    function addHabitToHistory(habitName) {
        const date = new Date().toLocaleString();
        const historyItem = {
            habit: habitName,
            date: date
        };
        history.push(historyItem);
        updateHistoryList();
    }
    
    // Función para actualizar la lista del historial en el DOM
    function updateHistoryList() {
        historyList.innerHTML = "";
        history.forEach(entry => {
            const li = document.createElement("li");
            li.textContent = `${entry.habit} - Completado el ${entry.date}`;
            historyList.appendChild(li);
        });
    }
    
    // Cargar historial guardado
    function loadHistory() {
        updateHistoryList();
    }
    
    // Usar event delegation para misiones diarias
    dailyMissionsContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("complete-mission-btn")) {
            const missionItem = e.target.parentElement;
            if (!e.target.disabled) {  // Prevenir que se vuelva a completar
                missionItem.classList.add("bg-gray-500");
                e.target.disabled = true;
                coins += 10; // Ganas 10 monedas por completar una misión
                updateCoins();
                saveGame();
            }
        }
    });
    
    // Usar event delegation para los botones de la tienda
    document.getElementById("store").addEventListener("click", function (e) {
        if (e.target.classList.contains("buy-btn")) {
            const cost = parseInt(e.target.textContent.match(/\d+/));
            const item = e.target.previousElementSibling.textContent;
    
            if (coins >= cost) {
                coins -= cost;
                updateCoins();
    
                // Cambiar avatar si se compra uno nuevo
                if (item === "Nuevo Avatar") {
                    changeAvatar("images/new-avatar.png"); // Asegúrate de tener la ruta correcta aquí
                }
    
                alert("¡Has comprado " + item + "!");
            } else {
                alert("No tienes suficientes monedas.");
            }
        }
    });
    
    // Función para cambiar el avatar
    function changeAvatar(newAvatar) {
        avatarImage.src = newAvatar;
    }
    
    // Agregar evento al botón de agregar hábito
    addHabitBtn.addEventListener("click", addHabit);
    
    // Agregar evento de teclado para el Enter
    habitInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            addHabit();
        }
    });
    
    // Cargar el juego al inicio
    loadGame();
    