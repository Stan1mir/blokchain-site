// This code finds the dropdown menu element
const dropdown = document.querySelector('.dropdown');
const dropdownContent = document.querySelector('.dropdown-content');

// This function shows the dropdown when the mouse enters the menu item
dropdown.addEventListener('mouseenter', function () {
    dropdownContent.classList.add('show');
});

// This function hides the dropdown when the mouse leaves the menu item
dropdown.addEventListener('mouseleave', function () {
    dropdownContent.classList.remove('show'); // This is the corrected line
});