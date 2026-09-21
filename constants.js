const DAYS  = ["Пн","Вт","Ср","Чт","Пт","Сб"];

const SLOTS = [
  "1) 8:30–10:00",
  "2) 10:10–11:40",
  "3) 12:10–13:40",
  "4) 13:50–15:20",
  "5) 15:30–17:00",
  "6) 17:10–18:40"
];

const TYPES = { lec: "Лекция", prac: "Практика", lab: "Лаборатория" };

const LS_KEY = "schedule-app-v1";

// Делаем доступными из других скриптов (Babel-скрипты не модули)
window.DAYS  = DAYS;
window.SLOTS = SLOTS;
window.TYPES = TYPES;
window.LS_KEY = LS_KEY;