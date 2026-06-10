// --- SCRIPT FOR NAVIGATION: DROPDOWNS + MOBILE HAMBURGER MENU ---
// NOTE: this file must be named script.js (lowercase) because every
// page references <script src="script.js"> and GitHub Pages is
// case-sensitive. The old Script.js (capital S) was 404ing in production.

document.addEventListener('DOMContentLoaded', () => {

    const header = document.querySelector('.site-header');
    const navContainer = document.querySelector('.nav-container');
    const nav = document.querySelector('.site-header nav');

    // --- Part 0: Inject the mobile brand + hamburger button ---
    // Injected from JS so all 28 pages get it without editing any HTML.
    // Both elements are display:none on desktop (see style.css).
    if (header && navContainer && nav) {

        const brand = document.createElement('a');
        brand.className = 'mobile-brand';
        brand.href = 'index.html';
        brand.textContent = 'blokchain.co.uk';

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'menu-toggle';
        toggleBtn.setAttribute('aria-label', 'Open navigation menu');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';

        navContainer.prepend(brand);      // left side of the bar
        navContainer.appendChild(toggleBtn); // right side of the bar

        const closeMobileNav = () => {
            header.classList.remove('mobile-nav-open');
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        };

        toggleBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            const isOpen = header.classList.toggle('mobile-nav-open');
            toggleBtn.setAttribute('aria-expanded', String(isOpen));
            toggleBtn.innerHTML = isOpen
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';
        });

        // Close the panel when a real page link is tapped
        // (links with href="#" are dropdown triggers, so ignore those)
        nav.addEventListener('click', (event) => {
            const link = event.target.closest('a');
            if (link) {
                const href = link.getAttribute('href');
                if (href && href !== '#') {
                    closeMobileNav();
                }
            }
        });

        // If the window is resized back to desktop width, reset the menu
        window.addEventListener('resize', () => {
            if (window.innerWidth > 950) {
                closeMobileNav();
            }
        });
    }

    // --- Part 1: Highlight the link for the current page ---
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage !== 'index.html') {
        const activeLink = document.querySelector(`.dropdown-content a[href="${currentPage}"], .sub-menu a[href="${currentPage}"]`);
        if (activeLink) {
            activeLink.classList.add('active-link');
        }
    }

    // --- Part 2: Handle clicks on any dropdown menu ---
    const allDropdowns = document.querySelectorAll('.dropdown');

    allDropdowns.forEach(dropdown => {
        const dropBtn = dropdown.querySelector('.drop-btn');
        if (dropBtn) {
            dropBtn.addEventListener('click', (event) => {
                // Prevent the link from navigating if it's a dropdown trigger
                if (dropdown.querySelector('.dropdown-content')) {
                    event.preventDefault();
                }

                // Logic to handle sub-menus differently
                const isSubDropdown = dropdown.classList.contains('sub-dropdown');
                if (isSubDropdown) {
                    event.stopPropagation(); // Stop the click from closing the parent menu
                }

                const isAlreadyOpen = dropdown.classList.contains('open-dropdown');

                // If this is a main dropdown, close all other main dropdowns
                if (!isSubDropdown) {
                    allDropdowns.forEach(d => {
                        if (!d.classList.contains('sub-dropdown')) {
                            d.classList.remove('open-dropdown');
                        }
                    });
                }

                // Toggle the open state of the clicked dropdown
                if (!isAlreadyOpen) {
                    dropdown.classList.add('open-dropdown');
                } else {
                    dropdown.classList.remove('open-dropdown');
                }
            });
        }
    });

    // --- Part 3: Close all dropdowns if you click anywhere else on the page ---
    window.addEventListener('click', (event) => {
        if (!event.target.closest('.dropdown')) {
            allDropdowns.forEach(d => {
                d.classList.remove('open-dropdown');
            });
        }
    });
});
