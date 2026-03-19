// Calendar date picker with range selection
class Calendar {
  constructor() {
    this.currentMonth = new Date().getMonth();
    this.currentYear = new Date().getFullYear();
    this.checkIn = null;
    this.checkOut = null;
    this.selecting = 'checkin';
    this.onChange = null;
    this.containerId = null;

    // Inject CSS styles
    this.injectStyles();
  }

  injectStyles() {
    const styleId = 'calendar-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .calendar { width: 100%; margin-top: 16px; }
      .calendar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
      .calendar-header button { background: none; border: none; cursor: pointer; font-size: 12px; padding: 8px; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: #222; transition: background 0.2s; }
      .calendar-header button:hover { background: #f7f7f7; }
      .calendar-header h3 { font-size: 14px; font-weight: 600; }
      .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; }
      .calendar-day-header { font-size: 12px; font-weight: 600; color: #717171; padding: 4px 0; }
      .calendar-day { padding: 0; font-size: 13px; cursor: pointer; border-radius: 50%; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
      .calendar-day:hover { background: #f7f7f7; }
      .calendar-day.disabled { color: #b0b0b0; cursor: default; text-decoration: line-through; }
      .calendar-day.disabled:hover { background: none; }
      .calendar-day.selected { background: #222; color: white; font-weight: 600; }
      .calendar-day.in-range { background: #f7f7f7; border-radius: 0; }
      .calendar-day.range-start { border-radius: 50% 0 0 50%; }
      .calendar-day.range-end { border-radius: 0 50% 50% 0; }
      .calendar-day.empty { cursor: default; }
      .calendar-day.empty:hover { background: none; }
    `;
    document.head.appendChild(style);
  }

  render(containerId) {
    this.containerId = containerId;
    const container = document.getElementById(containerId);
    if (!container) return;

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Build calendar HTML
    let html = '<div class="calendar">';

    // Header with month navigation
    html += '<div class="calendar-header">';
    html += `<button id="prevMonth" aria-label="Previous month">◀</button>`;
    html += `<h3>${monthNames[this.currentMonth]} ${this.currentYear}</h3>`;
    html += `<button id="nextMonth" aria-label="Next month">▶</button>`;
    html += '</div>';

    // Day headers
    html += '<div class="calendar-grid">';
    dayNames.forEach(day => {
      html += `<div class="calendar-day-header">${day}</div>`;
    });

    // Get first day of month and total days
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    // Convert to Monday-based (0 = Monday, 6 = Sunday)
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    // Current date for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Empty cells before month starts
    for (let i = 0; i < startDay; i++) {
      html += '<div class="calendar-day empty"></div>';
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(this.currentYear, this.currentMonth, day);
      date.setHours(0, 0, 0, 0);

      let classes = ['calendar-day'];

      // Check if date is in the past
      if (date < today) {
        classes.push('disabled');
      }

      // Check if date is selected
      if (this.checkIn && this.isSameDate(date, this.checkIn)) {
        classes.push('selected');
        if (this.checkOut && !this.isSameDate(this.checkIn, this.checkOut)) {
          classes.push('range-start');
        }
      } else if (this.checkOut && this.isSameDate(date, this.checkOut)) {
        classes.push('selected');
        if (this.checkIn && !this.isSameDate(this.checkIn, this.checkOut)) {
          classes.push('range-end');
        }
      } else if (this.checkIn && this.checkOut && date > this.checkIn && date < this.checkOut) {
        classes.push('in-range');
      }

      const dateStr = `${this.currentYear}-${this.currentMonth}-${day}`;
      html += `<div class="${classes.join(' ')}" data-date="${dateStr}">${day}</div>`;
    }

    html += '</div>'; // calendar-grid
    html += '</div>'; // calendar

    container.innerHTML = html;

    // Attach event listeners
    this.attachEventListeners();
  }

  attachEventListeners() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    // Month navigation
    const prevBtn = container.querySelector('#prevMonth');
    const nextBtn = container.querySelector('#nextMonth');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prevMonth());
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextMonth());
    }

    // Day clicks
    const days = container.querySelectorAll('.calendar-day:not(.disabled):not(.empty)');
    days.forEach(dayEl => {
      dayEl.addEventListener('click', (e) => {
        const dateStr = e.target.getAttribute('data-date');
        if (dateStr) {
          const [year, month, day] = dateStr.split('-').map(Number);
          const date = new Date(year, month, day);
          date.setHours(0, 0, 0, 0);
          this.onDateClick(date);
        }
      });
    });
  }

  onDateClick(date) {
    if (this.selecting === 'checkin' || (this.checkIn && this.checkOut)) {
      // Starting new selection or resetting
      this.checkIn = date;
      this.checkOut = null;
      this.selecting = 'checkout';
    } else if (this.selecting === 'checkout') {
      if (date > this.checkIn) {
        this.checkOut = date;
      } else {
        // Date is before or equal to check-in, restart selection
        this.checkIn = date;
        this.checkOut = null;
      }
    }

    // Update display
    this.updateDateDisplays();

    // Re-render calendar
    this.render(this.containerId);

    // Call onChange callback
    if (this.onChange) {
      this.onChange();
    }
  }

  updateDateDisplays() {
    const checkinDisplay = document.getElementById('checkinDisplay');
    const checkoutDisplay = document.getElementById('checkoutDisplay');

    if (checkinDisplay) {
      checkinDisplay.textContent = this.checkIn ? this.formatDate(this.checkIn) : 'Add date';
    }

    if (checkoutDisplay) {
      checkoutDisplay.textContent = this.checkOut ? this.formatDate(this.checkOut) : 'Add date';
    }
  }

  formatDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  isSameDate(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  prevMonth() {
    // Don't allow navigating to months before current month
    const today = new Date();
    const targetMonth = this.currentMonth - 1;
    const targetYear = targetMonth < 0 ? this.currentYear - 1 : this.currentYear;
    const normalizedMonth = targetMonth < 0 ? 11 : targetMonth;

    // Check if target month is before current month
    if (targetYear < today.getFullYear() ||
        (targetYear === today.getFullYear() && normalizedMonth < today.getMonth())) {
      return; // Don't navigate to past months
    }

    this.currentMonth = normalizedMonth;
    this.currentYear = targetYear;
    this.render(this.containerId);
  }

  nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.render(this.containerId);
  }

  getCheckIn() {
    return this.checkIn;
  }

  getCheckOut() {
    return this.checkOut;
  }

  getNights() {
    if (!this.checkIn || !this.checkOut) return 0;
    const diff = this.checkOut - this.checkIn;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}

// Create global calendar instance
window.calendar = new Calendar();

// Auto-render on page load if container exists
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('calendarContainer');
  if (container) {
    window.calendar.render('calendarContainer');
  }
});
