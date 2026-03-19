// Booking widget: pricing, discount code, and reserve button logic

// Constants
const PRICE_PER_NIGHT = 85;
const CLEANING_FEE = 25;
const SERVICE_FEE = 15;
const VALID_DISCOUNT_CODE = 'sunshine';
const PAGE_LOAD_TIME = Date.now();

// EmailJS configuration — replace with real values from https://www.emailjs.com/
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

// State
let discountApplied = false;

// Inject confirmation CSS
const confirmationStyles = `
.checkmark-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #00a699;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(0);
  transition: transform 0.3s ease;
}
.checkmark-circle.animate {
  transform: scale(1);
}
.checkmark-circle svg {
  width: 40px;
  height: 40px;
  fill: none;
  stroke: white;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.confirm-detail {
  padding: 8px 0;
  font-size: 16px;
  border-bottom: 1px solid #eee;
}
.confirm-detail:last-child {
  border-bottom: none;
}
`;

// Inject CSS into document
const styleElement = document.createElement('style');
styleElement.textContent = confirmationStyles;
document.head.appendChild(styleElement);

// Helper function to format dates
function formatDate(date) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  return day + ' ' + monthNames[month] + ' ' + year;
}

// Generate booking reference
function generateBookingRef(checkInDate) {
  const year = checkInDate.getFullYear();
  const month = String(checkInDate.getMonth() + 1).padStart(2, '0');
  const day = String(checkInDate.getDate()).padStart(2, '0');

  // Generate 4 random alphanumeric uppercase characters
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  for (let i = 0; i < 4; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `SBB-${year}${month}${day}-${randomPart}`;
}

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
  const mobileReserveBtn = document.querySelector('.mobile-reserve');
  const bookingModal = document.getElementById('bookingModal');

  if (!bookingModal) return;

  // Function to handle reserve action
  const handleReserve = () => {
    const checkIn = window.calendar.getCheckIn();
    const checkOut = window.calendar.getCheckOut();

    // Validate dates are selected
    if (!checkIn || !checkOut) {
      // Scroll to booking widget on mobile if dates not selected
      const bookingWidget = document.querySelector('.booking-widget');
      if (bookingWidget && window.innerWidth <= 743) {
        bookingWidget.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

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
  };

  // Add click handler to main reserve button
  if (reserveBtn) {
    reserveBtn.addEventListener('click', handleReserve);
  }

  // Add click handler to mobile reserve button
  if (mobileReserveBtn) {
    mobileReserveBtn.addEventListener('click', handleReserve);
  }
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

// Handle booking form submission
function handleBookingForm() {
  const bookingForm = document.getElementById('bookingForm');

  if (!bookingForm) return;

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isSpam = false;

    // Spam check 1: Honeypot
    if (bookingForm.elements.website.value !== '') {
      isSpam = true;
    }

    // Spam check 2: Time check (submitted too quickly)
    if (Date.now() - PAGE_LOAD_TIME < 3000) {
      isSpam = true;
    }

    // Validate guest name
    const guestNameInput = document.getElementById('guestName');
    const guestName = guestNameInput.value.trim();

    if (!guestName) {
      guestNameInput.style.border = '2px solid #c13515';
      const errorMsg = document.createElement('div');
      errorMsg.textContent = 'Guest name is required';
      errorMsg.style.color = '#c13515';
      errorMsg.style.fontSize = '14px';
      errorMsg.style.marginTop = '4px';
      errorMsg.id = 'guestNameError';

      // Remove existing error if present
      const existingError = document.getElementById('guestNameError');
      if (existingError) {
        existingError.remove();
      }

      guestNameInput.parentNode.appendChild(errorMsg);

      // Reset after 2 seconds
      setTimeout(() => {
        guestNameInput.style.border = '';
        const errorToRemove = document.getElementById('guestNameError');
        if (errorToRemove) {
          errorToRemove.remove();
        }
      }, 2000);

      return;
    }

    // Clear any previous error styling
    guestNameInput.style.border = '';
    const existingError = document.getElementById('guestNameError');
    if (existingError) {
      existingError.remove();
    }

    // Get form values
    const guestEmail = document.getElementById('guestEmail').value.trim();
    const specialRequests = document.getElementById('specialRequests').value.trim();

    // Get booking details
    const checkIn = window.calendar.getCheckIn();
    const checkOut = window.calendar.getCheckOut();
    const nights = window.calendar.getNights();
    const guests = document.getElementById('guestSelect').value;
    const discountCode = document.getElementById('discountCode').value.trim();

    // Calculate total
    const subtotal = (PRICE_PER_NIGHT * nights) + CLEANING_FEE + SERVICE_FEE;
    const total = discountApplied ? 0 : subtotal;

    // Generate booking reference
    const bookingRef = generateBookingRef(checkIn);

    // Hide booking modal
    const bookingModal = document.getElementById('bookingModal');
    if (bookingModal) {
      bookingModal.style.display = 'none';
    }

    // Show confirmation
    showConfirmation(bookingRef, checkIn, checkOut, nights, guests);

    // Log booking data (only if not spam)
    if (!isSpam) {
      const bookingData = {
        bookingRef,
        guestName,
        guestEmail,
        specialRequests,
        checkIn: formatDate(checkIn),
        checkOut: formatDate(checkOut),
        nights,
        guests,
        discountCode,
        discountApplied,
        total
      };
      console.log('Booking data:', bookingData);

      // Send email notification (non-blocking — don't wait for it)
      if (typeof emailjs !== 'undefined' && EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID') {
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          guest_name: guestName,
          guest_email: guestEmail || 'Not provided',
          check_in: formatDate(checkIn),
          check_out: formatDate(checkOut),
          nights: nights.toString(),
          guests: guests,
          booking_ref: bookingRef,
          discount_code: discountCode || 'None',
          total_price: '£' + total,
          special_requests: specialRequests || 'None'
        }, EMAILJS_PUBLIC_KEY).catch(function(error) {
          console.error('EmailJS error:', error);
        });
      }
    }
  });
}

// Show confirmation overlay
function showConfirmation(bookingRef, checkIn, checkOut, nights, guests) {
  const confirmationOverlay = document.getElementById('confirmationOverlay');
  const confirmRef = document.getElementById('confirmRef');
  const confirmSummary = document.getElementById('confirmSummary');
  const checkmarkCircle = document.querySelector('.checkmark-circle');

  if (!confirmationOverlay) return;

  // Show overlay
  confirmationOverlay.style.display = 'flex';

  // Set booking reference
  if (confirmRef) {
    confirmRef.textContent = `Booking reference: ${bookingRef}`;
  }

  // Set booking summary
  if (confirmSummary) {
    confirmSummary.innerHTML = `
      <div class="confirm-detail"><strong>Property:</strong> Sunshine B&B</div>
      <div class="confirm-detail"><strong>Check-in:</strong> ${formatDate(checkIn)}</div>
      <div class="confirm-detail"><strong>Check-out:</strong> ${formatDate(checkOut)}</div>
      <div class="confirm-detail"><strong>Nights:</strong> ${nights}</div>
      <div class="confirm-detail"><strong>Guests:</strong> ${guests} guest${guests > 1 ? 's' : ''}</div>
    `;
  }

  // Animate checkmark
  if (checkmarkCircle) {
    // Reset animation
    checkmarkCircle.classList.remove('animate');
    // Trigger reflow
    void checkmarkCircle.offsetWidth;
    // Add animation class
    checkmarkCircle.classList.add('animate');
  }
}

// Handle confirmation "Done" button
function handleDoneButton() {
  const doneBtn = document.querySelector('.btn-done');
  const confirmationOverlay = document.getElementById('confirmationOverlay');

  if (!doneBtn || !confirmationOverlay) return;

  doneBtn.addEventListener('click', () => {
    // Hide confirmation overlay
    confirmationOverlay.style.display = 'none';

    // Reset the form
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
      bookingForm.reset();
    }

    // Reset discount
    discountApplied = false;
    const discountCodeInput = document.getElementById('discountCode');
    const discountMessage = document.getElementById('discountMessage');

    if (discountCodeInput) {
      discountCodeInput.value = '';
    }

    if (discountMessage) {
      discountMessage.textContent = '';
    }

    // Update price breakdown to reflect reset discount
    updatePriceBreakdown();
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

  // Set up booking form submission
  handleBookingForm();

  // Set up confirmation done button
  handleDoneButton();
});
