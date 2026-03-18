# Sunshine B&B — Airbnb Clone Listing Page

## Overview

A single-page static website that replicates an Airbnb listing page for "Sunshine B&B" — a cosy cottage bedroom at Sally's house. The site is a fun surprise for Sally's ~10-year-old nieces so they can "book" their stay like a real Airbnb, complete with a date picker, discount code, price breakdown, and booking confirmation email.

The site should be visually indistinguishable from a real Airbnb listing page, using the same colour scheme, typography, spacing, and layout patterns.

## Target Audience

Two ~10-year-old girls who will recognise Airbnb's interface. The tone should feel authentic and grown-up (not cartoonish), with warmth and charm in the written content.

## Technical Approach

- **Static HTML/CSS/JS** — single page, no framework
- **Form submission** — EmailJS (free tier, client-side, no backend needed) to send booking confirmation emails
- **Spam protection** — honeypot field, time-based submission check (minimum 3 seconds on page), EmailJS rate limiting
- **Hosting** — local for now; can be deployed to Netlify, GitHub Pages, or Laravel Forge later
- **Photos** — 21 HEIC photos in `/Sunshine B&B Photos/`, to be converted to optimised JPGs for web use

## Airbnb Design System

Matching the real Airbnb listing page exactly:

- **Background**: #FFFFFF
- **Primary text**: #222222
- **Secondary text**: #717171
- **Accent/CTA**: #FF385C (Airbnb rausch pink)
- **CTA gradient**: linear-gradient(to right, #E61E4D, #E31C5F, #D70466)
- **Borders**: #DDDDDD
- **Star colour**: #222222 (filled star icon)
- **Font family**: Circular, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, sans-serif (Airbnb uses Cereal, but Circular is the closest available web-safe alternative)
- **Border radius**: 12px for cards/images, 8px for inputs/buttons
- **Spacing**: 8px increments (8, 16, 24, 32, 48)
- **Responsive breakpoints**: mobile-first, with desktop layout at 744px+

## Page Sections

### 1. Navigation Bar

Fixed top nav matching Airbnb's style:
- Left: Sunshine B&B logo/branding (styled like the Airbnb logo — the "S" icon in rausch pink + "sunshine b&b" text)
- Right: minimal — no search bar or account menu needed (this is a single-listing site)

### 2. Photo Gallery

Airbnb's 5-photo grid layout:
- 1 large hero image (left, spanning full height)
- 4 smaller images in a 2x2 grid (right)
- Rounded corners (12px) on outer edges
- "Show all photos" button overlay (bottom-right)
- Clicking opens a full-screen photo gallery modal showing all 21 photos

**Photo selection for the grid (based on available images):**
1. Hero (large): IMG_8038 — wide shot of bedroom showing bed, art, bookshelf, the full room
2. Top-right: IMG_8037 — bed close-up with "Sunshine" cushion and patchwork quilt
3. Bottom-right: IMG_8034 — garden view from window
4. Top-far-right: IMG_8036 — bookshelf with fairy lights and photos
5. Bottom-far-right: IMG_8042 — reading corner with crochet blanket, floral cushion, chest of drawers

### 3. Listing Title & Info

- Title: **"Cosy Cottage with Handmade Quilts & Garden Views"**
- Rating: **5.0** (star icon)
- Reviews count: **12 reviews** (links to reviews section)
- Location: **England, United Kingdom** (underlined, matching Airbnb style)

### 4. Host Section

- **"Cosy cottage hosted by Sally"**
- Subtext: "2 guests · 1 bedroom · 1 bed · 1 bath"
- Host avatar: circle with "S" initial (or a photo of Sally if provided later)
- Separated by border-bottom

### 5. Property Highlights

Three highlight rows with icons (matching Airbnb's style):
1. **Entire home** — "You'll have the cottage all to yourself"
2. **Self check-in** — "Check yourself in with the lockbox"
3. **Free cancellation** — "Cancel anytime — it's your nan's house!"

### 6. Description

Warm, inviting description text:

> Welcome to Sunshine B&B — a cosy cottage bursting with colour and charm! Snuggle up under a beautiful handmade patchwork quilt, explore the bookshelf full of stories and games, and peek out at the garden from your window.
>
> Every corner has a surprise waiting for you — from the friendly animal paintings on the wall, to a little felt mouse sitting in a tiny rocking chair, to a gorgeous dolls house to play with. There's even a Noddy on the windowsill keeping watch!
>
> Your host Sally has thought of everything to make your stay special. This is more than just a place to sleep — it's a little adventure.

"Show more" link that expands the full text (if we write more).

### 7. Amenities — "What this place offers"

Two-column grid with icons:
- Comfy double bed
- Handmade patchwork quilt
- Books & games
- Garden view
- Dolls house
- Fairy lights
- Cuddly toys
- Reading corner
- Bedside lamp
- Fresh flowers

### 8. Reviews — "5.0 · 12 reviews"

Category ratings bar (all 5.0):
- Cleanliness: 5.0
- Accuracy: 5.0
- Check-in: 5.0
- Communication: 5.0
- Location: 5.0
- Value: 5.0

6 fictional guest reviews displayed in a 2-column grid, each with:
- Guest name and avatar initial
- Date (e.g., "February 2026")
- Review text

Example reviews (warm, fun, varied):
1. **Emma** — "The cosiest place I've ever stayed! The patchwork quilt is absolutely gorgeous and I didn't want to leave. Sally thought of every little detail."
2. **James** — "Five stars isn't enough! The dolls house alone is worth the trip. And the garden view from the window is lovely."
3. **Priya** — "Sally is the best host ever. Fresh flowers, fairy lights, and the most comfortable bed. I slept like a dream!"
4. **Tom** — "I spotted the little mouse in the rocking chair and it made my whole day. Such a charming, thoughtful space."
5. **Olivia** — "We've stayed in lots of Airbnbs and this is by far the best. The handmade quilt, the animal paintings, the books — pure magic."
6. **Daniel** — "If I could give this place 10 stars I would. Everything about Sunshine B&B is perfect. Already planning our next visit!"

### 9. Booking Widget (Sticky Sidebar)

Positioned on the right side, sticky on scroll:

- **Price**: £85 / night
- **Date picker**: check-in / check-out fields that open a calendar modal
  - Calendar shows month view, allows selecting date range
  - Minimum 1 night stay
- **Guests**: dropdown (1-2 guests)
- **Discount code**: text input field
  - Valid code: a fun word (e.g., "SUNSHINE" or "NANSHOUSE" — to be decided)
  - When valid code entered, price updates to show discount
- **Reserve button**: Airbnb gradient pink button
- **Price breakdown** (appears after dates selected):
  - £85 x N nights = £X
  - Cleaning fee: £25
  - Service fee: £15
  - Discount (if code applied): -£X (showing full amount off)
  - **Total**: £0 (if discount applied)
- "You won't be charged yet" text below button

### 10. Booking Flow

When the user clicks "Reserve":

1. **Validation**: check dates selected, guest count, form not submitted by bot (honeypot + time check)
2. **Confirmation page**: full-page overlay/new view styled like Airbnb's booking confirmation:
   - Big checkmark animation
   - "Your booking is confirmed!"
   - Booking reference number (randomly generated, e.g., "SBB-20260703-X4K2")
   - Summary: property name, dates, guests, host name
   - "Sally will be in touch with check-in details"
   - Property photo
3. **Email sent** (via EmailJS) to bmpaveley@gmail.com containing:
   - Subject: "New booking at Sunshine B&B!"
   - Body: guest name (from a simple name input on the booking form), dates, number of guests, booking reference, discount code used

### 11. Booking Form Fields

Before the confirmation, a brief form (styled like Airbnb's checkout):
- Guest first name (required)
- Guest email (optional — for sending them a copy of their confirmation)
- Any special requests (optional textarea)
- These appear after clicking "Reserve", either as a modal or a new page section

## Photo Processing

The 21 HEIC source photos need to be converted for web:
- Convert to JPEG format
- Create two sizes: full (1200px wide for gallery) and thumbnail (600px wide for grid)
- Optimise for web (quality ~85%)
- Store in a `/images/` directory in the project

## File Structure

```
/Sunshine B&B/
├── index.html          # Main listing page
├── css/
│   └── style.css       # All styles (Airbnb clone design system)
├── js/
│   └── app.js          # Calendar, booking logic, form submission, gallery
├── images/
│   ├── full/           # Full-size photos (1200px)
│   └── thumbs/         # Thumbnails (600px)
└── Sunshine B&B Photos/ # Original HEIC source files (not served)
```

## Spam Protection

- **Honeypot field**: hidden input field (`<input name="website" style="display:none">`). If filled in (by a bot), submission is silently rejected.
- **Time-based check**: timestamp set on page load. If form is submitted within 3 seconds, it's rejected (bots submit instantly).
- **EmailJS rate limiting**: free tier has built-in rate limits (200 emails/month, which is more than enough).

## Out of Scope

- User accounts / login
- Search functionality
- Multiple listings
- Payment processing
- Map/location widget (though we could add a static map image later)
- Mobile app
- Backend server (all client-side)
