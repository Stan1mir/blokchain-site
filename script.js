// --- SCRIPT FOR NAVIGATION: SWIPEABLE MOBILE BAR + DROPDOWNS ---
// NOTE: this file must be named script.js (lowercase) because every
// page references <script src="script.js"> and GitHub Pages is
// case-sensitive. The old Script.js (capital S) was 404ing in production.

document.addEventListener('DOMContentLoaded', () => {

    const header = document.querySelector('.site-header');
    const navContainer = document.querySelector('.nav-container');
    const navList = document.querySelector('.site-header nav ul');

    // --- Part 0a: Inject the mobile brand row ---
    // Injected from JS so all 28 pages get it without editing any HTML.
    // Hidden on desktop (see style.css).
    if (navContainer) {
        const brand = document.createElement('a');
        brand.className = 'mobile-brand';
        brand.href = 'index.html';
        brand.textContent = 'blokchain.co.uk';
        navContainer.prepend(brand);
    }

    // --- Part 0b: Keep --header-height in sync ---
    // The mobile dropdown panels are position:fixed and need to know
    // exactly where the header ends. We measure it and publish it as
    // a CSS custom property, re-measuring on resize/rotation.
    const updateHeaderHeight = () => {
        if (header) {
            document.documentElement.style.setProperty(
                '--header-height',
                header.offsetHeight + 'px'
            );
        }
    };
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    // Re-measure once everything (fonts, icons) has finished loading
    window.addEventListener('load', updateHeaderHeight);

    // --- Part 0c: Swiping the bar closes any open panel ---
    // If you're swiping to a different menu, the old panel shouldn't
    // hang underneath. A plain tap never fires a scroll event, so
    // this only triggers on a real swipe.
    if (navList) {
        navList.addEventListener('scroll', () => {
            document.querySelectorAll('.dropdown.open-dropdown')
                .forEach(d => d.classList.remove('open-dropdown'));
        }, { passive: true });
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

                    // On the swipeable bar, gently bring a half-visible
                    // chip fully into view when tapped
                    if (window.innerWidth <= 950) {
                        dropBtn.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest',
                            inline: 'nearest'
                        });
                    }
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
});document.addEventListener('DOMContentLoaded', () => {
    // Select all the dropdown buttons
    const dropBtns = document.querySelectorAll('.drop-btn');

    dropBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Prevent the link from jumping to the top of the page
            e.preventDefault();

            // Find the specific dropdown menu connected to the clicked button
            const dropdownContent = this.nextElementSibling;

            // Toggle the 'show' class on or off
            dropdownContent.classList.toggle('show');

            // Close any other open dropdowns for a cleaner mobile experience
            dropBtns.forEach(otherBtn => {
                if (otherBtn !== this) {
                    otherBtn.nextElementSibling.classList.remove('show');
                }
            });
        });
    });

    // Close the dropdown if the user taps anywhere outside of the menu
    window.addEventListener('click', function(e) {
        if (!e.target.matches('.drop-btn')) {
            document.querySelectorAll('.dropdown-content').forEach(content => {
                content.classList.remove('show');
            });
        }
    });
});
