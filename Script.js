document.addEventListener('DOMContentLoaded', function () {

    // Find the button and the dropdown content
    const dropButton = document.querySelector('.drop-btn');
    const dropdownContent = document.querySelector('.dropdown-content');

    // Add a click event listener to the button
    dropButton.addEventListener('click', function (event) {
        // Stop the link from trying to go to a new page
        event.preventDefault();
        // Stop the click from immediately closing the menu (see window.onclick below)
        event.stopPropagation();

        // This is the magic: add or remove the '.show' class
        dropdownContent.classList.toggle('show');
    });

    // Add a click event listener to the whole window
    // This will close the dropdown if you click anywhere else
    window.addEventListener('click', function () {
        if (dropdownContent.classList.contains('show')) {
            dropdownContent.classList.remove('show');
        }
    });

});