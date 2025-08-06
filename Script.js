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
// --- SCRIPT FOR DUAL-ACTION DOWNLOAD BUTTON ---

// Find the button on the page
const downloadBtn = document.getElementById('download-extension-btn');

// Check if the button actually exists on the current page
if (downloadBtn) {
    downloadBtn.addEventListener('click', (event) => {
        // 1. Prevent the browser from immediately going to the install.html page
        event.preventDefault();

        // 2. Create a hidden link to the zip file and programmatically click it
        const zipUrl = 'https://github.com/Stan1mir/blokchain-site/raw/main/CryptoVerifierExtension.zip';
        const link = document.createElement('a');
        link.href = zipUrl;
        link.download = 'CryptoVerifierExtension.zip'; // Suggest a filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up the hidden link

        // 3. Now, after a short delay, manually navigate to the install page
        setTimeout(() => {
            window.location.href = downloadBtn.href;
        }, 500); // 500ms delay to ensure the download starts
    });
}