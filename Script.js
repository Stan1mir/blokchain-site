// --- SCRIPT FOR ACTIVE AND CLICKABLE DROPDOWN MENUS ---

document.addEventListener('DOMContentLoaded', () => {

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