// This function handles the dropdown menu logic
document.addEventListener('DOMContentLoaded', function () {

    const dropButton = document.querySelector('.drop-btn');
    const dropdownContent = document.querySelector('.dropdown-content');

    // Toggle the dropdown when the button is clicked
    dropButton.addEventListener('click', function (event) {
        // This stops the link from trying to navigate away
        event.preventDefault();
        // This stops the window 'click' event below from firing immediately
        event.stopPropagation();

        // This adds or removes the 'show' class to display/hide the menu
        dropdownContent.classList.toggle('show');
    });

    // Close the dropdown if the user clicks anywhere else on the page
    window.addEventListener('click', function () {
        if (dropdownContent.classList.contains('show')) {
            dropdownContent.classList.remove('show');
        }
    });

});