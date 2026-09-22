/* ===== Управление темой ===== */
const THEME_KEY = 'app-theme';
const THEMES = { LIGHT: 'light', DARK: 'dark' };

/**
 * Применяет тему к документу
 * @param {'light'|'dark'} theme
 */
function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === THEMES.DARK) {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
  }
  updateToggleIcon(theme);
  localStorage.setItem(THEME_KEY, theme);
}

/**
 * Возвращает сохранённую тему или системную
 */
function getInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === THEMES.DARK || saved === THEMES.LIGHT) return saved;

  // Если пользователь не выбирал — берём системную
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? THEMES.DARK
    : THEMES.LIGHT;
}

/**
 * Меняет иконку на кнопке
 */
function updateToggleIcon(theme) {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.textContent = theme === THEMES.DARK ? '☀️' : '🌙';
  btn.title = theme === THEMES.DARK
    ? 'Переключить на светлую тему'
    : 'Переключить на тёмную тему';
}

/**
 * Переключает текущую тему
 */
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') === 'dark'
    ? THEMES.DARK
    : THEMES.LIGHT;
  applyTheme(current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK);
}

/**
 * Создаёт и вставляет кнопку переключения
 */
function createThemeToggle() {
  if (document.getElementById('theme-toggle')) return;

  const btn = document.createElement('button');
  btn.id = 'theme-toggle';
  btn.className = 'theme-toggle';
  btn.setAttribute('aria-label', 'Переключить тему');
  btn.addEventListener('click', toggleTheme);
  document.body.appendChild(btn);
}

/**
 * Инициализация при загрузке страницы
 */
function initTheme() {
  applyTheme(getInitialTheme());
  createThemeToggle();

  // Реагируем на смену системной темы (если пользователь не выбирал вручную)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
    }
  });
}

// Запускаем, когда DOM готов
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTheme);
} else {
  initTheme();
}