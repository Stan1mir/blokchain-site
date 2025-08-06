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
                event.preventDefault();

                // Logic to handle sub-menus differently
                const isSubDropdown = dropdown.classList.contains('sub-dropdown');
                if (isSubDropdown) {
                    // Prevent click from closing the parent menu
                    event.stopPropagation();
                }

                const isAlreadyOpen = dropdown.classList.contains('open-dropdown');

                // If it's not a sub-menu, close all other main menus
                if (!isSubDropdown) {
                    allDropdowns.forEach(d => {
                        if (!d.classList.contains('sub-dropdown')) {
                            d.classList.remove('open-dropdown');
                        }
                    });
                }

                // Toggle the clicked dropdown
                if (!isAlreadyOpen) {
                    dropdown.classList.add('open-dropdown');
                } else {
                    dropdown.classList.remove('open-dropdown');
                }
            });
        }
    });

    // --- Part 3: Close dropdowns if you click anywhere else on the page ---
    window.addEventListener('click', (event) => {
        if (!event.target.closest('.dropdown')) {
            allDropdowns.forEach(d => {
                d.classList.remove('open-dropdown');
            });
        }
    });
});
