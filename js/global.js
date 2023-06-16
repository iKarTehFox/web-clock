const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
const menuVisCheckbox = document.getElementById('menuButtonVisible');
const fontSelector = document.getElementById('fontFamilySelect');
const regularTypeRadio = document.getElementById('regularStyle');
const italicTypeRadio = document.getElementById('italicStyle');
const menuOptions = document.getElementById("menu-options");
const menuButton = document.getElementById('menu-button');
const closeButton = document.getElementById('close-button');
const clockContainer = document.getElementById('clock-container');
const overrideTextColor = document.getElementById('override-text-color');
const colorInput = document.getElementById('textColorInput');

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

// Color override listener
overrideTextColor.addEventListener('change', function() {
  var isOverride = overrideTextColor.checked;
  colorInput.disabled = !isOverride;
});

// Color input listener
textColorInput.addEventListener("input", function() {
  const color = textColorInput.value;
  clockContainer.style.color = color;
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
    var isChecked = menuVisCheckbox.checked;
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
            var isChecked = menuVisCheckbox.checked;
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
        menuVisCheckbox.checked = true;
    }
});

// Fullscreen function
function toggleFullscreen() {
  if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
    // Enter fullscreen mode
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }
  } else {
    // Exit fullscreen mode
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

menuVisCheckbox.addEventListener('change', function() {
    var isChecked = menuVisCheckbox.checked;
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
