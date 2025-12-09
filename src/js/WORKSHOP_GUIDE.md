# 🎓 GDG Pomodoro: JavaScript Live Coding Script

**Duration:** 1h - 1h 30m  
**Goal:** Build a working Pomodoro timer with a task list from scratch.

---

## 🏁 Phase 0: Setup (5 mins)

- **Goal:** Ensure everyone has the HTML/CSS ready and connected.
- **Action:** Open `main.js` (empty) and `pomodoro.html`.
- **Talking Point:** "HTML is the skeleton, CSS is the skin, and JavaScript is the brain. Today we are building the brain."

---

## 🏗️ Phase 1: The "Memory" (Variables) (10 mins)

- **Goal:** Define the data our app needs to remember.
- **Concept:** Variables (`const` vs `let`).

### Step 1.1: Configuration (Constants)

```javascript
// 1. VARIABLES & CONFIGURATION

// Time durations in seconds
const FOCUS_TIME = 25 * 60;
const SHORT_BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 15 * 60;

// Colors
const COLOR_BLUE = "var(--google-blue)";
const COLOR_GREEN = "var(--google-green)";
const COLOR_YELLOW = "var(--google-yellow)";
```

- _Explain:_ We use `const` for values that never change. `25 * 60` is easier to read than `1500`.

### Step 1.2: State (Variables)

```javascript
// State variables (Global)
let timeLeft = FOCUS_TIME;
let isRunning = false;
let currentMode = "focus"; // 'focus', 'short-break', 'long-break'
let timerInterval = null;
let tasks = []; // List of tasks
```

- _Explain:_ We use `let` for data that changes over time. These variables represent the current "state" of our app.

---

## 🔌 Phase 2: Connecting the Wires (DOM Selection) (10 mins)

- **Goal:** Get references to HTML elements so we can control them.
- **Concept:** `document.getElementById`.

```javascript
// 2. DOM ELEMENTS

const timerDisplay = document.getElementById("timer-display");
const timerLabel = document.getElementById("timer-label");
const ringProgress = document.getElementById("ring-progress");

// Buttons
const startBtn = document.getElementById("toggle-btn");
const resetBtn = document.getElementById("reset-btn");
const toggleIcon = document.getElementById("toggle-icon");

// Mode Buttons
const focusBtn = document.getElementById("focus-btn");
const shortBreakBtn = document.getElementById("short-break-btn");
const longBreakBtn = document.getElementById("long-break-btn");

// Task Elements
const taskList = document.getElementById("task-list");
const taskInput = document.getElementById("new-task-title");
const addTaskBtn = document.getElementById("add-task-btn");
const taskCountNum = document.getElementById("task-count-num");
```

- _Tip:_ We are grabbing elements by their unique `id` from the HTML.

---

## 🎨 Phase 3: The "Render" Function (15 mins)

- **Goal:** Make the screen reflect the variables. **(Crucial Step)**
- **Concept:** Functions and String Formatting.

```javascript
// 3. TIMER FUNCTIONS

function updateTimerDisplay() {
  // Calculate minutes and seconds
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Format as "MM:SS" (e.g., "05:09")
  // .padStart(2, "0") ensures we get "09" instead of "9"
  const formattedTime =
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0");

  timerDisplay.textContent = formattedTime;

  // Optional: Update the ring progress
  let totalTime = FOCUS_TIME;
  if (currentMode === "short-break") totalTime = SHORT_BREAK_TIME;
  if (currentMode === "long-break") totalTime = LONG_BREAK_TIME;

  const progress = 1 - timeLeft / totalTime;
  ringProgress.style.strokeDashoffset = progress;
}

// Call it once to test!
updateTimerDisplay();
```

- _Demo:_ Manually change `timeLeft = 100` in the code and refresh. See the UI update?

---

## ⏱️ Phase 4: Making it Tick (The Timer) (20 mins)

- **Goal:** Start reducing `timeLeft` every second.
- **Concept:** `setInterval`, `clearInterval`, and `if/else`.

### Step 4.1: Start/Pause Logic

```javascript
function startTimer() {
  if (isRunning) {
    // PAUSE LOGIC
    clearInterval(timerInterval);
    isRunning = false;
    toggleIcon.textContent = "play_arrow";
    timerLabel.textContent = "Paused";
  } else {
    // START LOGIC
    isRunning = true;
    toggleIcon.textContent = "pause";
    timerLabel.textContent =
      currentMode === "focus" ? "Stay focused" : "Take a break";

    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft = timeLeft - 1;
        updateTimerDisplay();
      } else {
        // TIME'S UP LOGIC
        clearInterval(timerInterval);
        isRunning = false;
        toggleIcon.textContent = "play_arrow";
        alert("Time is up!");
      }
    }, 1000); // 1000ms = 1 second
  }
}
```

### Step 4.2: Hook up the Event Listener

```javascript
// 5. EVENT LISTENERS
startBtn.addEventListener("click", startTimer);
```

- _Test:_ Click the play button. Is it counting down? Click it again. Does it pause?

---

## 🎛️ Phase 5: Controls (Modes & Reset) (15 mins)

- **Goal:** Allow switching between Focus and Breaks.
- **Concept:** Updating multiple variables at once.

### Step 5.1: Reset

```javascript
function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  toggleIcon.textContent = "play_arrow";

  // Reset time based on current mode
  if (currentMode === "focus") timeLeft = FOCUS_TIME;
  else if (currentMode === "short-break") timeLeft = SHORT_BREAK_TIME;
  else if (currentMode === "long-break") timeLeft = LONG_BREAK_TIME;

  updateTimerDisplay();
}

resetBtn.addEventListener("click", resetTimer);
```

### Step 5.2: Switching Modes

```javascript
function setMode(mode) {
  currentMode = mode;

  // Update buttons style (Visual feedback)
  focusBtn.classList.remove("active");
  shortBreakBtn.classList.remove("active");
  longBreakBtn.classList.remove("active");

  const root = document.documentElement; // To change CSS variables

  if (mode === "focus") {
    timeLeft = FOCUS_TIME;
    focusBtn.classList.add("active");
    root.style.setProperty("--theme-primary", COLOR_BLUE);
    timerLabel.textContent = "Ready to focus?";
  } else if (mode === "short-break") {
    timeLeft = SHORT_BREAK_TIME;
    shortBreakBtn.classList.add("active");
    root.style.setProperty("--theme-primary", COLOR_GREEN);
    timerLabel.textContent = "Time for a break";
  } else if (mode === "long-break") {
    timeLeft = LONG_BREAK_TIME;
    longBreakBtn.classList.add("active");
    root.style.setProperty("--theme-primary", COLOR_YELLOW);
    timerLabel.textContent = "Time for a long break";
  }

  // Stop timer when switching modes
  clearInterval(timerInterval);
  isRunning = false;
  toggleIcon.textContent = "play_arrow";

  updateTimerDisplay();
}

// Add listeners to buttons
focusBtn.addEventListener("click", () => {
  setMode("focus");
});
shortBreakBtn.addEventListener("click", () => {
  setMode("short-break");
});
longBreakBtn.addEventListener("click", () => {
  setMode("long-break");
});
```

---

## 📝 Phase 6: Task List (Bonus) (20 mins)

- **Goal:** Add, remove, and check off tasks.
- **Concept:** Arrays, Loops, and Dynamic HTML.

### Step 6.1: Adding a Task

```javascript
// 4. TASK FUNCTIONS

function addTask() {
  const title = taskInput.value;
  if (title === "") {
    alert("Please enter a task title");
    return;
  }

  const newTask = {
    title: title,
    isDone: false,
  };

  tasks.push(newTask);
  taskInput.value = "";
  renderTasks(); // We need to build this next!
}

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") addTask();
});
```

### Step 6.2: Rendering Tasks

```javascript
function renderTasks() {
  // Clear the list first
  taskList.innerHTML = "";

  // Update count
  const completedCount = tasks.filter((t) => t.isDone).length;
  taskCountNum.textContent = completedCount + " / " + tasks.length;

  // Loop through tasks and create HTML
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];

    const li = document.createElement("li");
    li.className = "task-item";
    if (task.isDone) li.classList.add("completed");

    li.innerHTML = `
      <div class="task-content">
        <button class="btn-check">
          <span class="material-symbols-rounded">${
            task.isDone ? "check_circle" : "radio_button_unchecked"
          }</span>
        </button>
        <div class="task-title">${task.title}</div>
      </div>
      <div class="task-actions">
        <button class="btn-edit"><span class="material-symbols-rounded">edit</span></button>
        <button class="btn-delete"><span class="material-symbols-rounded">delete</span></button>
      </div>
    `;

    // Add Event Listeners to the buttons inside this task
    // ... (See main.js for the event listener logic)

    taskList.appendChild(li);
  }
}
```

---

## 🚀 Phase 7: Wrap up

- Recap: We built a full app using simple variables, functions, and event listeners.
- Challenge: Try changing the background color of the whole page when the mode changes!
