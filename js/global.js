const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

const menu = {
    visCheckbox: document.getElementById('menuButtonVisible'),
    options: document.getElementById("menu-options"),
    obutton: document.getElementById('open-button'),
    cbutton: document.getElementById('close-button'),
    dateformselect: document.getElementById("dateFormatSelect"),
    faderad: document.getElementById('fademode'),
    solidrad: document.getElementById('solidmode'),
    colorbadge: document.getElementById('current-color-badge'),
    presetcolors: document.querySelectorAll('.preset-color'),
    timeMethodSelect: document.getElementById('timeMethodSelect')
};

const font = {
    selector: document.getElementById('fontFamilySelect'),
    regularrad: document.getElementById('regularStyle'),
    italicrad: document.getElementById('italicStyle'),
    sizesel: document.getElementById('sizeSelect')
};

const dtdisplay = {
    ccontainer: document.getElementById('clock-container'),
    hourSlot: document.getElementById('hour-slot'),
    colon1: document.getElementById('colon1'),
    minuteSlot: document.getElementById('minute-slot'),
    colon2: document.getElementById('colon2'),
    secondSlot: document.getElementById('second-slot'),
    indicatorSlot: document.getElementById("indicator"),
    date: document.getElementById("date")
}

// Font selector listener
font.regularrad.addEventListener('change', function() {
  dtdisplay.ccontainer.style.fontStyle = 'normal'; // Set to regular (non-italic) style
});

font.italicrad.addEventListener('change', function() {
  dtdisplay.ccontainer.style.fontStyle = 'italic'; // Set to italic style
});

// Font type listener
font.selector.addEventListener('change', function() {
  dtdisplay.ccontainer.style.fontFamily = font.selector.value;
});

// Font size listener
font.sizesel.addEventListener('change', () => {
    const selectedValue = font.sizesel.value;
    
    switch (selectedValue) {
        case 'smaller':
            dtdisplay.hourSlot.style.fontSize = '6vw';
            dtdisplay.colon1.style.fontSize = '6vw';
            dtdisplay.minuteSlot.style.fontSize = '6vw';
            dtdisplay.colon2.style.fontSize = '6vw';
            dtdisplay.secondSlot.style.fontSize = '6vw';
            dtdisplay.indicatorSlot.style.fontSize = '0.8vw';
            dtdisplay.date.style.fontSize = '0.8vw';
            console.log('Set sizing to smaller!');
            break;
        case 'small':
            dtdisplay.hourSlot.style.fontSize = '8vw';
            dtdisplay.colon1.style.fontSize = '8vw';
            dtdisplay.minuteSlot.style.fontSize = '8vw';
            dtdisplay.colon2.style.fontSize = '8vw';
            dtdisplay.secondSlot.style.fontSize = '8vw';
            dtdisplay.indicatorSlot.style.fontSize = '1vw';
            dtdisplay.date.style.fontSize = '1vw';
            console.log('Set sizing to small!');
            break;
        case 'default':
            dtdisplay.hourSlot.style.fontSize = '10vw';
            dtdisplay.colon1.style.fontSize = '10vw';
            dtdisplay.minuteSlot.style.fontSize = '10vw';
            dtdisplay.colon2.style.fontSize = '10vw';
            dtdisplay.secondSlot.style.fontSize = '10vw';
            dtdisplay.indicatorSlot.style.fontSize = '1.5vw';
            dtdisplay.date.style.fontSize = '1.5vw';
            console.log('Set sizing to default!');
            break;
        case 'large':
            dtdisplay.hourSlot.style.fontSize = '12vw';
            dtdisplay.colon1.style.fontSize = '12vw';
            dtdisplay.minuteSlot.style.fontSize = '12vw';
            dtdisplay.colon2.style.fontSize = '12vw';
            dtdisplay.secondSlot.style.fontSize = '12vw';
            dtdisplay.indicatorSlot.style.fontSize = '2vw';
            dtdisplay.date.style.fontSize = '2vw';
            console.log('Set sizing to large!');
            break;
        case 'larger':
            dtdisplay.hourSlot.style.fontSize = '14vw';
            dtdisplay.colon1.style.fontSize = '14vw';
            dtdisplay.minuteSlot.style.fontSize = '14vw';
            dtdisplay.colon2.style.fontSize = '14vw';
            dtdisplay.secondSlot.style.fontSize = '14vw';
            dtdisplay.indicatorSlot.style.fontSize = '2.2vw';
            dtdisplay.date.style.fontSize = '2.2vw';
            console.log('Set sizing to larger!');
            break;
    }
});

// Menu button listener
document.getElementById("open-button").addEventListener("click", function() {
    menu.options.classList.add("menu-options-show");

    // Make close button visible
    menu.cbutton.style.display = "block";
    menu.obutton.style.display = "none";
});

// Close button listener
document.getElementById("close-button").addEventListener("click", function() {
    menu.options.classList.remove("menu-options-show");
    menu.cbutton.style.display = "none";
    var isChecked = menu.visCheckbox.checked;
    if (isChecked)
        menu.obutton.style.display = "block";
});

// Click outside to close menu
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(event) {
        // Check if the clicked element is outside the menu-options container and not the menu button or its child elements
        if (!menu.options.contains(event.target) && !menu.obutton.contains(event.target) && !menu.cbutton.contains(event.target)) {
            // Toggle the menu-options container visibility by adding/removing the CSS class
            menu.options.classList.remove('menu-options-show');
            menu.cbutton.style.display = "none";
            var isChecked = menu.visCheckbox.checked;
            if (isChecked)
                menu.obutton.style.display = "block";
        }
    });
});

// Date position selector function
function setDateAlign(alignDir) {
    dtdisplay.date.style.textAlign = alignDir;
}

// Font weight menu function
function setFontWeight(fontWeight) {
    dtdisplay.ccontainer.style.fontWeight = fontWeight;
}

// Menu button visibility
document.addEventListener('dblclick', function() {
    if (!menu.options.contains(event.target) && !menu.obutton.contains(event.target) && !menu.cbutton.contains(event.target)) {
        // Toggle the visibility of the menu button
        menu.obutton.style.display = 'block'; // Show the menu button

        // Set the checkmark checkbox as checked
        menu.visCheckbox.checked = true;
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

menu.visCheckbox.addEventListener('change', function() {
    var isChecked = menu.visCheckbox.checked;
    if (isChecked) {
        // Show the menu button
        if (!menu.options.contains(event.target) && !menu.obutton.contains(event.target) && !menu.cbutton.contains(event.target)) {
            menu.obutton.style.display = 'block';
        }
    } else {
        // Hide the menu button
        menu.obutton.style.display = 'none';
    }
});
