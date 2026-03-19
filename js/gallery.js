// Photo gallery modal functionality

// All 21 photos in order
const PHOTOS = [
  'IMG_8025', 'IMG_8027', 'IMG_8028', 'IMG_8029', 'IMG_8030',
  'IMG_8031', 'IMG_8032', 'IMG_8034', 'IMG_8035', 'IMG_8036',
  'IMG_8037', 'IMG_8038', 'IMG_8039', 'IMG_8040', 'IMG_8041',
  'IMG_8042', 'IMG_8043', 'IMG_8045', 'IMG_8046', 'IMG_8047',
  'IMG_8048'
];

// Track current photo index
let currentIndex = 0;

// Open gallery at specific index
function openGallery(startIndex) {
  currentIndex = startIndex;
  const modal = document.getElementById('photoModal');
  const image = document.getElementById('galleryImage');
  const counter = document.getElementById('photoCounter');

  // Update image and counter
  image.src = `images/full/${PHOTOS[currentIndex]}.jpg`;
  counter.textContent = `${currentIndex + 1} / ${PHOTOS.length}`;

  // Show modal and prevent body scroll
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// Close gallery
function closeGallery() {
  const modal = document.getElementById('photoModal');
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

// Navigate to next photo
function nextPhoto() {
  currentIndex = (currentIndex + 1) % PHOTOS.length;
  updatePhoto();
}

// Navigate to previous photo
function prevPhoto() {
  currentIndex = (currentIndex - 1 + PHOTOS.length) % PHOTOS.length;
  updatePhoto();
}

// Update photo display
function updatePhoto() {
  const image = document.getElementById('galleryImage');
  const counter = document.getElementById('photoCounter');

  image.src = `images/full/${PHOTOS[currentIndex]}.jpg`;
  counter.textContent = `${currentIndex + 1} / ${PHOTOS.length}`;
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Map grid images to their indices in PHOTOS array
  // Grid images: IMG_8038 (index 11), IMG_8037 (index 10), IMG_8034 (index 7), IMG_8036 (index 9), IMG_8042 (index 15)
  const gridImageIndices = [11, 10, 7, 9, 15];

  // Photo grid image clicks
  const gridImages = document.querySelectorAll('.photo-grid img');
  gridImages.forEach((img, index) => {
    img.addEventListener('click', () => {
      openGallery(gridImageIndices[index]);
    });
  });

  // "Show all photos" button
  const showAllButton = document.querySelector('.show-all-photos');
  if (showAllButton) {
    showAllButton.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent triggering parent grid click
      openGallery(0);
    });
  }

  // Close button
  const closeButton = document.getElementById('closePhotoModal');
  if (closeButton) {
    closeButton.addEventListener('click', closeGallery);
  }

  // Previous button
  const prevButton = document.getElementById('prevPhoto');
  if (prevButton) {
    prevButton.addEventListener('click', prevPhoto);
  }

  // Next button
  const nextButton = document.getElementById('nextPhoto');
  if (nextButton) {
    nextButton.addEventListener('click', nextPhoto);
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('photoModal');
    if (modal.style.display === 'flex') {
      if (e.key === 'ArrowLeft') {
        prevPhoto();
      } else if (e.key === 'ArrowRight') {
        nextPhoto();
      } else if (e.key === 'Escape') {
        closeGallery();
      }
    }
  });

  // Close on backdrop click (outside image)
  const modal = document.getElementById('photoModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      // Only close if clicking the modal backdrop itself, not its children
      if (e.target === modal) {
        closeGallery();
      }
    });
  }
});
