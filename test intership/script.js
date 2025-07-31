// Mobile Navigation Toggle
const menuIcon = document.querySelector('.menu-icon');
const navLinks = document.querySelector('.nav-links');

menuIcon.addEventListener('click', () => {
    // Toggle active class on menu icon
    menuIcon.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuIcon.contains(e.target) && !navLinks.contains(e.target)) {
        menuIcon.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// Close mobile menu when clicking a nav link
const navItems = document.querySelectorAll('.nav-links a');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        menuIcon.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        menuIcon.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const carouselTrack = document.querySelector('.carousel-track');
    const originalSlides = Array.from(document.querySelectorAll('.carousel-slide'));
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');

    const slidesPerView = 3; // Number of slides visible at a time
    let currentIndex = 0; // This will now track the index within the *extended* slides array
    let slideWidth = 0; // Will be calculated dynamically

    // --- 1. Clone Slides for Infinite Loop ---
    // Clone the last 'slidesPerView' slides from the original set and prepend them
    // This creates the "leading" clones for when you scroll left from the start
    for (let i = 0; i < slidesPerView; i++) {
        const clone = originalSlides[originalSlides.length - 1 - i].cloneNode(true);
        carouselTrack.prepend(clone);
    }
    // Clone the first 'slidesPerView' slides from the original set and append them
    // This creates the "trailing" clones for when you scroll right from the end
    for (let i = 0; i < slidesPerView; i++) {
        const clone = originalSlides[i].cloneNode(true);
        carouselTrack.appendChild(clone);
    }

    // Now, get the *updated* list of all slides, including the clones
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const totalSlides = slides.length; // Total number of slides after cloning

    // --- 2. Adjust Initial Position ---
    // The initial `currentIndex` should point to the first *original* slide.
    // Since we prepended `slidesPerView` clones, the first original slide
    // is now at index `slidesPerView` in the `slides` array.
    currentIndex = slidesPerView;

    // --- 3. Update Carousel Function ---
    // `smoothTransition` argument controls whether the CSS transition is applied for the move
    const updateCarousel = (smoothTransition = true) => {
        // Recalculate slideWidth on each update (especially important for resize)
        const computedStyle = getComputedStyle(originalSlides[0]); // Use original slide for consistent calculation
        const slideMarginLeft = parseFloat(computedStyle.marginLeft);
        const slideMarginRight = parseFloat(computedStyle.marginRight);
        slideWidth = originalSlides[0].offsetWidth + slideMarginLeft + slideMarginRight;

        const offset = currentIndex * slideWidth;

        // Temporarily disable transition for the "snap" effect
        if (!smoothTransition) {
            carouselTrack.style.transition = 'none';
        } else {
            carouselTrack.style.transition = 'transform 0.5s ease-in-out'; // Restore transition
        }

        carouselTrack.style.transform = `translateX(-${offset}px)`;

        // If transition was disabled, force a reflow and then re-enable it
        // This ensures the transition takes effect on subsequent moves
        if (!smoothTransition) {
            // A common trick to force a reflow/repaint
            carouselTrack.offsetWidth;
            carouselTrack.style.transition = 'transform 0.5s ease-in-out';
        }
    };

    // Initial setup: Position the carousel to show the first original slides immediately
    updateCarousel(false); // No smooth transition for the initial placement

    // Recalculate on window resize
    window.addEventListener('resize', () => {
        // When resizing, reset to the logical start (first original slide)
        // and then update without transition for correct recalculation
        currentIndex = slidesPerView;
        updateCarousel(false);
    });

    // --- 4. Navigation Buttons with Seamless Infinite Loop Logic ---

    nextButton.addEventListener('click', () => {
        currentIndex++;
        updateCarousel(); // Move to the next slide (could be a clone)

        // If we've moved past the original slides into the appended clones
        if (currentIndex >= (totalSlides - slidesPerView)) {
            // Wait for the transition to end, then instantly jump back to the start of original slides
            carouselTrack.addEventListener('transitionend', function handler() {
                carouselTrack.removeEventListener('transitionend', handler); // Remove listener to prevent multiple calls
                currentIndex = slidesPerView; // Set index to the first original slide
                updateCarousel(false); // Snap without transition
            });
        }
    });

    prevButton.addEventListener('click', () => {
        currentIndex--;
        updateCarousel(); // Move to the previous slide (could be a clone)

        // If we've moved before the original slides into the prepended clones
        if (currentIndex < slidesPerView) {
            // Wait for the transition to end, then instantly jump back to the end of original slides
            carouselTrack.addEventListener('transitionend', function handler() {
                carouselTrack.removeEventListener('transitionend', handler); // Remove listener
                // Jump to the equivalent of the last set of original slides
                currentIndex = totalSlides - (slidesPerView * 2);
                updateCarousel(false); // Snap without transition
            });
        }
    });

    // Optional: Auto-play functionality (uncomment to enable)
    // setInterval(() => {
    //     nextButton.click();
    // }, 3000); // Change slide every 3 seconds
});

document.addEventListener('DOMContentLoaded', () => {
    const newsEventsSection = document.querySelector('.news-events-section');
    const newsEventsContainer = newsEventsSection.querySelector('.news-events-container');
    let newsEventCards = Array.from(newsEventsContainer.querySelectorAll('.news-event-card'));
    const prevButton = newsEventsSection.querySelector('.carousel-nav-button.prev-slide');
    const nextButton = newsEventsSection.querySelector('.carousel-nav-button.next-slide');
    const paginationDotsContainer = newsEventsSection.querySelector('.carousel-pagination');

    if (!newsEventsContainer || newsEventCards.length === 0) {
        console.error('News & Events Carousel elements not found or incomplete.');
        return;
    }

    const mobileBreakpoint = 768; // Screens <= 768px will be 1-item carousel
    const tabletBreakpoint = 992; // Screens <= 992px will be 2-item grid/carousel
    const transitionDuration = 500; // ms
    let currentIndex = 0;
    let isTransitioning = false;
    let itemsPerView = 3; // Default for desktop grid
    const originalCardCount = newsEventCards.length;

    // Function to determine how many items should be visible
    const getItemsPerView = () => {
        if (window.innerWidth <= mobileBreakpoint) {
            return 1; // Show 1 item on mobile
        } else if (window.innerWidth <= tabletBreakpoint) {
            return 2; // Show 2 items on tablet
        } else {
            return 3; // Show 3 items on desktop
        }
    };

    // Function to apply grid or flex styles based on itemsPerView
    const applyLayout = () => {
        if (itemsPerView === 1 || itemsPerView === 2) { // When it's a carousel
            newsEventsContainer.style.display = 'flex';
            newsEventsContainer.style.flexWrap = 'nowrap';
            newsEventsContainer.style.overflowX = 'hidden';
            newsEventsContainer.style.gap = '0'; // Important to reset grid gap

            // Adjust card flex basis for carousel view
            newsEventCards.forEach(card => {
                card.style.flex = `0 0 calc(100% / ${itemsPerView})`;
                card.style.maxWidth = `calc(100% / ${itemsPerView})`; // Ensure max-width matches flex-basis
            });

            // Adjust padding to create visual spacing on mobile for single item
            if (itemsPerView === 1) {
                 newsEventCards.forEach(card => {
                    card.style.padding = '0 20px'; // Add padding to inside of cards
                 });
                 // Adjust the container's margin to compensate for the padding on the first card
                 newsEventsContainer.style.marginLeft = '-20px';
            } else { // For tablet (2 items), no extra padding needed for individual cards for carousel effect
                 newsEventCards.forEach(card => {
                    card.style.padding = '0';
                 });
                 newsEventsContainer.style.marginLeft = '0';
            }


        } else { // When it's a grid (desktop)
            newsEventsContainer.style.display = 'grid';
            newsEventsContainer.style.gridTemplateColumns = `repeat(${itemsPerView}, 1fr)`;
            newsEventsContainer.style.gap = '20px';
            newsEventsContainer.style.overflowX = 'visible';
            newsEventsContainer.style.marginLeft = '0'; // Reset for grid

            newsEventCards.forEach(card => {
                card.style.flex = ''; // Reset flex properties
                card.style.maxWidth = '';
                card.style.padding = '0'; // Remove padding from cards
            });
            // Ensure cards are at their original positions without transform
            newsEventsContainer.style.transform = 'translateX(0)';
            currentIndex = 0; // Reset index for grid view
        }
    };

    // Function to create or update pagination dots
    const createPaginationDots = () => {
        if (!paginationDotsContainer) return;

        paginationDotsContainer.innerHTML = ''; // Clear existing dots

        // Only create dots if it's a carousel (itemsPerView < originalCardCount)
        if (itemsPerView >= originalCardCount) {
            paginationDotsContainer.style.display = 'none'; // Hide dots if not enough items to scroll
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
            return;
        }

        paginationDotsContainer.style.display = 'flex'; // Show dots
        prevButton.style.display = 'flex'; // Show buttons
        nextButton.style.display = 'flex';


        // Number of pages for pagination
        const numPages = Math.ceil(originalCardCount / itemsPerView);
        for (let i = 0; i < numPages; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                if (!isTransitioning) {
                    currentIndex = i * itemsPerView; // Go to the start of that page
                    updateCarouselPosition();
                }
            });
            paginationDotsContainer.appendChild(dot);
        }
        updatePaginationDots(); // Initial update of active dot
    };

    // Function to update the active state of pagination dots
    const updatePaginationDots = () => {
        if (!paginationDotsContainer) return;
        const dots = paginationDotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === Math.floor(currentIndex / itemsPerView)) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    // Function to update the carousel's transform position
    const updateCarouselPosition = (duration = transitionDuration) => {
        if (isTransitioning && duration !== 0) return;

        let totalSlideWidth;
        if (itemsPerView === 1) { // Mobile: account for padding on individual cards
             const firstCard = newsEventCards[0];
             const cardWidth = firstCard.offsetWidth; // This already includes content + padding
             // The container is offset by -20px margin-left, so calculate based on full width
             totalSlideWidth = cardWidth;
        } else if (itemsPerView === 2) { // Tablet: 2 cards visible, consider gap as well
            const firstCard = newsEventCards[0];
            const cardWidth = firstCard.offsetWidth;
            const gap = parseFloat(window.getComputedStyle(newsEventsContainer).gap || '0'); // Get the gap from the container
            totalSlideWidth = cardWidth + gap; // Width of one card + the gap for the next card
        } else { // Desktop: grid, no transform needed
            newsEventsContainer.style.transform = 'translateX(0)';
            return;
        }

        // Calculate offset based on current index and slide width
        const offset = -currentIndex * totalSlideWidth;
        newsEventsContainer.style.transition = `transform ${duration / 1000}s ease-in-out`;
        newsEventsContainer.style.transform = `translateX(${offset}px)`;

        updatePaginationDots();
    };

    // Event listener for transition end to reset isTransitioning flag
    newsEventsContainer.addEventListener('transitionend', () => {
        isTransitioning = false;
    });

    // Navigation buttons
    nextButton.addEventListener('click', () => {
        if (!isTransitioning && currentIndex < originalCardCount - itemsPerView) {
            isTransitioning = true;
            currentIndex += itemsPerView; // Move by number of visible items
            updateCarouselPosition();
        } else if (!isTransitioning && currentIndex >= originalCardCount - itemsPerView) {
            // Loop back to start if at the end
            isTransitioning = true;
            currentIndex = 0;
            updateCarouselPosition();
        }
    });

    prevButton.addEventListener('click', () => {
        if (!isTransitioning && currentIndex > 0) {
            isTransitioning = true;
            currentIndex -= itemsPerView; // Move by number of visible items
            updateCarouselPosition();
        } else if (!isTransitioning && currentIndex <= 0) {
            // Loop to the end if at the beginning
            isTransitioning = true;
            currentIndex = Math.max(0, originalCardCount - itemsPerView); // Go to last possible start index
            updateCarouselPosition();
        }
    });

    // Handle resize events
    const handleResize = () => {
        const newItemsPerView = getItemsPerView();
        if (newItemsPerView !== itemsPerView) {
            itemsPerView = newItemsPerView;
            applyLayout(); // Reapply grid/flex styles
            createPaginationDots(); // Recreate dots for new layout
            currentIndex = 0; // Reset current index on layout change
            updateCarouselPosition(0); // Instantly snap to correct position
        } else if (itemsPerView === 1 || itemsPerView === 2) { // Only update position if still a carousel
            updateCarouselPosition(0); // Snap to position, especially important for orientation changes on mobile
        }

        // Hide/show navigation if not enough items to scroll
        if (originalCardCount <= itemsPerView) {
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
            if (paginationDotsContainer) paginationDotsContainer.style.display = 'none';
        } else {
            prevButton.style.display = 'flex'; // Use flex to center arrows
            nextButton.style.display = 'flex';
            if (paginationDotsContainer) paginationDotsContainer.style.display = 'flex'; // Use flex to center dots
        }
    };


    // Initial setup
    handleResize(); // Call on load to set initial layout and visibility

    // Add resize listener
    window.addEventListener('resize', handleResize);
});

document.addEventListener('DOMContentLoaded', () => {
    // Get all watch items
    const watchItems = document.querySelectorAll('.watch-item');

    // Store interval IDs for each watch item to manage them independently
    const watchItemIntervals = new Map();

    const IMAGE_CYCLE_DELAY = 1500; // 1.5 seconds for image change

    // Function to start the image carousel for a given watch item
    function startImageCarousel(watchItemElement) {
        // Stop any existing interval for this watch item
        stopImageCarousel(watchItemElement);

        const images = Array.from(watchItemElement.querySelectorAll('.watch-img'));
        if (images.length <= 1) {
            // If 0 or 1 image, ensure the first one is shown and do nothing else
            if (images.length === 1) {
                images[0].classList.add('active-img');
            }
            return;
        }

        // Initialize to the first image and then start cycling
        let currentIndex = 0;
        images.forEach(img => img.classList.remove('active-img')); // Hide all
        images[currentIndex].classList.add('active-img'); // Show first image

        const intervalId = setInterval(() => {
            images[currentIndex].classList.remove('active-img'); // Hide current
            currentIndex = (currentIndex + 1) % images.length; // Move to next image
            images[currentIndex].classList.add('active-img'); // Show next image
        }, IMAGE_CYCLE_DELAY);

        // Store the interval ID specific to this watch item
        watchItemIntervals.set(watchItemElement, intervalId);
    }

    // Function to stop the image carousel for a given watch item
    function stopImageCarousel(watchItemElement) {
        const intervalId = watchItemIntervals.get(watchItemElement);
        if (intervalId) {
            clearInterval(intervalId);
            watchItemIntervals.delete(watchItemElement); // Remove from map
        }
        // Reset to the first image when stopping
        const images = Array.from(watchItemElement.querySelectorAll('.watch-img'));
        images.forEach(img => img.classList.remove('active-img'));
        if (images.length > 0) {
            images[0].classList.add('active-img'); // Show the first image
        }
    }

    // Initialize all watch items: ensure only the first image is shown initially
    watchItems.forEach(item => {
        stopImageCarousel(item); // Call stop to ensure initial state (shows first image)
    });

    // Add event listeners for "pointing" (hovering)
    watchItems.forEach(watchItem => {
        watchItem.addEventListener('mouseenter', () => {
            startImageCarousel(watchItem);
        });

        watchItem.addEventListener('mouseleave', () => {
            stopImageCarousel(watchItem);
        });

        // For touch devices (tap to activate/deactivate cycling)
        // This makes it toggle, you might want a different UX for touch
        watchItem.addEventListener('click', () => {
            const currentIntervalId = watchItemIntervals.get(watchItem);
            if (currentIntervalId) {
                stopImageCarousel(watchItem);
            } else {
                // Stop all other carousels if one is clicked (optional, but good for single focus)
                watchItems.forEach(otherItem => {
                    if (otherItem !== watchItem) {
                        stopImageCarousel(otherItem);
                    }
                });
                startImageCarousel(watchItem);
            }
        });
    });
});