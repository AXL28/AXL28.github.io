// Variables para el sistema de juego
let level = localStorage.getItem('level') ? parseInt(localStorage.getItem('level')) : 1;
let points = localStorage.getItem('points') ? parseInt(localStorage.getItem('points')) : 0;
let coins = localStorage.getItem('coins') ? parseInt(localStorage.getItem('coins')) : 0;
let history = localStorage.getItem('history') ? JSON.parse(localStorage.getItem('history')) : [];
let avatars = localStorage.getItem('avatars') ? JSON.parse(localStorage.getItem('avatars')) : [];
let unlockedItems = localStorage.getItem('unlockedItems') ? parseInt(localStorage.getItem('unlockedItems')) : 1; // Primer avatar desbloqueado
const storeItems = [
    { name: "Avatar 1", cost: 50, image: "images/avatar1.png" },
    { name: "Avatar 2", cost: 100, image: "images/avatar2.png" },
    { name: "Avatar 3", cost: 150, image: "images/avatar3.png" },
    { name: "Avatar 4", cost: 200, image: "images/avatar4.png" },
    { name: "Avatar 5", cost: 250, image: "images/avatar5.png" },
    { name: "Avatar 6", cost: 300, image: "images/avatar6.png" },
    { name: "Avatar 7", cost: 350, image: "images/avatar7.png" },
    { name: "Avatar 8", cost: 400, image: "images/avatar8.png" },
    { name: "Avatar 9", cost: 450, image: "images/avatar9.png" }
];
const pointsPerHabit = 20;
const maxPoints = 100;
const achievements = localStorage.getItem('achievements') ? JSON.parse(localStorage.getItem('achievements')) : [];

// Elementos del DOM
const levelDisplay = document.getElementById("level");
const pointsDisplay = document.getElementById("points");
const progressBar = document.getElementById("progress-bar");
const habitInput = document.getElementById("habit-input");
const timeInput = document.getElementById("time-input"); 
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
const avatarImage = document.getElementById("user-avatar");
const storeContainer = document.getElementById("store-items");
const avatarSelect = document.getElementById("avatar-select");

// Cargar progreso
function loadGame() {
    levelDisplay.textContent = level;
    pointsDisplay.textContent = points;
    coinsDisplay.textContent = coins;
    const progressPercentage = (points / maxPoints) * 100;
    progressBar.style.width = progressPercentage + "%";
    avatarImage.src = localStorage.getItem('selectedAvatar') || "images/default-avatar.png"; // Establecer avatar actual
    loadAchievements();
    loadHistory();
    updateRank();
    updateCoins();
    loadAvatarOptions(); // Cargar opciones de avatares
}

// Función para agregar un hábito
function addHabit() {
    const habitText = habitInput.value.trim();
    const habitTime = parseInt(timeInput.value.trim()); // Tiempo definido por el usuario (minutos)

    if (habitText === "" || isNaN(habitTime) || habitTime <= 0) return; // Validar tiempo

    // Crear un nuevo hábito en la lista
    const habitItem = document.createElement("li");
    habitItem.className = "bg-gray-800 p-2 rounded-md flex justify-between items-center";
    habitItem.innerHTML = `
        <span>${habitText}</span>
        <button class="complete-btn bg-green-500 p-1 rounded-md">Completar</button>
        <span class="time-remaining">${habitTime}m</span> <!-- Mostrar el tiempo que el usuario ingresó -->
    `;

    // Guardar el tiempo configurado por el usuario en el elemento del hábito
    habitItem.dataset.habitTime = `${habitTime} minutos`;
    const startTime = Date.now(); // Guardar el tiempo de inicio

    // Agregar el evento de "completar" al botón
    const completeBtn = habitItem.querySelector(".complete-btn");
    completeBtn.addEventListener("click", () => completeHabit(habitItem, habitText, true, startTime));

    // Temporizador
    let timeRemaining = habitTime * 60; // Convertir minutos a segundos
    const intervalId = setInterval(() => {
        timeRemaining--;
        const minutesRemaining = Math.floor(timeRemaining / 60);
        const secondsRemaining = timeRemaining % 60;
        habitItem.querySelector(".time-remaining").textContent = `${minutesRemaining}m ${secondsRemaining}s`;

        if (timeRemaining <= 0) {
            clearInterval(intervalId);
            completeBtn.disabled = true; // Bloquear el botón cuando el tiempo se acabe
            completeHabit(habitItem, habitText, false, startTime); // Completar sin recompensa
        }
    }, 1000);

    habitList.appendChild(habitItem);
    habitInput.value = ""; // Limpiar el input
    timeInput.value = "";  // Limpiar el tiempo
}

// Función para completar un hábito
function completeHabit(habitItem, habitText, completedInTime, startTime) {
    const habitTime = habitItem.dataset.habitTime; // Obtener el tiempo configurado por el usuario
    const endTime = Date.now(); // Tiempo en el que se completó el hábito
    const timeTaken = Math.floor((endTime - startTime) / 1000); // Tiempo tomado en segundos
    const minutesTaken = Math.floor(timeTaken / 60);
    const secondsTaken = timeTaken % 60;
    const completionTime = `${minutesTaken}m ${secondsTaken}s`; // Tiempo real de completado

    habitList.removeChild(habitItem);

    if (completedInTime) {
        completeSound.play();
        points += pointsPerHabit;
        coins += 5; // Ganas 5 monedas por completar un hábito
        addHabitToHistory(habitText, habitTime, completionTime); // Añadir al historial con el tiempo configurado y el real
        updateCoins();
    }

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

// Función para guardar el progreso en localStorage
function saveGame() {
    localStorage.setItem('level', level);
    localStorage.setItem('points', points);
    localStorage.setItem('coins', coins);
    localStorage.setItem('history', JSON.stringify(history));
    localStorage.setItem('achievements', JSON.stringify(achievements));
    localStorage.setItem('avatars', JSON.stringify(avatars));
    localStorage.setItem('unlockedItems', unlockedItems);
    localStorage.setItem('selectedAvatar', avatarImage.src); // Guardar avatar seleccionado
}

// Función para agregar hábito al historial (incluye el tiempo configurado por el usuario y el tiempo real de completado)
function addHabitToHistory(habitName, habitTime, completionTime) {
    const date = new Date().toLocaleString();
    const historyItem = {
        habit: habitName,
        date: date,
        time: habitTime, // Guardar el tiempo configurado por el usuario
        completionTime: completionTime // Guardar el tiempo que tomó completarlo
    };
    history.push(historyItem);
    updateHistoryList();
}

// Función para actualizar la lista del historial en el DOM (incluye el tiempo configurado y el tiempo real de completado)
function updateHistoryList() {
    historyList.innerHTML = "";
    history.forEach(entry => {
        const li = document.createElement("li");
        li.textContent = `${entry.habit} - Completado el ${entry.date} (Tiempo previsto: ${entry.time}, Tiempo real: ${entry.completionTime})`;
        historyList.appendChild(li);
    });
}

// Cargar historial guardado
function loadHistory() {
    updateHistoryList();
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
    if (level >= 90 && level < 100) {
        rankDisplay.textContent = "Gran Maestro";
    } else if (level >= 80 && level < 90) {
        rankDisplay.textContent = "Mente Imbatible";
    } else if (level >= 70 && level < 80) {
        rankDisplay.textContent = "Gurú del Tiempo";
    } else if (level >= 60 && level < 70) {
        rankDisplay.textContent = "Campeón de la Persistencia";
    } else if (level >= 50 && level < 60) {
        rankDisplay.textContent = "Experto en Hábitos";
    } else if (level >= 40 && level < 50) {
        rankDisplay.textContent = "Ninja de la Disciplina";
    } else if (level >= 30 && level < 40) {
        rankDisplay.textContent = "Leyenda de los Hábitos";
    } else if (level >= 20 && level < 30) {
        rankDisplay.textContent = "Maestro del Tiempo";
    } else if (level >= 10 && level < 20) {
        rankDisplay.textContent = "Guerrero de Hábitos";
    } else {
        rankDisplay.textContent = "Principiante";
    }
}

// Función para actualizar monedas
function updateCoins() {
    coinsDisplay.textContent = coins;
}

// Función para cargar la tienda y mostrar solo los avatares aún no comprados
function loadStore() {
    storeContainer.innerHTML = '';  
    storeItems.slice(0, 9).forEach((item, index) => {
        if (!avatars.includes(item.image)) { // Mostrar solo si no está desbloqueado
            const li = document.createElement('li');
            li.className = 'bg-gray-700 p-2 rounded-md flex justify-between items-center';
            li.innerHTML = `
                <span>${item.name}</span>
                <button class="buy-btn bg-yellow-500 p-1 rounded-md">Comprar (${item.cost} monedas)</button>
            `;
            li.querySelector('.buy-btn').addEventListener('click', () => buyItem(index));
            storeContainer.appendChild(li);
        }
    });
}

// Función para comprar un avatar
function buyItem(index) {
    const item = storeItems[index];

    if (coins >= item.cost) {
        coins -= item.cost;
        updateCoins();

        // Añadir el nuevo avatar al array de avatares desbloqueados y actualizar la interfaz
        avatars.push(item.image);
        avatarImage.src = item.image; // Cambiar al avatar comprado inmediatamente
        alert(`¡Has comprado ${item.name}!`);
        saveGame();

        loadStore(); // Recargar la tienda para reflejar los elementos comprados
        loadAvatarOptions(); // Recargar las opciones de avatar en el selector
    } else {
        alert("No tienes suficientes monedas.");
    }
}

// Función para cargar las opciones de avatares en el selector
function loadAvatarOptions() {
    avatarSelect.innerHTML = ''; // Limpiar opciones previas

    // Agregar opción para el avatar predeterminado
    const defaultOption = document.createElement("option");
    defaultOption.value = "images/default-avatar.png";
    defaultOption.textContent = "Avatar Predeterminado";
    avatarSelect.appendChild(defaultOption);

    // Agregar opciones de avatares comprados
    avatars.forEach(avatar => {
        const option = document.createElement("option");
        option.value = avatar;
        option.textContent = `Avatar ${avatars.indexOf(avatar) + 1}`;
        avatarSelect.appendChild(option);
    });

    // Establecer el avatar seleccionado
    avatarSelect.value = avatarImage.src;
}

// Función para cambiar el avatar
function changeAvatar(newAvatar) {
    avatarImage.src = newAvatar;
    localStorage.setItem('selectedAvatar', newAvatar); // Guardar avatar seleccionado
}

// Agregar evento al selector de avatar
avatarSelect.addEventListener("change", (e) => {
    changeAvatar(e.target.value);
    saveGame();
});

// Agregar evento al botón de agregar hábito
addHabitBtn.addEventListener("click", addHabit);

// Cargar el juego al inicio
window.onload = function () {
    loadGame(); // Cargar el estado guardado del juego
    loadStore(); // Cargar la tienda de avatares
};

// Botón para reiniciar el progreso
document.getElementById("reset-progress-btn").addEventListener("click", () => {
    if (confirm("¿Estás seguro de que deseas reiniciar todo tu progreso? Esta acción no se puede deshacer.")) {
        // Limpia el almacenamiento local y reinicia variables
        localStorage.clear(); // Elimina todos los datos guardados
        location.reload(); // Recarga la página para mostrar el progreso reiniciado
    }
});
