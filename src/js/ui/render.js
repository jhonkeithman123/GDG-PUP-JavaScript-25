/**
 * Updates the visual state of mode-switching buttons to reflect the active timer mode.
 * It adds an 'active' class to the button corresponding to the current mode and
 * removes it from all other mode buttons.
 *
 * @param {NodeListOf<HTMLButtonElement>} modeButtons - A collection of the mode-switching buttons.
 * @param {string} activeMode - The identifier of the currently active mode (e.g., 'focus').
 */
export function updateModeButtons(modeButtons, activeMode) {
  for (const button of modeButtons) {
    if (button.dataset.mode === activeMode) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  }
}
