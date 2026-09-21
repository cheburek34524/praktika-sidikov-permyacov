window.defaultState = { groups: [], teachers: [], subjects: [], lessons: [] };

window.loadState = function loadState() {
  try {
    const raw = JSON.parse(localStorage.getItem(window.LS_KEY) || "{}");
    return { ...window.defaultState, ...raw };
  } catch (e) {
    return window.defaultState;
  }
};