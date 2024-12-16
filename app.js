// Variables para el sistema de juego
let level = localStorage.getItem('level') ? parseInt(localStorage.getItem('level')) : 1;
let points = localStorage.getItem('points') ? parseInt(localStorage.getItem('points')) : 0;
let coins = localStorage.getItem('coins') ? parseInt(localStorage.getItem('coins')) : 0;
let history = localStorage.getItem('history') ? JSON.parse(localStorage.getItem('history')) : [];
let avatars = localStorage.getItem('avatars') ? JSON.parse(localStorage.getItem('avatars')) : [];
let unlockedItems = localStorage.getItem('unlockedItems') ? parseInt(localStorage.getItem('unlockedItems')) : 1;

const defaultTheme = { 
    name: "Tema Predeterminado", 
    isDefault: true, // Marca como tema predeterminado
    background: "#2C2C54", 
    text: "#FFD700", 
    accent: "#FF5733" 
};

// Cargar temas desbloqueados desde localStorage, asegurando que el predeterminado esté siempre presente
let unlockedThemes = localStorage.getItem('unlockedThemes') 
    ? JSON.parse(localStorage.getItem('unlockedThemes')) 
    : [defaultTheme];

let selectedTheme = localStorage.getItem('selectedTheme') 
    ? JSON.parse(localStorage.getItem('selectedTheme')) 
    : defaultTheme;


const storeItems = [
    { name: "Avatar 1", cost: 50, image: "images/avatar1.png" },
    { name: "Avatar 2", cost: 100, image: "images/avatar2.png" },
    { name: "Avatar 3", cost: 150, image: "images/avatar3.png" },
    { name: "Avatar 4", cost: 200, image: "images/avatar4.png" },
    { name: "Avatar 5", cost: 250, image: "images/avatar5.png" },
    { name: "Avatar 6", cost: 300, image: "images/avatar6.png" },
    { name: "Avatar 7", cost: 350, image: "images/avatar7.png" },
    { name: "Avatar 8", cost: 400, image: "images/avatar8.png" },
    { name: "Avatar 9", cost: 450, image: "images/avatar9.png" },
    { name: "Avatar Premium 1", cost: 500, image: "images/dragon.png" },
    { name: "Avatar Premium 2", cost: 600, image: "images/ninja.png" },
    { name: "Avatar Premium 3", cost: 700, image: "images/galactic.png" },
    { name: "Playa", cost: 800, image: "images/beach.png" },
    { name: "Montaña", cost: 900, image: "images/mountain.png" },
    { name: "Espacio", cost: 1000, image: "images/space.png" },
    { name: "Tema Oceánico", cost: 500, theme: { name: "Tema Oceánico", background: "#1E3A5F", text: "#D6E7F2", accent: "#64B5F6" } },
    { name: "Tema Selva Tropical", cost: 600, theme: { name: "Tema Selva Tropical", background: "#013220", text: "#A8E6CF", accent: "#FFD700" } },
    { name: "Tema Pastel", cost: 700, theme: { name: "Tema Pastel", background: "#FFE4E1", text: "#4B0082", accent: "#FFB6C1" } },
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
const themeSelect = document.getElementById("theme-select");
const avatarSelect = document.getElementById("avatar-select");

// Diccionario de 100 hábitos saludables medibles por tiempo
const habitDictionary = [
    "Leer", "Meditar", "Ejercicio", "Estiramientos", "Correr", "Caminar", "Yoga", "Bailar",
    "Jardinería", "Cocinar saludable", "Pintar", "Dibujar", "Tocar un instrumento",
    "Escribir un diario", "Estudiar un idioma", "Hacer rompecabezas", "Resolver sudokus",
    "Aprender programación", "Cantar", "Escuchar música", "Limpiar", "Ordenar",
    "Estudiar matemáticas", "Tomar un baño relajante", "Practicar respiración", "Nadar",
    "Montar bicicleta", "Hacer manualidades", "Cuidar plantas", "Hacer una llamada a un ser querido",
    "Preparar una receta nueva", "Hacer origami", "Jugar ajedrez", "Planear la semana",
    "Organizar finanzas", "Jugar videojuegos educativos", "Crear un collage", "Practicar fotografía",
    "Hacer senderismo", "Aprender una habilidad", "Practicar memoria", "Aprender a bordar",
    "Trabajar en un proyecto personal", "Leer poesía", "Reciclar", "Escribir cartas",
    "Preparar smoothies saludables", "Dibujar mandalas", "Hacer scrapbooking",
    "Tomar fotos", "Hacer un tour virtual", "Organizar fotos digitales", "Estudiar historia",
    "Leer artículos científicos", "Escribir cuentos", "Aprender caligrafía", "Aprender a tejer",
    "Coser", "Hacer ejercicios de postura", "Dibujar retratos", "Crear playlists temáticas",
    "Limpiar correo electrónico", "Tomar cursos online", "Ver documentales", "Estudiar física",
    "Escribir reflexiones", "Practicar escritura creativa", "Practicar coreografías",
    "Practicar atención plena", "Jugar instrumentos nuevos", "Estudiar arte", "Caminar descalzo",
    "Hacer journaling", "Preparar infusiones", "Crear listas de gratitud", "Practicar equilibrio",
    "Leer blogs educativos", "Aprender sobre astronomía", "Participar en retos fitness",
    "Tocar guitarra", "Tocar piano", "Escribir poesía", "Tocar batería", "Hacer experimentos científicos",
    "Aprender origami avanzado", "Jugar juegos mentales", "Hacer jardinería avanzada", "Preparar jabones caseros",
    "Cantar karaoke", "Hacer yoga avanzada", "Caminar rápido", "Preparar comida vegana",
    "Jugar frisbee", "Dibujar paisajes", "Practicar declamación", "Escribir artículos"
];

// Configuración de Fuse.js para coincidencias difusas
const fuse = new Fuse(habitDictionary, {
    includeScore: true, // Incluye puntaje para ajustar sensibilidad si lo deseas
    threshold: 0.4, // Controla la sensibilidad de la coincidencia (0.0 = exacta, 1.0 = difusa)
    keys: [] // No necesitas definir claves ya que estás buscando en un array plano
});

// Función para mostrar sugerencias con coincidencia difusa
function showSuggestions(input) {
    const suggestions = fuse.search(input); // Busca en el diccionario con Fuse.js
    const suggestionBox = document.getElementById("suggestion-box");
    suggestionBox.innerHTML = ""; // Limpiar sugerencias previas

    if (input.trim() === "" || suggestions.length === 0) {
        suggestionBox.style.display = "none";
        return;
    }

    suggestionBox.style.display = "block";

    // Mostrar las sugerencias más relevantes
    suggestions.forEach(result => {
        const suggestion = result.item; // Obtener el elemento del resultado
        const suggestionItem = document.createElement("div");
        suggestionItem.textContent = suggestion;
        suggestionItem.className = "p-2 cursor-pointer hover:bg-gray-600";
        suggestionItem.addEventListener("click", () => {
            habitInput.value = suggestion;
            suggestionBox.style.display = "none";
        });
        suggestionBox.appendChild(suggestionItem);
    });
}

// Agregar evento de entrada en el input para actualizar sugerencias
habitInput.addEventListener("input", () => {
    showSuggestions(habitInput.value);
});

// Función para aplicar un tema
function applyTheme(theme) {
    const body = document.body;

    // Limpia todas las clases previas relacionadas con el tema
    body.classList.remove(...body.classList);

    // Añade las clases básicas de Tailwind
    body.classList.add("font-sans");

    // Aplica los colores del tema como clases dinámicas
    body.style.backgroundColor = theme.background; // Fondo
    body.style.color = theme.text; // Texto

    // Actualiza el color de acento si está definido
    if (theme.accent) {
        document.documentElement.style.setProperty("--accent-color", theme.accent);
    }

    // Actualiza el tema seleccionado
    selectedTheme = theme;
    localStorage.setItem("selectedTheme", JSON.stringify(selectedTheme)); // Guarda el tema seleccionado
}

// Función para cargar las opciones de temas en el menú desplegable
function loadThemeOptions() {
    themeSelect.innerHTML = ''; // Limpia las opciones previas

    // Agregar los temas desbloqueados al menú
    unlockedThemes.forEach((theme, index) => {
        const option = document.createElement("option");
        option.value = index; // Índice único del tema
        option.textContent = theme.name || "Tema Desconocido"; // Usa el nombre del tema o un texto genérico
        themeSelect.appendChild(option);
    });

    // Selecciona el tema actual
    const currentThemeIndex = unlockedThemes.findIndex(
        theme => JSON.stringify(theme) === JSON.stringify(selectedTheme)
    );
    themeSelect.value = currentThemeIndex >= 0 ? currentThemeIndex : 0;
}

// Evento para cambiar el tema desde el menú desplegable
themeSelect.addEventListener("change", (e) => {
    const selectedIndex = parseInt(e.target.value, 10); // Índice seleccionado
    const selected = unlockedThemes[selectedIndex]; // Encuentra el tema correspondiente

    if (selected) {
        applyTheme(selected); // Aplica el tema seleccionado
        alert(`¡Has cambiado al tema "${selected.name}"!`);
    }
});

// Cargar progreso
function loadGame() {
    levelDisplay.textContent = level;
    pointsDisplay.textContent = points;
    coinsDisplay.textContent = coins;
    const progressPercentage = (points / maxPoints) * 100;
    progressBar.style.width = progressPercentage + "%";
    avatarImage.src = localStorage.getItem('selectedAvatar') || "images/default-avatar.png";
    loadAchievements();
    loadHistory();
    updateRank();
    updateCoins();
    loadAvatarOptions();


    // Asegura que el tema predeterminado esté presente
    if (!unlockedThemes.some(theme => theme.isDefault)) {
        unlockedThemes.unshift(defaultTheme);
    }

    // Validar que todos los temas tengan un nombre
    unlockedThemes.forEach((theme) => {
        if (!theme.name) {
            theme.name = "Tema Desconocido";
        }
    });

    // Aplica el tema seleccionado o el predeterminado
    if (selectedTheme) {
        applyTheme(selectedTheme);
    } else {
        applyTheme(defaultTheme);
    }

    loadThemeOptions(); // Actualiza el menú desplegable
}

// Función para agregar un hábito
function addHabit() {
    const habitText = habitInput.value.trim();
    const habitTime = parseInt(timeInput.value.trim()); // Tiempo definido por el usuario (minutos)

    // Validar tiempo y entrada vacía
    if (habitText === "" || isNaN(habitTime) || habitTime <= 0) {
        alert("Por favor, ingresa un hábito válido y un tiempo en minutos mayor a 0.");
        return;
    }

    // Validar si el hábito está en el diccionario
    if (!habitDictionary.includes(habitText)) {
        const confirmAdd = confirm(
            `El hábito "${habitText}" no existe en nuestro diccionario. ¿Deseas agregarlo de todos modos?`
        );
        if (!confirmAdd) {
            return; // Si el usuario cancela, detener la ejecución
        }
    }

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
        coins += 500; // Ganas 500 monedas por completar un hábito
        addHabitToHistory(habitText, habitTime, completionTime); // Añadir al historial con el tiempo configurado y el real
        updateCoins();
    }

    if (points >= maxPoints) {
        levelUp();
    } else {
        updateGame();
    }

    saveGame();

    // Actualiza el gráfico al completar el hábito
    const selectedRange = document.getElementById('time-range').value; // Obtener rango seleccionado
    updateHabitChart(selectedRange); // Actualizar gráfico
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
    localStorage.setItem('unlockedThemes', JSON.stringify(unlockedThemes));
    localStorage.setItem('selectedAvatar', avatarImage.src); // Guardar avatar seleccionado
}

// Función para agregar hábito al historial (incluye el tiempo configurado por el usuario y el tiempo real de completado)
function addHabitToHistory(habitName, habitTime, completionTime) {
    const date = new Date().toISOString(); // Guardar la fecha en formato ISO
    const historyItem = {
        habit: habitName,
        date: date, // Guardar fecha en formato ISO
        time: habitTime, // Tiempo previsto
        completionTime: completionTime // Tiempo real de completado
    };
    history.push(historyItem);
    localStorage.setItem('history', JSON.stringify(history)); // Guardar historial actualizado
    updateHistoryList(); // Actualizar la lista visible en la app
    console.log('Historial actualizado:', history); // Verifica los datos guardados
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
    history = JSON.parse(localStorage.getItem('history')) || []; // Cargar historial del almacenamiento local
    updateHistoryList(); // Actualizar la interfaz
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

// Función para cargar los elementos de la tienda
function loadStore() {
    storeContainer.innerHTML = '';
    storeItems.forEach((item, index) => {
        const isUnlocked = item.theme ? unlockedThemes.some(theme => JSON.stringify(theme) === JSON.stringify(item.theme)) : avatars.includes(item.image);

        if (!isUnlocked) {
            const li = document.createElement("li");
            li.className = 'bg-gray-700 p-2 rounded-md flex justify-between items-center';
            li.innerHTML = `
                <span>${item.name}</span>
                <button class="buy-btn bg-yellow-500 p-1 rounded-md">Comprar (${item.cost} monedas)</button>
            `;
            li.querySelector('.buy-btn').addEventListener("click", () => buyItem(index));
            storeContainer.appendChild(li);
        }
    });
}

// Función para comprar un avatar
function buyItem(index) {
    const item = storeItems[index];

    if (coins >= item.cost) {
        coins -= item.cost;
        coinsDisplay.textContent = coins;

        if (item.theme) {
            // Verifica si el tema ya está desbloqueado
            if (!unlockedThemes.some(theme => theme.name === item.theme.name)) {
                unlockedThemes.push(item.theme); // Añade el nuevo tema a la lista desbloqueada
                localStorage.setItem('unlockedThemes', JSON.stringify(unlockedThemes));
            }

            applyTheme(item.theme); // Aplica el tema comprado
            loadThemeOptions(); // Actualiza el menú desplegable
            alert(`¡Has comprado el tema "${item.name}"!`);
        } else {
            avatars.push(item.image);
            avatarImage.src = item.image; // Cambiar al avatar comprado inmediatamente
            alert(`¡Has comprado ${item.name}!`);
        }

        saveGame();
        loadStore(); // Actualiza la tienda
        loadAvatarOptions(); // Recargar las opciones de avatar en el selector
    } else {
        alert("No tienes suficientes monedas.");
    }
}

// Función para cargar las opciones de avatares en el selector
function loadAvatarOptions() {
    avatarSelect.innerHTML = ''; // Limpia opciones previas

    // Agregar opción para el avatar predeterminado
    const defaultOption = document.createElement("option");
    defaultOption.value = "images/default-avatar.png";
    defaultOption.textContent = "Avatar Predeterminado";
    avatarSelect.appendChild(defaultOption);

    // Agregar opciones de avatares comprados
    avatars.forEach(avatar => {
        const item = storeItems.find(item => item.image === avatar); // Encuentra el avatar en la tienda
        const option = document.createElement("option");
        option.value = avatar;
        option.textContent = item ? item.name : "Avatar Desconocido"; // Usa el nombre del avatar si está disponible
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
    loadGame();
    loadStore();
    loadHistory(); // Cargar historial desde localStorage
    updateHabitChart('day'); // Mostrar gráfico diario por defecto
};

// Botón para reiniciar el progreso
document.getElementById("reset-progress-btn").addEventListener("click", () => {
    if (confirm("¿Estás seguro de que deseas reiniciar todo tu progreso? Esta acción no se puede deshacer.")) {
        // Limpia el almacenamiento local y reinicia variables
        localStorage.clear(); // Elimina todos los datos guardados
        location.reload(); // Recarga la página para mostrar el progreso reiniciado
    }
});

let habitChart; // Variable global para el gráfico

// Función para filtrar el historial por rango de tiempo
function getHabitsByDay() {
    const now = new Date();
    const counts = {};

    // Iterar por todo el historial
    history.forEach(entry => {
        const habitDate = new Date(entry.date).toDateString();
        counts[habitDate] = (counts[habitDate] || 0) + 1;
    });

    // Asegurar que el día actual aparece, incluso si no hay hábitos
    const today = now.toDateString();
    if (!counts[today]) counts[today] = 0;

    return counts;
}

function getHabitsByWeek() {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Lunes de la semana actual
    startOfWeek.setHours(0, 0, 0, 0); // Asegurarse de que sea exactamente a la medianoche

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Domingo de la misma semana
    endOfWeek.setHours(23, 59, 59, 999); // Hasta el final del domingo

    const counts = {};

    // Iterar sobre el historial y verificar si la fecha está dentro del rango semanal
    history.forEach(entry => {
        const habitDate = new Date(entry.date);
        if (habitDate >= startOfWeek && habitDate <= endOfWeek) {
            const day = habitDate.toLocaleDateString('default', { weekday: 'long' }); // Día de la semana (Ej: Lunes)
            counts[day] = (counts[day] || 0) + 1;
        }
    });

    // Asegurar que todos los días de la semana aparecen, incluso sin registros
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    weekDays.forEach(day => {
        if (!counts[day]) counts[day] = 0;
    });

    return counts;
}

function getHabitsByMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Número de días en el mes actual

    const counts = {};
    history.forEach(entry => {
        const habitDate = new Date(entry.date);
        if (habitDate.getFullYear() === year && habitDate.getMonth() === month) {
            const day = habitDate.getDate();
            counts[day] = (counts[day] || 0) + 1;
        }
    });

    // Asegurar que todos los días del mes aparecen
    for (let i = 1; i <= daysInMonth; i++) {
        if (!counts[i]) counts[i] = 0;
    }

    return counts;
}

function getHabitsByYear() {
    const now = new Date();
    const year = now.getFullYear();

    const counts = {};
    history.forEach(entry => {
        const habitDate = new Date(entry.date);
        if (habitDate.getFullYear() === year) {
            const month = habitDate.getMonth() + 1; // Incrementar para que el mes se muestre como 1-12 en lugar de 0-11
            counts[month] = (counts[month] || 0) + 1;
        }
    });

    // Asegurar que todos los meses del año aparecen
    for (let i = 1; i <= 12; i++) {
        if (!counts[i]) counts[i] = 0;
    }

    return counts;
}

// Evento para cambiar el rango de tiempo
document.getElementById('time-range').addEventListener('change', (e) => {
    const range = e.target.value; // Obtener el rango seleccionado (day, week, month, year)
    updateHabitChart(range); // Actualizar gráfico con el rango seleccionado
});

function updateHabitChart(range) {
    let habitData;

    switch (range) {
        case 'day':
            habitData = getHabitsByDay();
            break;
        case 'week':
            habitData = getHabitsByWeek();
            break;
        case 'month':
            habitData = getHabitsByMonth();
            break;
        case 'year':
            habitData = getHabitsByYear();
            break;
        default:
            habitData = {};
    }

    const labels = Object.keys(habitData); // Etiquetas: Días de la semana, días del mes, etc.
    const data = labels.map(day => habitData[day]);

    if (habitChart) {
        habitChart.destroy(); // Destruye el gráfico anterior
    }

    const ctx = document.getElementById('habit-chart').getContext('2d');
    habitChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Hábitos Completados',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Día de la Semana'
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
