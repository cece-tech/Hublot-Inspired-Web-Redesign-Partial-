# Hublot-Inspired-Web-Redesign-Partial-
<img width="1917" height="1013" alt="Screenshot 2025-07-31 143617" src="https://github.com/user-attachments/assets/96e43b93-a2c7-4df9-929d-5c01a7a522d3" />
<img width="602" height="880" alt="image" src="https://github.com/user-attachments/assets/da30ac7b-773d-484b-9f11-d6d9613d5d0b" />

This project is a hands-on exploration into building sophisticated, responsive web layouts. From intricate grid systems to a custom JavaScript-powered news carousel, it demonstrates a strong command of HTML, CSS, and vanilla JS in replicating a high-end brand's digital presence.

## Project Objective
This project is a partial recreation and redesign of specific sections of the [Hublot official website](https://www.hublot.com/) (or a similar luxury watch brand), focusing on responsive design and interactive elements. The primary goal was to demonstrate proficiency in modern web development techniques by replicating complex layouts and functionalities, specifically a dynamic "Related News & Events" carousel.

## What Was Recreated
This repository showcases the implementation of the following key sections:

1.  **Craftsmanship & Boutiques Section:** A responsive two-column layout featuring large imagery with overlaid text and calls-to-action. On desktop, these appear side-by-side, while on smaller screens, they stack vertically.
2.  **Related News & Events Section:** A dynamic and responsive card-based layout.
    * On desktop, it displays a 3-column grid of news/event cards.
    * On mobile (screens up to 768px), it transforms into a single-card carousel with interactive "Previous" and "Next" navigation buttons and pagination dots.
3.  **Basic "Watches News" and "Sign-Up" Sections:** Foundational HTML structures with basic styling, demonstrating overall page integration.

The project emphasizes responsive design principles, ensuring a seamless user experience across various device sizes.

## Technologies Used
* **HTML5:** For structuring the web content.
* **CSS3:** For styling and creating responsive layouts (Flexbox, CSS Grid, Media Queries).
* **JavaScript (Vanilla JS):** For implementing the interactive carousel functionality in the "Related News & Events" section, including dynamic layout adjustments and navigation.

## Setup Instructions

To get a copy of this project up and running on your local machine for development and testing purposes, follow these simple steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/cece-tech/Hublot-Inspired-Web-Redesign-Partial-.git
    ```
2.  **Navigate to the project folder:**
    ```bash
    cd Hublot-Inspired-Web-Redesign-Partial
    ```

3.  **Open `index.html`:**
    Locate the `index.html` file in the root of the project folder and open it with your preferred web browser. All content, styling, and interactivity should load directly.

## Challenges Faced & Solutions

* **Responsive Carousel Implementation:** The primary challenge was creating a fluid carousel that adapts from a grid layout on larger screens to a single-item slide on mobile, while maintaining accurate positioning and smooth transitions.
    * **Solution:** This was addressed by dynamically adjusting CSS `display` properties (from `grid` to `flex`) and `flex-basis` via JavaScript based on `window.innerWidth`. Calculating the correct `translateX` values for the carousel was critical, especially accounting for padding and gaps between cards in different viewports. Thorough testing across various device widths was essential.
* **Image Sizing and Responsiveness:** Ensuring images filled their containers beautifully across different screen sizes without distortion.
    * **Solution:** Utilized `object-fit: cover;` on images within their wrappers to ensure they cover the designated area while maintaining aspect ratio, cropping as necessary.
* **Maintaining Code Readability and Structure:** As the project grew, keeping the HTML, CSS, and JavaScript well-organized.
    * **Solution:** Employed clear class naming conventions, separated concerns (HTML for structure, CSS for presentation, JS for behavior), and commented code where complex logic was involved.

## External Libraries or Assets Used

* **Fonts:** Standard web-safe fonts like Arial, Helvetica, and Times New Roman are used, which are typically available on most systems. No custom font libraries (like Google Fonts) were explicitly linked.

