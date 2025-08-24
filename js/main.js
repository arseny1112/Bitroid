// Получаем элементы для календаря
const monthSelect = document.getElementById('month-select');
const yearSelect = document.getElementById('year-select');
const datesContainer = document.getElementById('dates');

// Текущая дата
const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

// Массив названий месяцев
const months = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

// Заполняем селект месяцев
months.forEach((month, index) => {
  const option = document.createElement('option');
  option.value = index;
  option.textContent = month;
  monthSelect.appendChild(option);
});
monthSelect.value = currentMonth;

// Заполняем селект годов (±10 лет от текущего)
for (let y = currentYear - 10; y <= currentYear + 10; y++) {
  const option = document.createElement('option');
  option.value = y;
  option.textContent = y;
  yearSelect.appendChild(option);
}
yearSelect.value = currentYear;

// Функция для отрисовки календаря
function renderCalendar(month, year) {
  datesContainer.innerHTML = ''; // очищаем предыдущие даты

  const firstDay = new Date(year, month, 1).getDay(); // день недели первого числа
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // кол-во дней в месяце
  const prevMonthLastDate = new Date(year, month, 0).getDate(); // последний день прошлого месяца

  // Рендерим дни предыдущего месяца
  let prevMonthDays = firstDay === 0 ? 6 : firstDay - 1;
  for (let i = prevMonthDays; i > 0; i--) {
    const div = document.createElement('div');
    div.textContent = prevMonthLastDate - i + 1;
    div.classList.add('other-month');
    
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const date = new Date(prevYear, prevMonth, prevMonthLastDate - i + 1);
    const dayOfWeek = date.getDay();
    
    if (dayOfWeek === 0 || dayOfWeek === 6) div.classList.add('weekend'); 
    if(dayOfWeek >= 1 && dayOfWeek <= 5) div.classList.add('weekday');
    
    datesContainer.appendChild(div);
  }

  // Рендерим текущий месяц
  for (let i = 1; i <= daysInMonth; i++) {
    const div = document.createElement('div');
    div.textContent = i;
    
    const date = new Date(year, month, i);
    const dayOfWeek = date.getDay();
    
    if (dayOfWeek === 0 || dayOfWeek === 6) div.classList.add('weekend'); 
    if(dayOfWeek >= 1 && dayOfWeek <= 5) div.classList.add('weekday');
    
    // подсветка сегодняшнего дня
    if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      div.classList.add('today');
    }
    
    datesContainer.appendChild(div);
  }

  // Рендерим дни следующего месяца для заполнения сетки
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
    if(dayOfWeek >= 1 && dayOfWeek <= 5) div.classList.add('weekday');
    
    datesContainer.appendChild(div);
  }
}

// Слушатели изменений селектов
monthSelect.addEventListener('change', () => {
  currentMonth = parseInt(monthSelect.value);
  renderCalendar(currentMonth, currentYear);
});

yearSelect.addEventListener('change', () => {
  currentYear = parseInt(yearSelect.value);
  renderCalendar(currentMonth, currentYear);
});

// Инициализация календаря
renderCalendar(currentMonth, currentYear);

// Работа с тегами фильтров
const categoryCheckboxes = document.querySelectorAll('.filters__checkbox input');
const tagsContainer = document.querySelector('.catalog__tags');
const resetButton = document.querySelector('.tag--reset');

// Обновление отображения тегов
function updateTags() {
  const existingTags = tagsContainer.querySelectorAll('.tag:not(.tag--reset)');
  existingTags.forEach(tag => tag.remove());

  categoryCheckboxes.forEach(checkbox => {
    if (checkbox.checked) {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.innerHTML = `
        Выбранный пункт фильтра
        <svg class='tag__icon' width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L11 11" stroke="#B9B4C0" stroke-linecap="round"/>
          <path d="M11 1L0.999999 11" stroke="#B9B4C0" stroke-linecap="round"/>
        </svg>
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

// Слушатели для чекбоксов
categoryCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', updateTags);
});

// Кнопка сброса тегов
resetButton.addEventListener('click', () => {
  categoryCheckboxes.forEach(checkbox => checkbox.checked = false);
  updateTags();
});

// Функция рендеринга пагинации
function renderPagination(container, currentPage, totalPages) {
  container.innerHTML = "";

  // Сколько страниц показывать в зависимости от ширины окна
  function getVisibleCount() {
    if (window.innerWidth <= 412) return 1;  
    if (window.innerWidth <= 1324) return 3;   
    return 4;                              
  }

  const visibleCount = getVisibleCount();

  // Кнопка "назад"
  const prev = document.createElement("button");
  prev.innerHTML = `<svg width="13" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M12.3173 18.9956C11.6984 19.6455 10.6698 19.6706 10.0199 19.0517L1.48868 10.9267C1.16664 10.62 0.984373 10.1947 0.984373 9.74994C0.984373 9.30521 1.16664 8.87992 1.48868 8.57321L10.0199 0.448213C10.6698 -0.170725 11.6984 -0.145638 12.3173 0.50425C12.9363 1.15414 12.9112 2.18272 12.2613 2.80166L4.96562 9.74994L12.2613 16.6982C12.9112 17.3172 12.9363 18.3457 12.3173 18.9956Z" fill="white"/>
</svg>`;
  prev.classList.add("prev");
  prev.disabled = currentPage === 1;
  prev.onclick = () => renderPagination(container, currentPage - 1, totalPages);
  container.appendChild(prev);

  // Вспомогательные функции добавления страниц и многоточий
  const addPage = (num) => {
    const btn = document.createElement("button");
    btn.className = "pagination__page" + (num === currentPage ? " pagination__page--active" : "");
    btn.textContent = num;
    btn.onclick = () => renderPagination(container, num, totalPages);
    container.appendChild(btn);
  };

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
  next.innerHTML = `<svg width="13" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.948279 19.4956C1.56722 20.1455 2.59581 20.1706 3.24569 19.5517L11.7769 11.4267C12.099 11.12 12.2813 10.6947 12.2813 10.2499C12.2813 9.80521 12.099 9.37992 11.7769 9.07321L3.24569 0.948213C2.5958 0.329275 1.56722 0.354362 0.948277 1.00425C0.329337 1.65414 0.354425 2.68272 1.00431 3.30166L8.3 10.2499L1.00431 17.1982C0.354426 17.8172 0.329339 18.8457 0.948279 19.4956Z" fill="white"/>
</svg>`;
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

// Функция работы бургер-меню
function burgerMenu() {
  const burger = document.querySelector('.burger');
  const burgerMenu = document.querySelector('.burger-menu');

  burger.addEventListener('click', e => {
    e.stopPropagation();
    burgerMenu.style.display = 'flex';
  });

  document.addEventListener('click', e => {
    if (!burgerMenu.contains(e.target) && !burger.contains(e.target)) {
      burgerMenu.style.display = 'none';
    }
  });
}

// Инициализация бургер-меню
burgerMenu();
