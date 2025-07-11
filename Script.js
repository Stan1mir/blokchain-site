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