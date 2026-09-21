const defaultState = {
  groups: [],
  teachers: [],
  subjects: [],
  lessons: []
};

function loadState() {
  try {
    return { ...defaultState, ...JSON.parse(localStorage.getItem(window.LS_KEY) || "{}") };
  } catch {
    return defaultState;
  }
}

window.defaultState = defaultState;
window.loadState = loadState;