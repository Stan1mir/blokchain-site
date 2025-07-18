// --- URL Checker Logic ---

// Wait for the page to fully load
document.addEventListener('DOMContentLoaded', () => {

    // Get the elements we need from the HTML
    const checkBtn = document.getElementById('check-url-btn');
    const urlInput = document.getElementById('url-to-check');
    const resultDisplay = document.getElementById('checker-result');

    // Make the button clickable
    checkBtn.addEventListener('click', () => {
        const urlToCheck = urlInput.value.trim();

        // Make sure the user entered something
        if (!urlToCheck) {
            resultDisplay.textContent = 'Please enter a URL.';
            resultDisplay.className = 'result-info'; // Use info color
            return;
        }

        // Fetch our list of sites
        fetch('site_lists.json')
            .then(response => response.json())
            .then(siteLists => {
                // Clean the user's URL to get just the main domain
                // Example: 'https://www.example.com/page' becomes 'example.com'
                let domain;
                try {
                    domain = new URL(urlToCheck).hostname.replace('www.', '');
                } catch (e) {
                    // If the URL is invalid, try a simple regex
                    const match = urlToCheck.match(/^(?:https?:\/\/)?(?:www\.)?([^\/]+)/);
                    if (match) {
                        domain = match[1];
                    } else {
                        resultDisplay.textContent = 'Invalid URL format.';
                        resultDisplay.className = 'result-info';
                        return;
                    }
                }

                // Check the domain against our lists
                if (siteLists.safe_sites.includes(domain)) {
                    resultDisplay.textContent = 'This site is on our SAFE list.';
                    resultDisplay.className = 'result-safe';
                } else if (siteLists.malicious_sites.includes(domain)) {
                    resultDisplay.textContent = 'WARNING: This site is on our MALICIOUS list!';
                    resultDisplay.className = 'result-danger';
                } else {
                    resultDisplay.textContent = 'This site is not currently in our database.';
                    resultDisplay.className = 'result-info';
                }

            })
            .catch(error => {
                console.error('Error loading site lists:', error);
                resultDisplay.textContent = 'Could not load the site lists. Please try again later.';
                resultDisplay.className = 'result-danger';
            });
    });
});
// --- SCRIPT FOR ACTIVE AND CLICKABLE DROPDOWN MENUS ---

document.addEventListener('DOMContentLoaded', () => {

    // --- Part 1: Highlight the link for the current page ---
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage !== 'index.html') {
        // Find the link that points to the current page
        const activeLink = document.querySelector(`.dropdown-content a[href="${currentPage}"]`);

        // If we found it, add the 'active-link' class to it
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
                // Prevent the link from navigating away
                event.preventDefault();

                // Check if the clicked dropdown is already open
                const isAlreadyOpen = dropdown.classList.contains('open-dropdown');

                // First, close all other dropdowns
                allDropdowns.forEach(d => {
                    d.classList.remove('open-dropdown');
                });

                // If it wasn't already open, open it now.
                if (!isAlreadyOpen) {
                    dropdown.classList.add('open-dropdown');
                }
                // If you click an already open menu, it will now close.
            });
        }
    });

    // --- Part 3 (Bonus): Close dropdowns if you click anywhere else on the page ---
    window.addEventListener('click', (event) => {
        // Check if the click was outside of any dropdown menu
        if (!event.target.closest('.dropdown')) {
            // If it was, close all open dropdowns
            allDropdowns.forEach(d => {
                d.classList.remove('open-dropdown');
            });
        }
    });
});