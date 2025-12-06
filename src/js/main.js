import {
  createPomodoroState,
  switchMode,
  tickTimer,
  getDurationForMode,
  formatTime,
} from './core/timer.js';
import { updateModeButtons } from './ui/render.js';

/**
 * Initializes the Pomodoro application by setting up the UI, state, and event listeners.
 * This function orchestrates the entire application, from DOM element selection to
 * timer management and task handling. It is designed to be self-contained and
 * can be safely run in both browser and server-side environments for testing.
 *
 * @param {Document} [doc=globalThis.document] - The document object to interact with,
 * allowing for dependency injection in non-browser environments.
 */
export function initializePomodoroApp(
  doc = globalThis.document === undefined ? null : globalThis.document
) {
  // Abort initialization if the document or its core methods are unavailable.
  if (!doc?.getElementById) {
    return;
  }

  // --- DOM Element Selection ---
  // Retrieve all necessary DOM elements for the application to function.
  // If any critical element is missing, the function will exit early.
  const timerDisplay = doc.getElementById('timer-display');
  const modeButtons = doc.querySelectorAll('[data-mode]');
  const startButton = doc.getElementById('start-btn');
  const pauseButton = doc.getElementById('pause-btn');
  const resetButton = doc.getElementById('reset-btn');
  const iterationCount = doc.getElementById('iteration-count');

  // Ensure all critical UI components are present before proceeding.
  if (
    !timerDisplay ||
    !startButton ||
    !pauseButton ||
    !resetButton ||
    !iterationCount
  ) {
    console.error('A critical UI element is missing from the DOM.');
    return;
  }

  // --- State and Interval Management ---
  let state = createPomodoroState();
  let intervalId = null;

  /**
   * Stops the main timer interval, preventing further ticks.
   * This function clears the active interval and updates the state to reflect
   * that the timer is no longer running.
   */
  function stopTimer() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    state = { ...state, isRunning: false };
  }

  // ========= START Live Coding: Render Pipeline =========
  /**
   * Main render pipeline.
   * This function synchronizes the entire UI with the current application state.
   * It updates the timer display, pomodoro completion count, and task list.
   * It also ensures that UI elements like mode buttons reflect the current state.
   */
  function render() {
    timerDisplay.textContent = formatTime(state.remainingSeconds);
    iterationCount.textContent = `${state.completedPomodoros}`;
    // Update the visual state of mode selection buttons.
    updateModeButtons(modeButtons, state.mode);
  }
  // ========= END Live Coding =========

  // ========= START Live Coding: Timer Controls (Start/Pause/Reset) =========
  /**
   * Starts the timer loop.
   * If the timer is not already running, it sets up a `setInterval` to tick
   * every second. On each tick, it updates the state and re-renders the UI.
   * If a pomodoro cycle completes, it automatically stops the timer.
   */
  function startTimer() {
    if (intervalId) {
      return; // Prevent multiple intervals from running simultaneously.
    }
    state = { ...state, isRunning: true };
    intervalId = setInterval(() => {
      const { nextState, completedCycle } = tickTimer(state);
      state = nextState;
      render(); // Update UI every second.

      // Stop the timer if the session (e.g., focus, break) has ended.
      if (completedCycle) {
        stopTimer();
      }
    }, 1000);
  }

  /**
   * Pauses the timer by stopping the interval.
   */
  function pauseTimer() {
    stopTimer();
    render(); // Ensure UI reflects the paused state.
  }

  /**
   * Resets the timer to the initial state for the 'focus' mode.
   * It stops any active timer and restores the default duration.
   */
  function resetTimer() {
    stopTimer();
    state = switchMode(
      { ...state, remainingSeconds: getDurationForMode('focus') },
      'focus'
    );
    render();
  }

  // --- Event Listener Attachments ---

  // Attach core timer controls.
  startButton.addEventListener('click', startTimer);
  pauseButton.addEventListener('click', pauseTimer);
  resetButton.addEventListener('click', resetTimer);
  // ========= END Live Coding =========

  // ========= START Live Coding: Mode Switching Events =========
  // Attach listeners for mode-switching buttons (Focus, Short Break, Long Break).
  for (const button of modeButtons) {
    button.addEventListener('click', () => {
      stopTimer();
      const newMode = button.dataset.mode;
      state = switchMode(state, newMode);
      render();
    });
  }
  // ========= END Live Coding =========

  // --- Initial Render ---
  // Perform an initial render to display the default state when the app loads.
  render();
}

/**
 * Expose the application initialization function to the global scope for browser environments.
 * This allows the application to be started from an inline script tag or developer console.
 * The application is automatically initialized once the DOM is fully loaded.
 */
if (globalThis.window !== undefined) {
  globalThis.PomodoroApp = {
    initializePomodoroApp,
  };
  globalThis.addEventListener('DOMContentLoaded', () => initializePomodoroApp());
}
