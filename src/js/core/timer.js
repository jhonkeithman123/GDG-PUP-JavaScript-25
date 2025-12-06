// ========= START Live Coding: Timer Durations and State =========
/**
 * Defines the duration in seconds for each Pomodoro mode. This centralized
 * configuration allows for easy adjustments to the timer settings.
 * @const
 * @type {Object<string, number>}
 */
export const DURATIONS = {
  focus: 25 * 60,
  'short-break': 5 * 60,
  'long-break': 15 * 60,
};

/**
 * Creates the initial state object for the Pomodoro application.
 * This function ensures a consistent starting state, including the default mode,
 * timer duration, and empty task list.
 *
 * @returns {object} The default application state.
 */
export function createPomodoroState() {
  return {
    mode: 'focus', // The current timer mode (e.g., 'focus', 'short-break').
    remainingSeconds: DURATIONS.focus, // Time left in the current session.
    completedPomodoros: 0, // Number of completed focus sessions.
    isRunning: false, // Flag indicating if the timer is active.
    tasks: [], // Array of task objects associated with the session.
  };
}
// ========= END Live Coding =========

/**
 * Retrieves the configured duration for a given timer mode.
 *
 * @param {string} mode - The mode ('focus', 'short-break', 'long-break') whose duration is needed.
 * @returns {number} The duration in seconds for the specified mode. Defaults to 'focus' duration if the mode is invalid.
 */
export function getDurationForMode(mode) {
  return DURATIONS[mode] || DURATIONS.focus;
}

/**
 * Returns a new state object transitioned to the specified mode.
 * This pure function calculates the new state without modifying the original,
 * setting the timer to the correct duration for the new mode and ensuring
.
 *
 * @param {object} state - The current application state.
 * @param {string} mode - The target mode to switch to.
 * @returns {object} A new state object reflecting the mode change.
 */
// ========= START Live Coding: Mode Switching =========
export function switchMode(state, mode) {
  const nextDuration = getDurationForMode(mode);
  return {
    ...state,
    mode,
    remainingSeconds: nextDuration,
    isRunning: false,
  };
}
// ========= END Live Coding =========

/**
 * Processes a single tick of the timer, returning the next state.
 * If time is remaining, it decrements the timer by one second.
 * If the timer reaches zero, it transitions to the next logical mode
 * (e.g., from 'focus' to a break) and marks the cycle as completed.
 *
 * @param {object} state - The current application state.
 * @returns {{nextState: object, completedCycle: boolean}} An object containing the updated state and a flag indicating if the timer session finished.
 */
// ========= START Live Coding: Tick Logic =========
export function tickTimer(state) {
  // If there's more than a second left, just decrement the timer.
  if (state.remainingSeconds > 1) {
    return {
      nextState: { ...state, remainingSeconds: state.remainingSeconds - 1 },
      completedCycle: false,
    };
  }

  // --- Timer completion and mode transition logic ---
  let completedPomodoros = state.completedPomodoros;
  let nextMode;

  // If a focus session ends, increment the pomodoro count.
  // Transition to a long break after every 4 pomodoros, otherwise a short break.
  if (state.mode === 'focus') {
    completedPomodoros += 1;
    nextMode = completedPomodoros % 4 === 0 ? 'long-break' : 'short-break';
  } else {
    // If a break ends, always transition back to focus.
    nextMode = 'focus';
  }

  const nextDuration = getDurationForMode(nextMode);

  // Return the new state for the next cycle.
  return {
    nextState: {
      ...state,
      mode: nextMode,
      remainingSeconds: nextDuration,
      completedPomodoros,
      isRunning: false,
    },
    completedCycle: true, // Signal that the session has ended.
  };
}
// ========= END Live Coding =========

/**
 * Formats a duration in total seconds into a MM:SS string.
 *
 * @param {number} totalSeconds - The time in seconds to format.
 * @returns {string} The formatted time string (e.g., "25:00").
 */
export function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}
