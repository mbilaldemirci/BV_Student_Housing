// script.js

document.addEventListener("DOMContentLoaded", () => {
  const monthNumberEl = document.getElementById("monthNumber");
  const monthNameEl = document.getElementById("monthName");
  const yearLabelEl = document.getElementById("yearLabel");
  const calendarGrid = document.getElementById("calendarGrid");

  const prevMonthBtn = document.getElementById("prevMonth");
  const nextMonthBtn = document.getElementById("nextMonth");

  const modal = document.getElementById("taskModal");
  const modalDateText = document.getElementById("modalDateText");
  const roommateSelect = document.getElementById("roommateSelect");
  const taskInput = document.getElementById("taskInput");
  const taskForm = document.getElementById("taskForm");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const taskList = document.getElementById("taskList");
  const saveBtn = document.getElementById("saveBtn");

  // simple "fake DB" in memory for now
  // key: "YYYY-MM-DD" → array of { roommate, task }
  const assignments = {};

  // current month shown in the calendar
  let currentDate = new Date();

  // "today" for highlight
  const today = new Date();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();
  const todayDay = today.getDate();

  let selectedDateKey = null;
  let editingIndex = null; // null = adding new, number = edit existing

  const monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL",
    "MAY", "JUNE", "JULY", "AUGUST",
    "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];

  const weekdayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const roommateColors = {
    Roommate1: "var(--dot-r1)",
    Roommate2: "var(--dot-r2)",
    Roommate3: "var(--dot-r3)",
    Roommate4: "var(--dot-r4)",
    Roommate5: "var(--dot-r5)",
  };

  function getDateKey(year, monthIndex, day) {
    const mm = String(monthIndex + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  }

  function renderTaskList(dateKey) {
    const items = assignments[dateKey] || [];

    if (!items.length) {
      taskList.innerHTML = '<p class="modal-empty">No tasks yet for this day.</p>';
      return;
    }

    taskList.innerHTML = "";
    items.forEach((item, index) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("modal-task-item");

      const dot = document.createElement("span");
      dot.classList.add("modal-task-dot");
      dot.style.backgroundColor =
        roommateColors[item.roommate] || "var(--nav-active)";

      const main = document.createElement("div");
      main.classList.add("modal-task-main");

      const nameEl = document.createElement("div");
      nameEl.classList.add("modal-task-roommate");
      nameEl.textContent = item.roommate;

      const textEl = document.createElement("div");
      textEl.classList.add("modal-task-text");
      textEl.textContent = item.task;

      main.appendChild(nameEl);
      main.appendChild(textEl);

      const actions = document.createElement("div");
      actions.classList.add("modal-task-actions");

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.textContent = "Edit";
      editBtn.classList.add("task-btn", "task-btn-edit");
      editBtn.addEventListener("click", () => {
        editingIndex = index;
        roommateSelect.value = item.roommate;
        taskInput.value = item.task;
        saveBtn.textContent = "Update";
        taskInput.focus();
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("task-btn", "task-btn-delete");
      deleteBtn.addEventListener("click", () => {
        if (!assignments[dateKey]) return;
        assignments[dateKey].splice(index, 1);
        if (assignments[dateKey].length === 0) {
          delete assignments[dateKey];
        }

        // adjust editing index if needed
        if (editingIndex !== null) {
          if (editingIndex === index) {
            editingIndex = null;
            saveBtn.textContent = "Save";
            taskInput.value = "";
          } else if (editingIndex > index) {
            editingIndex -= 1;
          }
        }

        renderCalendar(currentDate);
        renderTaskList(dateKey);
      });

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);

      wrapper.appendChild(dot);
      wrapper.appendChild(main);
      wrapper.appendChild(actions);

      taskList.appendChild(wrapper);
    });
  }

  function openModal(dateKey, displayDateString) {
    selectedDateKey = dateKey;
    modalDateText.textContent = displayDateString;

    // reset editing state
    editingIndex = null;
    saveBtn.textContent = "Save";

    // show existing tasks for that date
    renderTaskList(dateKey);

    // reset form for adding a new one
    taskInput.value = "";
    roommateSelect.value = "Roommate1";

    modal.classList.add("open");
    taskInput.focus();
  }

  function closeModal() {
    modal.classList.remove("open");
    selectedDateKey = null;
    editingIndex = null;
    saveBtn.textContent = "Save";
    taskInput.value = "";
    roommateSelect.value = "Roommate1";
  }

  function renderCalendar(dateObj) {
    const year = dateObj.getFullYear();
    const monthIndex = dateObj.getMonth(); // 0 = Jan
    const firstDayOfMonth = new Date(year, monthIndex, 1);
    const startWeekday = firstDayOfMonth.getDay(); // 0=Sun
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    // header
    monthNumberEl.textContent = String(monthIndex + 1).padStart(2, "0");
    monthNameEl.textContent = monthNames[monthIndex];
    yearLabelEl.textContent = year;

    // clear grid
    calendarGrid.innerHTML = "";

    // weekday header row
    const weekdayRow = document.createElement("div");
    weekdayRow.classList.add("cal-row", "cal-row--weekdays");
    weekdayNames.forEach(name => {
      const cell = document.createElement("div");
      cell.classList.add("cal-cell");
      cell.textContent = name;
      weekdayRow.appendChild(cell);
    });
    calendarGrid.appendChild(weekdayRow);

    let currentDay = 1;
    let rowIndex = 0;

    while (currentDay <= daysInMonth) {
      const row = document.createElement("div");
      row.classList.add("cal-row");

      for (let col = 0; col < 7; col++) {
        if (rowIndex === 0 && col < startWeekday) {
          // empty cells before day 1
          const emptyCell = document.createElement("div");
          emptyCell.classList.add("cal-cell");
          row.appendChild(emptyCell);
        } else if (currentDay > daysInMonth) {
          // empty cells after last day
          const emptyCell = document.createElement("div");
          emptyCell.classList.add("cal-cell");
          row.appendChild(emptyCell);
        } else {
          const btn = document.createElement("button");
          btn.classList.add("cal-cell", "cal-cell--day");
          btn.textContent = currentDay;

          const dateKey = getDateKey(year, monthIndex, currentDay);
          btn.dataset.dateKey = dateKey;

          // mark as selected if it's the date currently open in modal
          if (dateKey === selectedDateKey) {
            btn.classList.add("selected");
          }

          // highlight today
          if (
            year === todayYear &&
            monthIndex === todayMonth &&
            currentDay === todayDay
          ) {
            btn.classList.add("today");
          }

          // if there are assignments, show up to 4 dots (+N for extra)
          const todaysAssignments = assignments[dateKey];
          if (todaysAssignments && todaysAssignments.length > 0) {
            const maxVisibleDots = 4;
            const dotsWrapper = document.createElement("div");
            dotsWrapper.classList.add("assignment-dots");

            todaysAssignments.slice(0, maxVisibleDots).forEach((assignment) => {
              const dot = document.createElement("span");
              dot.classList.add("assignment-dot");
              dot.style.backgroundColor =
                roommateColors[assignment.roommate] || "var(--nav-active)";
              dotsWrapper.appendChild(dot);
            });

            const remaining = todaysAssignments.length - maxVisibleDots;
            if (remaining > 0) {
              const more = document.createElement("span");
              more.classList.add("assignment-more");
              more.textContent = `+${remaining}`;
              dotsWrapper.appendChild(more);
            }

            // clicking the dot area opens the modal but doesn't double-trigger
            dotsWrapper.addEventListener("click", (event) => {
              event.stopPropagation();
              btn.click();
            });

            btn.appendChild(dotsWrapper);
          }

          btn.addEventListener("click", () => {
            // visual selection
            document
              .querySelectorAll(".cal-cell--day")
              .forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");

            const displayString = `${currentDay} ${monthNames[monthIndex]} ${year}`;
            openModal(dateKey, displayString);
          });

          row.appendChild(btn);
          currentDay++;
        }
      }

      calendarGrid.appendChild(row);
      rowIndex++;
    }
  }

  // Modal event listeners
  modalCloseBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!selectedDateKey) return;

    const roommate = roommateSelect.value;
    const taskText = taskInput.value.trim();
    if (!taskText) return; // prevent blank edits/adds

    if (!assignments[selectedDateKey]) {
      assignments[selectedDateKey] = [];
    }

    if (editingIndex === null) {
      // add new
      assignments[selectedDateKey].push({ roommate, task: taskText });
    } else {
      // update existing
      assignments[selectedDateKey][editingIndex] = { roommate, task: taskText };
    }

    // re-render calendar so dots appear / update
    renderCalendar(currentDate);

    // refresh list so changes show immediately
    renderTaskList(selectedDateKey);

    // reset form back to "add" mode
    editingIndex = null;
    saveBtn.textContent = "Save";
    taskInput.value = "";
  });

  // Month arrow handlers
  prevMonthBtn.addEventListener("click", () => {
    currentDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    selectedDateKey = null;
    editingIndex = null;
    saveBtn.textContent = "Save";
    renderCalendar(currentDate);
  });

  nextMonthBtn.addEventListener("click", () => {
    currentDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    selectedDateKey = null;
    editingIndex = null;
    saveBtn.textContent = "Save";
    renderCalendar(currentDate);
  });

  // initial render for the CURRENT month
  renderCalendar(currentDate);
});
