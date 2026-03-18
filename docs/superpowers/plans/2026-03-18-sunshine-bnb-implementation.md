# Sunshine B&B Airbnb Clone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static single-page Airbnb listing clone for "Sunshine B&B" with a working booking form that sends email confirmations.

**Architecture:** Single-page static site (HTML/CSS/JS, no framework). Photos converted from HEIC source files. Booking form submits via EmailJS (client-side). Spam protection via honeypot fields and time-based checks.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, EmailJS (CDN), macOS `sips` for image conversion.

**Spec:** `docs/superpowers/specs/2026-03-18-sunshine-bnb-airbnb-clone-design.md`

---

## File Structure

```
/Sunshine B&B/
├── index.html              # Single-page listing (all sections)
├── css/
│   └── style.css           # Airbnb design system clone styles
├── js/
│   ├── gallery.js          # Photo gallery modal (open/close, navigate)
│   ├── calendar.js         # Date picker calendar (month view, range select)
│   └── booking.js          # Booking widget logic, discount codes, form, confirmation, EmailJS
├── images/
│   ├── full/               # Full-size JPEGs (1200px wide) for gallery modal
│   └── thumbs/             # Thumbnails (600px wide) for the 5-photo grid
└── Sunshine B&B Photos/    # Original HEIC source files (not served)
```

**Responsibility boundaries:**
- `index.html` — all page structure and content (nav, gallery grid, listing info, description, amenities, reviews, booking widget shell, booking form modal, confirmation overlay)
- `style.css` — all visual styling matching Airbnb's design system (colours, typography, spacing, layout, responsive breakpoints, animations)
- `gallery.js` — photo gallery modal: open from "Show all photos" or clicking a grid photo, navigate between photos, close. No dependencies on other JS files.
- `calendar.js` — date picker: render month grid, handle date range selection (check-in/check-out), expose selected dates. No dependencies on other JS files. Exposes a simple API that booking.js calls.
- `booking.js` — orchestrates the booking flow: reads dates from calendar, handles discount code validation, calculates price breakdown, shows/validates booking form, shows confirmation overlay, sends email via EmailJS. Depends on calendar.js being loaded first.

---

### Task 1: Convert photos from HEIC to web-optimised JPEG

**Files:**
- Create: `images/full/*.jpg` (21 files, 1200px wide)
- Create: `images/thumbs/*.jpg` (21 files, 600px wide)

- [ ] **Step 1: Create image directories**

```bash
mkdir -p "/Users/ben/Sunshine B&B/images/full"
mkdir -p "/Users/ben/Sunshine B&B/images/thumbs"
```

- [ ] **Step 2: Convert all HEIC files to full-size JPEG (1200px wide)**

```bash
for f in "/Users/ben/Sunshine B&B/Sunshine B&B Photos/"*.HEIC; do
  name=$(basename "$f" .HEIC)
  sips -s format jpeg -Z 1200 "$f" --out "/Users/ben/Sunshine B&B/images/full/${name}.jpg" 2>/dev/null
done
```

- [ ] **Step 3: Create thumbnails (600px wide)**

```bash
for f in "/Users/ben/Sunshine B&B/Sunshine B&B Photos/"*.HEIC; do
  name=$(basename "$f" .HEIC)
  sips -s format jpeg -Z 600 "$f" --out "/Users/ben/Sunshine B&B/images/thumbs/${name}.jpg" 2>/dev/null
done
```

- [ ] **Step 4: Verify all 21 images converted in both sizes**

```bash
ls "/Users/ben/Sunshine B&B/images/full/" | wc -l   # Should output 21
ls "/Users/ben/Sunshine B&B/images/thumbs/" | wc -l  # Should output 21
```

- [ ] **Step 5: Commit**

```bash
cd "/Users/ben/Sunshine B&B"
git add images/
git commit -m "feat: convert HEIC photos to web-optimised JPEGs"
```

---

### Task 2: HTML skeleton with Airbnb design system CSS

**Files:**
- Create: `index.html`
- Create: `css/style.css`

This task creates the page skeleton with all structural HTML and the full CSS design system. No interactive functionality yet — just the visual layout.

- [ ] **Step 1: Create `css/style.css` with Airbnb design system**

The CSS file must include:

**CSS custom properties (variables):**
```css
:root {
  --airbnb-rausch: #FF385C;
  --airbnb-hof: #484848;
  --airbnb-babu: #008489;
  --color-primary: #222222;
  --color-secondary: #717171;
  --color-border: #DDDDDD;
  --color-background: #FFFFFF;
  --color-star: #222222;
  --gradient-cta: linear-gradient(to right, #E61E4D, #E31C5F, #D70466);
  --font-family: Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif;
  --radius-lg: 12px;
  --radius-md: 8px;
  --spacing-xs: 8px;
  --spacing-sm: 12px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --max-width: 1120px;
}
```

**Sections to style:**
1. CSS reset (box-sizing, margins, font)
2. `.navbar` — fixed top, white background, bottom border, logo left
3. `.photo-grid` — CSS grid: `grid-template-columns: 2fr 1fr 1fr; grid-template-rows: 1fr 1fr;` with hero spanning both rows, 8px gap, outer 12px border-radius, overflow hidden, max-height ~400px
4. `.listing-header` — title (26px, weight 600), subtitle row with star, reviews, location
5. `.content-layout` — two-column grid: `grid-template-columns: 1fr 0.85fr;` with 80px gap, main content left, booking widget right
6. `.host-section` — flex row, avatar circle right, host name + property details left, border-bottom
7. `.highlights` — icon + text rows with border-bottom
8. `.description` — 16px text, line-height 1.5, border-bottom
9. `.amenities` — two-column grid, icon + text items, border-bottom
10. `.reviews-section` — rating overview (6 category bars in 2-col grid), review cards (2-col grid), avatar circles, border-bottom
11. `.booking-widget` — sticky (top: 80px), border, 12px radius, shadow `0 6px 16px rgba(0,0,0,0.12)`, price display, input areas, CTA button with gradient
12. `.booking-modal` — full-page overlay (hidden by default), z-index 1000, centered white card
13. `.confirmation-overlay` — full-page overlay (hidden by default), z-index 1000, centered content
14. `.photo-modal` — full-screen overlay for gallery (hidden by default), z-index 1000
15. Button styles: `.btn-primary` (gradient CTA, white text, 14px, weight 600, 48px height, full width, 8px radius, no border)
16. Responsive: at `max-width: 743px`, stack content-layout to single column, collapse booking widget to sticky bottom bar, stack photo-grid to single image with swipe indicator

- [ ] **Step 2: Create `index.html` with full page structure**

The HTML must include:
- `<head>` with charset, viewport meta, title "Sunshine B&B · Airbnb", link to style.css
- `<nav class="navbar">` — logo SVG/icon + "sunshine b&b" text
- `<section class="photo-grid">` — 5 `<img>` tags using thumbnail paths (IMG_8038 hero, IMG_8037, IMG_8034, IMG_8036, IMG_8042), "Show all photos" button
- `<main class="content-layout">` containing:
  - `<div class="main-content">`:
    - `<section class="listing-header">` — title h1, star/reviews/location row
    - `<section class="host-section">` — host name, property details, avatar
    - `<section class="highlights">` — 3 highlight items with SVG icons
    - `<section class="description">` — full description text from spec
    - `<section class="amenities">` — 10 amenity items with icons
    - `<section class="reviews-section">` — rating overview + 6 review cards
  - `<aside class="booking-widget">`:
    - Price display (£85 / night)
    - Check-in/check-out date inputs (as styled div triggers, not native inputs)
    - Guests dropdown
    - Discount code input
    - Reserve button
    - Price breakdown area (hidden until dates selected)
    - "You won't be charged yet" text
- `<div class="booking-modal" id="bookingModal">` — hidden overlay with guest name, email, special requests fields
- `<div class="confirmation-overlay" id="confirmationOverlay">` — hidden overlay with checkmark, booking details areas
- `<div class="photo-modal" id="photoModal">` — hidden overlay with large image, prev/next buttons, close button, counter
- Honeypot field inside booking form: `<input type="text" name="website" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px">`
- Script tags at bottom: `calendar.js`, `gallery.js`, `booking.js` (in this order — booking.js depends on calendar.js)

- [ ] **Step 3: Open in browser and verify the static layout renders**

```bash
open "/Users/ben/Sunshine B&B/index.html"
```

Verify: nav bar visible, photo grid shows 5 images, two-column layout renders, all text content visible, booking widget on right with sticky positioning. No JS functionality expected yet.

- [ ] **Step 4: Commit**

```bash
cd "/Users/ben/Sunshine B&B"
git add index.html css/
git commit -m "feat: add HTML skeleton and Airbnb design system CSS"
```

---

### Task 3: Photo gallery modal

**Files:**
- Create: `js/gallery.js`
- Modify: `index.html` (the photo-modal markup is already in place from Task 2)

The gallery modal opens when clicking "Show all photos" or any grid photo. It shows all 21 photos one at a time with prev/next navigation and a counter.

- [ ] **Step 1: Create `js/gallery.js`**

The file must:
- Define a `PHOTOS` array with all 21 image filenames in order (IMG_8025 through IMG_8048, matching the files in `images/full/`)
- Track `currentIndex` state
- `openGallery(startIndex)` — shows the modal, sets the image to `images/full/${PHOTOS[startIndex]}.jpg`, updates counter text, adds `overflow: hidden` to body
- `closeGallery()` — hides the modal, removes `overflow: hidden` from body
- `nextPhoto()` / `prevPhoto()` — increment/decrement currentIndex (wrapping around), update image src and counter
- Keyboard navigation: left/right arrows for prev/next, Escape to close
- Clicking the modal backdrop (outside the image) closes it
- Attach click handlers on DOMContentLoaded:
  - `.photo-grid img` elements: `openGallery(index)` where index maps to position in PHOTOS array
  - `.show-all-photos` button: `openGallery(0)`
  - `.photo-modal .close-btn`: `closeGallery()`
  - `.photo-modal .prev-btn`: `prevPhoto()`
  - `.photo-modal .next-btn`: `nextPhoto()`

- [ ] **Step 2: Verify gallery opens, navigates, and closes**

```bash
open "/Users/ben/Sunshine B&B/index.html"
```

Test: click "Show all photos" → modal opens at first photo. Click next → advances. Click prev → goes back. Press Escape → closes. Click a grid photo → opens at that photo. Counter shows "1 / 21" etc.

- [ ] **Step 3: Commit**

```bash
cd "/Users/ben/Sunshine B&B"
git add js/gallery.js
git commit -m "feat: add photo gallery modal with keyboard navigation"
```

---

### Task 4: Calendar date picker

**Files:**
- Create: `js/calendar.js`

The calendar renders a month grid, allows selecting a check-in and check-out date (range selection), and exposes the selected dates for booking.js to read.

- [ ] **Step 1: Create `js/calendar.js`**

The file must:
- Create a `Calendar` class (or object) that manages state and rendering
- State: `currentMonth`, `currentYear`, `checkIn` (Date or null), `checkOut` (Date or null), `selecting` ('checkin' | 'checkout')
- `render(containerId)` — renders into the specified container element:
  - Month/year header with left/right arrow buttons to navigate months
  - Day-of-week header row (Mon, Tue, Wed, Thu, Fri, Sat, Sun)
  - 6-row grid of day numbers
  - Past dates get a `disabled` class (greyed out, not clickable)
  - Selected check-in date highlighted with rausch pink circle
  - Selected check-out date highlighted with rausch pink circle
  - Dates between check-in and check-out get a light pink background
  - Empty cells for days before the 1st and after the last day of month
- `onDateClick(date)`:
  - If selecting check-in (or both are already set — resetting): set checkIn = date, clear checkOut, switch to selecting checkout
  - If selecting check-out: if date > checkIn, set checkOut = date. If date <= checkIn, set checkIn = date (restart selection)
  - Re-render the calendar
  - Call `this.onChange` callback if set (so booking.js can react)
- `getCheckIn()` / `getCheckOut()` — return Date objects or null
- `getNights()` — return number of nights between check-in and check-out, or 0
- Navigate month: `prevMonth()` / `nextMonth()` — update currentMonth/currentYear, re-render. Do not allow navigating to months before the current month.
- Expose as `window.calendar = new Calendar()` so booking.js can access it
- On DOMContentLoaded, check if container element `#calendarContainer` exists, and if so call `calendar.render('calendarContainer')`

- [ ] **Step 2: Verify calendar renders and date selection works**

```bash
open "/Users/ben/Sunshine B&B/index.html"
```

Test: calendar visible inside booking widget. Click a future date → check-in selected (pink circle). Click a later date → check-out selected (pink circle), range highlighted. Click month arrows → navigates months. Past dates are greyed out.

- [ ] **Step 3: Commit**

```bash
cd "/Users/ben/Sunshine B&B"
git add js/calendar.js
git commit -m "feat: add calendar date picker with range selection"
```

---

### Task 5: Booking widget logic, discount code, and price breakdown

**Files:**
- Create: `js/booking.js`
- Modify: `index.html` (minor — ensure data attributes or IDs are present for JS hooks, if not already)

This task wires up the booking widget: price calculation, discount code validation, price breakdown display, and the guest selector.

- [ ] **Step 1: Create `js/booking.js` — pricing and discount logic**

The file must:

**Constants:**
```javascript
const PRICE_PER_NIGHT = 85;
const CLEANING_FEE = 25;
const SERVICE_FEE = 15;
const VALID_DISCOUNT_CODE = 'sunshine';
```

**Price breakdown:**
- `updatePriceBreakdown()`:
  - Read nights from `window.calendar.getNights()`
  - If nights === 0, hide the breakdown section
  - If nights > 0, show:
    - `£85 x N nights = £X`
    - `Cleaning fee: £25`
    - `Service fee: £15`
    - If discount applied: `Discount: -£(total)` in green
    - `Total: £0` or `£(total)`
  - Update all DOM elements with calculated values

**Discount code:**
- Listen for `input` event on `#discountCode` field
- On each keystroke, compare `value.toLowerCase().trim()` to `VALID_DISCOUNT_CODE`
- If match: set `discountApplied = true`, show green checkmark next to input, call `updatePriceBreakdown()`
- If non-empty and no match: show subtle "Invalid code" text in red
- If empty: clear validation message

**Guest selector:**
- `#guestSelect` dropdown with options 1 and 2
- Store selected value in state

**Calendar integration:**
- Set `window.calendar.onChange = updatePriceBreakdown` so the price updates when dates change

**Reserve button:**
- On click of `.btn-reserve`:
  - Validate: check-in and check-out must be selected (if not, show "Please select dates" message)
  - If valid, open the booking modal (`#bookingModal`)

- [ ] **Step 2: Verify pricing, discount code, and reserve button work**

```bash
open "/Users/ben/Sunshine B&B/index.html"
```

Test: select dates → price breakdown appears with correct math. Type "sunshine" in discount field → green tick, discount line appears, total = £0. Type "wrong" → "Invalid code" message. Clear field → message clears. Click Reserve without dates → error message. Click Reserve with dates → booking modal opens.

- [ ] **Step 3: Commit**

```bash
cd "/Users/ben/Sunshine B&B"
git add js/booking.js
git commit -m "feat: add booking widget with pricing and discount code"
```

---

### Task 6: Booking form modal and confirmation overlay

**Files:**
- Modify: `js/booking.js` (add form submission and confirmation logic)

This task adds the booking form handling (guest name, email, special requests), the confirmation overlay, and wires up the spam protection.

- [ ] **Step 1: Add booking form and confirmation logic to `booking.js`**

**Spam protection — add near top of file:**
```javascript
const PAGE_LOAD_TIME = Date.now();
```

**Booking form submission handler:**
- Listen for submit on `#bookingForm`
- Prevent default
- Check honeypot: if `form.elements.website.value` is not empty, silently show fake confirmation (don't send email)
- Check time: if `Date.now() - PAGE_LOAD_TIME < 3000`, silently show fake confirmation (don't send email)
- Validate: guest first name is required (show inline error if empty)
- If valid:
  - Generate booking reference: `SBB-YYYYMMDD-XXXX` where YYYY/MM/DD is check-in date and XXXX is 4 random alphanumeric chars
  - Collect: guest name, guest email (optional), special requests (optional), check-in date, check-out date, number of nights, number of guests, discount code used, total price, booking reference
  - Hide booking modal
  - Show confirmation overlay with:
    - Animated checkmark (CSS animation — circle draws in, then tick draws in)
    - "Your booking is confirmed!" heading
    - Booking reference
    - Property name: "Sunshine B&B"
    - Dates: "3 Jul 2026 → 5 Jul 2026" (formatted nicely)
    - Guests: "2 guests"
    - "Sally will be in touch with check-in details"
    - Property photo (use hero thumbnail)
  - Send email via EmailJS (see Task 7 — for now, just `console.log` the booking data)

**Close handlers:**
- Booking modal: close button hides modal
- Confirmation overlay: "Done" button hides overlay and resets the form/calendar state

- [ ] **Step 2: Verify booking form validation, confirmation, and spam protection**

```bash
open "/Users/ben/Sunshine B&B/index.html"
```

Test: select dates → click Reserve → booking modal opens. Submit without name → error. Fill name → submit → booking modal closes, confirmation overlay shows with checkmark animation, correct booking details, reference number. Console.log shows booking data. Click Done → confirmation closes, form resets.

- [ ] **Step 3: Commit**

```bash
cd "/Users/ben/Sunshine B&B"
git add js/booking.js
git commit -m "feat: add booking form, confirmation overlay, and spam protection"
```

---

### Task 7: EmailJS integration

**Files:**
- Modify: `js/booking.js` (replace console.log with EmailJS send)
- Modify: `index.html` (add EmailJS CDN script tag)

This task wires up EmailJS to send real booking confirmation emails to bmpaveley@gmail.com.

- [ ] **Step 1: Add EmailJS CDN to `index.html`**

Add before the other script tags:
```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
```

- [ ] **Step 2: Set up EmailJS account and get credentials**

Guide the user through:
1. Go to https://www.emailjs.com/ and create a free account
2. Add an email service (Gmail) — this connects EmailJS to their email
3. Create an email template with these template variables:
   - `{{guest_name}}` — guest's first name
   - `{{guest_email}}` — guest's email (optional)
   - `{{check_in}}` — check-in date
   - `{{check_out}}` — check-out date
   - `{{nights}}` — number of nights
   - `{{guests}}` — number of guests
   - `{{booking_ref}}` — booking reference
   - `{{discount_code}}` — discount code used (or "None")
   - `{{total_price}}` — total price
   - `{{special_requests}}` — special requests (or "None")
4. Note down: Service ID, Template ID, Public Key

- [ ] **Step 3: Add EmailJS constants and send logic to `booking.js`**

Add constants at top of file:
```javascript
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';  // User replaces with real value
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
```

In the form submission handler, replace `console.log` with:
```javascript
emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
  guest_name: guestName,
  guest_email: guestEmail || 'Not provided',
  check_in: formatDate(checkIn),
  check_out: formatDate(checkOut),
  nights: nights,
  guests: guestCount,
  booking_ref: bookingRef,
  discount_code: discountCode || 'None',
  total_price: '£' + totalPrice,
  special_requests: specialRequests || 'None'
}, EMAILJS_PUBLIC_KEY);
```

Note: email sending should not block the confirmation overlay. Show the confirmation immediately and send the email in the background. If the email fails, log the error to console but don't show an error to the user (the confirmation is what matters for the fun experience).

- [ ] **Step 4: Test with real EmailJS credentials**

After the user has set up their EmailJS account and replaced the placeholder constants:
1. Open the page, select dates, fill in the form, submit
2. Check that the confirmation shows
3. Check that the email arrives at bmpaveley@gmail.com

- [ ] **Step 5: Commit**

```bash
cd "/Users/ben/Sunshine B&B"
git add index.html js/booking.js
git commit -m "feat: integrate EmailJS for booking confirmation emails"
```

---

### Task 8: Mobile responsive layout

**Files:**
- Modify: `css/style.css` (add/refine media queries)

This task ensures the page works well on mobile, matching Airbnb's mobile listing layout.

- [ ] **Step 1: Add mobile responsive styles**

At `max-width: 743px`:
- Photo grid: single image with horizontal scroll dots indicator (or stack vertically showing 1-2 images with "Show all photos" button)
- Content layout: single column (booking widget moves below main content)
- Booking widget: NOT sticky on mobile — instead, add a fixed bottom bar with "£85 night" and a "Reserve" button that scrolls to the booking widget section
- Reviews: single column instead of two-column grid
- Amenities: single column
- Rating overview: single column
- Nav: reduce padding
- All font sizes: ensure minimum 14px for readability

At `min-width: 744px` and `max-width: 1127px`:
- Reduce content-layout gap
- Photo grid height slightly smaller

- [ ] **Step 2: Test mobile layout**

```bash
open "/Users/ben/Sunshine B&B/index.html"
```

Test using browser dev tools responsive mode: resize to 375px width (iPhone). Verify: single column layout, sticky bottom bar visible, all content readable, photos not broken, booking form/modal works at small sizes.

- [ ] **Step 3: Commit**

```bash
cd "/Users/ben/Sunshine B&B"
git add css/style.css
git commit -m "feat: add mobile responsive layout"
```

---

### Task 9: Final polish and visual QA

**Files:**
- Modify: `css/style.css` (tweaks)
- Modify: `index.html` (tweaks)

Compare the page against the real Airbnb listing page (https://www.airbnb.co.uk/rooms/37440948) and fix any visual differences.

- [ ] **Step 1: Visual QA checklist**

Open both the real Airbnb listing and the Sunshine B&B page side by side. Check and fix:

- [ ] Nav bar height, padding, logo size matches
- [ ] Photo grid proportions and gap size match
- [ ] Title font size, weight, and spacing match
- [ ] Star icon and review count styling match
- [ ] Host section layout matches (name left, avatar right)
- [ ] Highlight items spacing and icon alignment match
- [ ] Description text size and line-height match
- [ ] Amenities grid spacing matches
- [ ] Reviews section layout matches (rating bars + cards)
- [ ] Booking widget shadow, padding, border matches
- [ ] Reserve button gradient and height match
- [ ] Price breakdown text size and spacing match
- [ ] Calendar popup styling is clean and matches Airbnb feel
- [ ] Confirmation overlay looks polished
- [ ] Section dividers (border-bottom) are correct colour and placement
- [ ] Overall max-width and page margins match

- [ ] **Step 2: Fix any identified issues**

Apply CSS/HTML tweaks to match the real Airbnb listing as closely as possible.

- [ ] **Step 3: Commit**

```bash
cd "/Users/ben/Sunshine B&B"
git add -A
git commit -m "fix: visual QA polish to match Airbnb listing layout"
```

---

## Summary

| Task | Description | Key Files |
|------|-------------|-----------|
| 1 | Convert photos HEIC → JPEG | `images/full/`, `images/thumbs/` |
| 2 | HTML skeleton + CSS design system | `index.html`, `css/style.css` |
| 3 | Photo gallery modal | `js/gallery.js` |
| 4 | Calendar date picker | `js/calendar.js` |
| 5 | Booking widget, pricing, discount code | `js/booking.js` |
| 6 | Booking form + confirmation overlay | `js/booking.js` |
| 7 | EmailJS integration | `js/booking.js`, `index.html` |
| 8 | Mobile responsive layout | `css/style.css` |
| 9 | Visual QA polish | `css/style.css`, `index.html` |
