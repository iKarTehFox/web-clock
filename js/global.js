const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
const checkmarkCheckbox = document.getElementById('menuButtonVisible');
const fontSelector = document.getElementById('fontFamilySelect');
const regularTypeRadio = document.getElementById('regularStyle');
const italicTypeRadio = document.getElementById('italicStyle');
const menuOptions = document.getElementById("menu-options");
const menuButton = document.getElementById('menu-button');
const closeButton = document.getElementById('close-button');
const clockContainer = document.getElementById('clock-container');

// Font selector listener
regularTypeRadio.addEventListener('change', function() {
  clockContainer.style.fontStyle = 'normal'; // Set to regular (non-italic) style
});

italicTypeRadio.addEventListener('change', function() {
  clockContainer.style.fontStyle = 'italic'; // Set to italic style
});

// Font type listener
fontSelector.addEventListener('change', function() {
  var selectedFont = fontSelector.value;
  clockContainer.style.fontFamily = selectedFont;
});

// Menu button listener
document.getElementById("menu-button").addEventListener("click", function() {
    menuOptions.classList.add("menu-options-show");

    // Make close button visible
    closeButton.style.display = "block";
    menuButton.style.display = "none";
});

// Close button listener
document.getElementById("close-button").addEventListener("click", function() {
    menuOptions.scrollTop = 0;
    menuOptions.classList.remove("menu-options-show");
    closeButton.style.display = "none";
    var isChecked = checkmarkCheckbox.checked;
    if (isChecked)
        menuButton.style.display = "block";
});

// Click outside to close menu
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(event) {

        // Check if the clicked element is outside the menu-options container and not the menu button or its child elements
        if (!menuOptions.contains(event.target) && !menuButton.contains(event.target) && !closeButton.contains(event.target)) {
            // Toggle the menu-options container visibility by adding/removing the CSS class
            menuOptions.scrollTop = 0;
            menuOptions.classList.remove('menu-options-show');
            closeButton.style.display = "none";
            var isChecked = checkmarkCheckbox.checked;
            if (isChecked)
                menuButton.style.display = "block";
        }
    });
});

// Font weight menu function
function setFontWeight(fontWeight) {
    clockContainer.style.fontWeight = fontWeight;
}

// Menu button visibility
document.addEventListener('dblclick', function() {
    if (!menuOptions.contains(event.target) && !menuButton.contains(event.target) && !closeButton.contains(event.target)) {
        // Toggle the visibility of the menu button
        menuButton.style.display = 'block'; // Show the menu button

        // Set the checkmark checkbox as checked
        checkmarkCheckbox.checked = true;
    }
});

checkmarkCheckbox.addEventListener('change', function() {
    var isChecked = checkmarkCheckbox.checked;
    if (isChecked) {
        // Show the menu button
        if (!menuOptions.contains(event.target) && !menuButton.contains(event.target) && !closeButton.contains(event.target)) {
            menuButton.style.display = 'block';
        }
    } else {
        // Hide the menu button
        menuButton.style.display = 'none';
    }
});
