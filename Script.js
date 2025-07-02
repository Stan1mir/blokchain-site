document.addEventListener('DOMContentLoaded', function () {

    // Find ALL dropdowns on the page
    const allDropdowns = document.querySelectorAll('.dropdown');

    // Add a click listener to EACH dropdown button
    allDropdowns.forEach(function (dropdown) {
        const button = dropdown.querySelector('.drop-btn');
        const content = dropdown.querySelector('.dropdown-content');

        button.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();

            // First, close all other open dropdowns
            closeAllDropdowns(content);

            // Then, toggle the one you clicked
            content.classList.toggle('show');
        });
    });

    // Function to close all dropdowns except the one we are opening
    function closeAllDropdowns(exceptThisOne) {
        allDropdowns.forEach(function (dropdown) {
            const content = dropdown.querySelector('.dropdown-content');
            if (content !== exceptThisOne) {
                content.classList.remove('show');
            }
        });
    }

    // Close all dropdowns if the user clicks anywhere else on the page
    window.addEventListener('click', function () {
        closeAllDropdowns(null); // Passing null closes all of them
    });

});