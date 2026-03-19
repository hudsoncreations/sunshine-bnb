// Booking widget: pricing, discount code, and reserve button logic

// Constants
const PRICE_PER_NIGHT = 85;
const CLEANING_FEE = 25;
const SERVICE_FEE = 15;
const VALID_DISCOUNT_CODE = 'sunshine';
const PAGE_LOAD_TIME = Date.now();

// State
let discountApplied = false;

// Update price breakdown based on selected nights
function updatePriceBreakdown() {
  const nights = window.calendar.getNights();
  const priceBreakdown = document.getElementById('priceBreakdown');

  if (!priceBreakdown) return;

  if (nights === 0) {
    priceBreakdown.style.display = 'none';
    return;
  }

  // Show price breakdown
  priceBreakdown.style.display = 'block';

  // Update nights line
  const nightsText = document.getElementById('nightsText');
  const nightsTotal = document.getElementById('nightsTotal');

  if (nightsText) {
    nightsText.textContent = `£85 x ${nights} night${nights > 1 ? 's' : ''}`;
  }

  if (nightsTotal) {
    nightsTotal.textContent = `£${PRICE_PER_NIGHT * nights}`;
  }

  // Calculate total
  const total = (PRICE_PER_NIGHT * nights) + CLEANING_FEE + SERVICE_FEE;

  // Update discount and total
  const discountRow = document.getElementById('discountRow');
  const discountAmount = document.getElementById('discountAmount');
  const totalPrice = document.getElementById('totalPrice');

  if (discountApplied) {
    // Show discount row
    if (discountRow) {
      discountRow.classList.remove('hidden');
    }

    // Set discount to full amount
    if (discountAmount) {
      discountAmount.textContent = `-£${total}`;
    }

    // Total is £0
    if (totalPrice) {
      totalPrice.textContent = '£0';
    }
  } else {
    // Hide discount row
    if (discountRow) {
      discountRow.classList.add('hidden');
    }

    // Show full total
    if (totalPrice) {
      totalPrice.textContent = `£${total}`;
    }
  }
}

// Handle discount code input
function handleDiscountCode() {
  const discountCodeInput = document.getElementById('discountCode');
  const discountMessage = document.getElementById('discountMessage');

  if (!discountCodeInput || !discountMessage) return;

  discountCodeInput.addEventListener('input', (e) => {
    const code = e.target.value.trim().toLowerCase();

    if (code === VALID_DISCOUNT_CODE) {
      // Valid discount code
      discountApplied = true;
      discountMessage.textContent = '✓ Discount applied!';
      discountMessage.style.color = 'green';
    } else if (code.length > 0) {
      // Invalid code
      discountApplied = false;
      discountMessage.textContent = 'Invalid code';
      discountMessage.style.color = '#c13515';
    } else {
      // Empty code
      discountApplied = false;
      discountMessage.textContent = '';
    }

    // Update price breakdown
    updatePriceBreakdown();
  });
}

// Handle reserve button click
function handleReserveButton() {
  const reserveBtn = document.querySelector('.btn-reserve');
  const bookingModal = document.getElementById('bookingModal');

  if (!reserveBtn || !bookingModal) return;

  reserveBtn.addEventListener('click', () => {
    const checkIn = window.calendar.getCheckIn();
    const checkOut = window.calendar.getCheckOut();

    // Validate dates are selected
    if (!checkIn || !checkOut) {
      // Show error by adding red border to date fields
      const checkinField = document.getElementById('checkinField');
      const checkoutField = document.getElementById('checkoutField');

      if (checkinField) {
        checkinField.style.border = '2px solid #c13515';
        setTimeout(() => {
          checkinField.style.border = '';
        }, 2000);
      }

      if (checkoutField) {
        checkoutField.style.border = '2px solid #c13515';
        setTimeout(() => {
          checkoutField.style.border = '';
        }, 2000);
      }

      return;
    }

    // Show booking modal
    bookingModal.style.display = 'flex';
  });
}

// Handle closing booking modal
function handleCloseModal() {
  const closeBtn = document.getElementById('closeBookingModal');
  const bookingModal = document.getElementById('bookingModal');

  if (!closeBtn || !bookingModal) return;

  // Close button click
  closeBtn.addEventListener('click', () => {
    bookingModal.style.display = 'none';
  });

  // Click on backdrop (outside modal content)
  bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
      bookingModal.style.display = 'none';
    }
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Hide price breakdown initially
  const priceBreakdown = document.getElementById('priceBreakdown');
  if (priceBreakdown) {
    priceBreakdown.style.display = 'none';
  }

  // Set up calendar change listener
  if (window.calendar) {
    window.calendar.onChange = updatePriceBreakdown;
  }

  // Set up discount code handler
  handleDiscountCode();

  // Set up reserve button
  handleReserveButton();

  // Set up modal close handlers
  handleCloseModal();
});
