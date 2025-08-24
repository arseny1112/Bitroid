// Получаем элементы DOM для селекторов месяца, года и контейнера с датами
const monthSelect = document.getElementById('month-select');
const yearSelect = document.getElementById('year-select');
const datesContainer = document.getElementById('dates');

// Получаем сегодняшнюю дату и текущий месяц/год
const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

// Массив месяцев для заполнения селектора
const months = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

// Заполняем селектор месяцев
months.forEach((month, index) => {
  const option = document.createElement('option');
  option.value = index;
  option.textContent = month;
  monthSelect.appendChild(option);
});
monthSelect.value = currentMonth;

// Заполняем селектор лет (текущий ±10 лет)
for (let y = currentYear - 10; y <= currentYear + 10; y++) {
  const option = document.createElement('option');
  option.value = y;
  option.textContent = y;
  yearSelect.appendChild(option);
}
yearSelect.value = currentYear;

// Функция рендера календаря
function renderCalendar(month, year) {
  datesContainer.innerHTML = ''; // очищаем предыдущие даты

  const firstDay = new Date(year, month, 1).getDay(); // первый день месяца (0 = воскресенье)
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // количество дней в текущем месяце
  const prevMonthLastDate = new Date(year, month, 0).getDate(); // последний день предыдущего месяца

  // Рендерим дни предыдущего месяца, если они попадают в текущий календарь
  let prevMonthDays = firstDay === 0 ? 6 : firstDay - 1;
  for (let i = prevMonthDays; i > 0; i--) {
    const div = document.createElement('div');
    div.textContent = prevMonthLastDate - i + 1;
    div.classList.add('other-month'); // класс для серых дат предыдущего месяца
    
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const date = new Date(prevYear, prevMonth, prevMonthLastDate - i + 1);
    const dayOfWeek = date.getDay();
    
    if (dayOfWeek === 0 || dayOfWeek === 6) div.classList.add('weekend'); // выходные
    else div.classList.add('weekday'); // будние
    
    datesContainer.appendChild(div);
  }

  // Рендерим дни текущего месяца
  for (let i = 1; i <= daysInMonth; i++) {
    const div = document.createElement('div');
    div.textContent = i;
    
    const date = new Date(year, month, i);
    const dayOfWeek = date.getDay();
    
    if (dayOfWeek === 0 || dayOfWeek === 6) div.classList.add('weekend'); 
    else div.classList.add('weekday');

    // Подсвечиваем сегодняшний день
    if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      div.classList.add('today');
    }
    
    datesContainer.appendChild(div);
  }

  // Рендерим дни следующего месяца, чтобы календарь был ровно 35 ячеек
  const totalCells = 35;
  const nextMonthDays = totalCells - datesContainer.children.length;
  for (let i = 1; i <= nextMonthDays; i++) {
    const div = document.createElement('div');
    div.textContent = i;
    div.classList.add('other-month');
    
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const date = new Date(nextYear, nextMonth, i);
    const dayOfWeek = date.getDay();
    
    if (dayOfWeek === 0 || dayOfWeek === 6) div.classList.add('weekend');
    else div.classList.add('weekday');
    
    datesContainer.appendChild(div);
  }
}

// События при смене месяца и года
monthSelect.addEventListener('change', () => {
  currentMonth = parseInt(monthSelect.value);
  renderCalendar(currentMonth, currentYear);
});

yearSelect.addEventListener('change', () => {
  currentYear = parseInt(yearSelect.value);
  renderCalendar(currentMonth, currentYear);
});

// Рендерим календарь при загрузке страницы
renderCalendar(currentMonth, currentYear);


// ========================= Фильтры и теги =========================
const categoryCheckboxes = document.querySelectorAll('.filters__checkbox input');
const tagsContainer = document.querySelector('.catalog__tags');
const resetButton = document.querySelector('.tag--reset');

// Обновление облака тегов при выборе фильтров
function updateTags() {
  const existingTags = tagsContainer.querySelectorAll('.tag:not(.tag--reset)');
  existingTags.forEach(tag => tag.remove());

  categoryCheckboxes.forEach(checkbox => {
    if (checkbox.checked) {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.innerHTML = `
        Выбранный пункт фильтра
        <svg class='tag__icon' width="12" height="12" ...>...</svg>
      `;
      tagsContainer.prepend(tag);

      const icon = tag.querySelector('.tag__icon');
      icon.addEventListener('click', () => {
        tag.remove();
        checkbox.checked = false;
      });
    }
  });
}

// Слушатели на изменения чекбоксов и кнопку сброса
categoryCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', updateTags);
});
resetButton.addEventListener('click', () => {
  categoryCheckboxes.forEach(checkbox => checkbox.checked = false);
  updateTags();
});


// ========================= Пагинация =========================
function renderPagination(container, currentPage, totalPages) {
  container.innerHTML = "";

  function getVisibleCount() {
    if (window.innerWidth <= 412) return 1;  
    if (window.innerWidth <= 1324) return 3;   
    return 4;                              
  }

  const visibleCount = getVisibleCount();

  // Кнопка "назад"
  const prev = document.createElement("button");
  prev.innerHTML = `<svg>...</svg>`;
  prev.classList.add("prev");
  prev.disabled = currentPage === 1;
  prev.onclick = () => renderPagination(container, currentPage - 1, totalPages);
  container.appendChild(prev);

  // Добавление страниц
  const addPage = (num) => {
    const btn = document.createElement("button");
    btn.className = "pagination__page" + (num === currentPage ? " pagination__page--active" : "");
    btn.textContent = num;
    btn.onclick = () => renderPagination(container, num, totalPages);
    container.appendChild(btn);
  };

  // Добавление многоточий
  const addDots = () => {
    const span = document.createElement("span");
    span.className = "pagination__dots";
    span.textContent = "…";
    container.appendChild(span);
  };

  addPage(1);
  if (currentPage > visibleCount) addDots();

  let start = Math.max(2, currentPage - Math.floor(visibleCount / 2));
  let end = Math.min(totalPages - 1, currentPage + Math.floor(visibleCount / 2));

  if (currentPage <= visibleCount) {
    start = 2;
    end = visibleCount;
  } else if (currentPage >= totalPages - visibleCount + 1) {
    start = totalPages - visibleCount;
    end = totalPages - 1;
  }

  for (let i = start; i <= end; i++) {
    if (i > 1 && i < totalPages) addPage(i);
  }

  if (currentPage < totalPages - visibleCount + 1) addDots();
  if (totalPages > 1) addPage(totalPages);

  // Кнопка "вперед"
  const next = document.createElement("button");
  next.innerHTML = `<svg>...</svg>`;
  next.classList.add("next");
  next.disabled = currentPage === totalPages;
  next.onclick = () => renderPagination(container, currentPage + 1, totalPages);
  container.appendChild(next);
}

// Инициализация пагинации
document.querySelectorAll(".pagination").forEach((el) => {
  renderPagination(el, 1, 180);
});

// Перерендер пагинации при изменении размера окна
window.addEventListener("resize", () => {
  document.querySelectorAll(".pagination").forEach((el) => {
    const currentPage = el.querySelector(".pagination__page--active")?.textContent || 1;
    renderPagination(el, Number(currentPage), 180);
  });
});

// ========================= Бургер-меню =========================
function burgerMenu() {
  const burger = document.querySelector('.burger');
  const burgerMenu = document.querySelector('.burger-menu');

  // Открытие меню по клику
  burger.addEventListener('click', e => {
    e.stopPropagation();
    burgerMenu.style.display = 'flex';
  });

  // Закрытие меню при клике вне его
  document.addEventListener('click', e => {
    if (!burgerMenu.contains(e.target) && !burger.contains(e.target)) {
      burgerMenu.style.display = 'none';
    }
  });
}

// Инициализация бургер-меню
burgerMenu();
