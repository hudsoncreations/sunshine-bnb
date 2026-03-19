// Calendar date picker with range selection (Airbnb-style dropdown)

class Calendar {
  constructor() {
    this.currentMonth = new Date().getMonth();
    this.currentYear = new Date().getFullYear();
    this.checkIn = null;
    this.checkOut = null;
    this.selecting = 'checkin';
    this.onChange = null;
    this.containerId = null;
    this.isOpen = false;

    // Inject CSS styles
    this.injectStyles();
  }

  injectStyles() {
    const styleId = 'calendar-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      #calendarContainer {
        display: none;
        position: absolute;
        top: 100%;
        left: -1px;
        right: -1px;
        z-index: 50;
        background: white;
        border: 1px solid var(--color-border, #DDDDDD);
        border-radius: 0 0 12px 12px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.12);
        padding: 16px;
      }
      #calendarContainer.open {
        display: block;
      }
      @media (max-width: 743px) {
        #calendarContainer {
          position: relative;
          top: auto;
          left: auto;
          right: auto;
          border: none;
          border-radius: 0;
          box-shadow: none;
          border-top: 1px solid var(--color-border, #DDDDDD);
          padding: 16px 12px;
          margin-bottom: 24px;
        }
      }
      .calendar { width: 100%; }
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
      .calendar-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding-top: 12px; padding-bottom: 8px; border-top: 1px solid #eee; }
      .calendar-clear { font-size: 14px; font-weight: 600; text-decoration: underline; color: #222; background: none; border: none; cursor: pointer; padding: 4px 0; }
      .calendar-clear:hover { color: #000; }
      .calendar-close { font-size: 14px; font-weight: 600; color: white; background: #222; border: none; border-radius: 8px; padding: 8px 16px; cursor: pointer; }
      .calendar-close:hover { background: #000; }
      .booking-date-field.active { border-color: #222 !important; background-color: #f7f7f7; }
      .booking-dates-row .booking-date-field.active { outline: 2px solid #222; outline-offset: -2px; z-index: 1; position: relative; }
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

    // Footer with Clear dates and Close buttons
    html += '<div class="calendar-footer">';
    html += '<button class="calendar-clear" id="calendarClear">Clear dates</button>';
    html += '<button class="calendar-close" id="calendarClose">Close</button>';
    html += '</div>';

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
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.prevMonth();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.nextMonth();
      });
    }

    // Day clicks
    const days = container.querySelectorAll('.calendar-day:not(.disabled):not(.empty)');
    days.forEach(dayEl => {
      dayEl.addEventListener('click', (e) => {
        e.stopPropagation();
        const dateStr = e.target.getAttribute('data-date');
        if (dateStr) {
          const [year, month, day] = dateStr.split('-').map(Number);
          const date = new Date(year, month, day);
          date.setHours(0, 0, 0, 0);
          this.onDateClick(date);
        }
      });
    });

    // Clear dates button
    const clearBtn = container.querySelector('#calendarClear');
    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.clearDates();
      });
    }

    // Close button
    const closeBtn = container.querySelector('#calendarClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.close();
      });
    }
  }

  onDateClick(date) {
    if (this.selecting === 'checkin' || (this.checkIn && this.checkOut)) {
      // Starting new selection or resetting
      this.checkIn = date;
      this.checkOut = null;
      this.selecting = 'checkout';
      this.highlightField('checkout');
    } else if (this.selecting === 'checkout') {
      if (date > this.checkIn) {
        this.checkOut = date;
        this.selecting = 'checkin';
        // Auto-close after both dates selected
        this.close();
      } else {
        // Date is before or equal to check-in, restart selection
        this.checkIn = date;
        this.checkOut = null;
        this.highlightField('checkout');
      }
    }

    // Update display
    this.updateDateDisplays();

    // Re-render calendar (only if still open)
    if (this.isOpen) {
      this.render(this.containerId);
      // Re-apply the open class since render replaces innerHTML
      const container = document.getElementById(this.containerId);
      if (container) {
        container.classList.add('open');
      }
    }

    // Call onChange callback
    if (this.onChange) {
      this.onChange();
    }
  }

  // Open the calendar dropdown
  open(mode) {
    if (mode) {
      this.selecting = mode;
    }
    this.isOpen = true;

    const container = document.getElementById(this.containerId);
    if (container) {
      this.render(this.containerId);
      container.classList.add('open');
    }

    this.highlightField(this.selecting);
  }

  // Close the calendar dropdown
  close() {
    this.isOpen = false;
    const container = document.getElementById(this.containerId);
    if (container) {
      container.classList.remove('open');
    }

    // Remove active highlights
    const checkinField = document.getElementById('checkinField');
    const checkoutField = document.getElementById('checkoutField');
    if (checkinField) checkinField.classList.remove('active');
    if (checkoutField) checkoutField.classList.remove('active');
  }

  // Toggle calendar open/close
  toggle(mode) {
    if (this.isOpen && this.selecting === mode) {
      this.close();
    } else {
      this.open(mode);
    }
  }

  // Highlight the active date field
  highlightField(field) {
    const checkinField = document.getElementById('checkinField');
    const checkoutField = document.getElementById('checkoutField');

    if (checkinField) checkinField.classList.remove('active');
    if (checkoutField) checkoutField.classList.remove('active');

    if (field === 'checkin' && checkinField) {
      checkinField.classList.add('active');
    } else if (field === 'checkout' && checkoutField) {
      checkoutField.classList.add('active');
    }
  }

  // Clear selected dates
  clearDates() {
    this.checkIn = null;
    this.checkOut = null;
    this.selecting = 'checkin';
    this.updateDateDisplays();
    this.highlightField('checkin');

    // Re-render calendar
    this.render(this.containerId);
    const container = document.getElementById(this.containerId);
    if (container) {
      container.classList.add('open');
    }

    // Call onChange callback
    if (this.onChange) {
      this.onChange();
    }
  }

  updateDateDisplays() {
    const checkinDisplay = document.getElementById('checkinDisplay');
    const checkoutDisplay = document.getElementById('checkoutDisplay');

    if (checkinDisplay) {
      if (this.checkIn) {
        checkinDisplay.textContent = this.formatDate(this.checkIn);
        checkinDisplay.classList.add('selected');
      } else {
        checkinDisplay.textContent = 'Add date';
        checkinDisplay.classList.remove('selected');
      }
    }

    if (checkoutDisplay) {
      if (this.checkOut) {
        checkoutDisplay.textContent = this.formatDate(this.checkOut);
        checkoutDisplay.classList.add('selected');
      } else {
        checkoutDisplay.textContent = 'Add date';
        checkoutDisplay.classList.remove('selected');
      }
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

    // Keep calendar open after navigation
    const container = document.getElementById(this.containerId);
    if (container && this.isOpen) {
      container.classList.add('open');
    }
  }

  nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.render(this.containerId);

    // Keep calendar open after navigation
    const container = document.getElementById(this.containerId);
    if (container && this.isOpen) {
      container.classList.add('open');
    }
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('calendarContainer');
  if (!container) return;

  // Pre-render calendar (hidden by default via CSS)
  window.calendar.render('calendarContainer');

  // Click handlers for date fields
  const checkinField = document.getElementById('checkinField');
  const checkoutField = document.getElementById('checkoutField');

  if (checkinField) {
    checkinField.addEventListener('click', (e) => {
      e.stopPropagation();
      window.calendar.toggle('checkin');
    });
  }

  if (checkoutField) {
    checkoutField.addEventListener('click', (e) => {
      e.stopPropagation();
      window.calendar.toggle('checkout');
    });
  }

  // Close calendar when clicking outside the booking widget
  document.addEventListener('click', (e) => {
    if (!window.calendar.isOpen) return;

    const bookingWidget = document.querySelector('.booking-widget');
    if (bookingWidget && !bookingWidget.contains(e.target)) {
      window.calendar.close();
    }
  });
});
