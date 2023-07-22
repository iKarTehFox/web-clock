const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

const menu = {
    secondsvisradio: document.querySelectorAll('input[name="seconds-vis-radio"]'),
    datealignradio: document.querySelectorAll('input[name="date-position-radio"]'),
    visCheckbox: document.getElementById('menuButtonVisible'),
    options: document.getElementById("menu-options"),
    obutton: document.getElementById('open-button'),
    cbutton: document.getElementById('close-button'),
    dateformselect: document.getElementById("dateFormatSelect"),
    faderad: document.getElementById('fademode'),
    solidrad: document.getElementById('solidmode'),
    colorbadge: document.getElementById('current-color-badge'),
    presetcolors: document.querySelectorAll('input[name="solid-color-radio"]'),
    timeMethodSelect: document.getElementById('timeMethodSelect'),
    bordertyperadio: document.querySelectorAll('input[name="border-type-radio"]'),
    borderstyleselect: document.getElementById('borderStyleSelect')
};

const font = {
    selector: document.getElementById('fontFamilySelect'),
    customfontinput: document.getElementById('customFontInputForm'),
    applyfontinput: document.getElementById('applyCustomFontButton'),
    styleradio: document.querySelectorAll('input[name="font-style-radio"]'),
    weightradio: document.querySelectorAll('input[name="font-weight-radio"]'),
    sizesel: document.getElementById('sizeSelect'),
    shadowrange: document.getElementById('dropShadowRange')
};

const dtdisplay = {
    ccontainer: document.getElementById('clock-container'),
    tcontainer: document.getElementById('time-container'),
    hourSlot: document.getElementById('hour-slot'),
    colon1: document.getElementById('colon1'),
    minuteSlot: document.getElementById('minute-slot'),
    colon2: document.getElementById('colon2'),
    secondSlot: document.getElementById('second-slot'),
    indicatorSlot: document.getElementById("indicator"),
    date: document.getElementById("date")
}

// Seconds visibility listener
menu.secondsvisradio.forEach((radio) => {
  radio.addEventListener('change', () => {
    const secondsVisibility = radio.id;
    
    if (secondsVisibility === 'secOn') {
        dtdisplay.colon2.style.display = '';
        dtdisplay.secondSlot.style.display = '';
    } else if (secondsVisibility === 'secOff') {
        dtdisplay.colon2.style.display = 'none';
        dtdisplay.secondSlot.style.display = 'none';
    }
  });
});

// Date alignment listener
menu.datealignradio.forEach((radio) => {
  radio.addEventListener('change', () => {
    const dateAlignment = radio.id;
    
    if (dateAlignment === 'dateleft') {
        dtdisplay.date.style.textAlign = 'left';
    } else if (dateAlignment === 'datecenter') {
        dtdisplay.date.style.textAlign = 'center';
    } else if (dateAlignment === 'dateright') {
        dtdisplay.date.style.textAlign = 'right';
    }
  });
});

// Font selector listener
font.styleradio.forEach((radio) => {
  radio.addEventListener('change', () => {
    const fontStyle = radio.id;
    
    if (fontStyle === 'regularStyle') {
        dtdisplay.ccontainer.style.fontStyle = 'normal';
    } else if (fontStyle === 'italicStyle') {
        dtdisplay.ccontainer.style.fontStyle = 'italic';
    }
  });
});

//Custom font input listeners and button status function
let intervalID;

font.applyfontinput.addEventListener("click", function () {
    const customFont = font.customfontinput.value;
    
    clearTimeout(intervalID);
    
    if (customFont.length > 0) {
        if (isFontAvailable(customFont)) {
            console.log(`Form had value: ${customFont}. Resetting selector and setting font.`);
            font.selector.value = '';
            dtdisplay.ccontainer.style.fontFamily = customFont;
            applyFontStatus('success', 'Applied!');
        } else {
            applyFontStatus('danger', 'Invalid font!');
            font.customfontinput.value = '';
        }
    }
});

function applyFontStatus(status, text) {
    font.applyfontinput.classList.remove('btn-outline-primary', 'btn-outline-danger', 'btn-outline-success');
    font.applyfontinput.classList.add(`btn-outline-${status}`);
    font.applyfontinput.textContent = text;
    
    intervalID = setTimeout(function() {
        font.applyfontinput.classList.remove(`btn-outline-${status}`);
        font.applyfontinput.classList.add('btn-outline-primary');
        font.applyfontinput.textContent = 'Submit';
    }, 2500);
}

// Font weight listener
font.weightradio.forEach((radio) => {
  radio.addEventListener('change', () => {
    const fontWeight = radio.id;
    
    if (fontWeight === 'lightWeight') {
        dtdisplay.ccontainer.style.fontWeight = 'lighter';
    } else if (fontWeight === 'normalWeight') {
        dtdisplay.ccontainer.style.fontWeight = 'normal';
    } else if (fontWeight === 'boldWeight') {
        dtdisplay.ccontainer.style.fontWeight = 'bold';
    }
  });
});

// Font family listener
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
            break;
        case 'small':
            dtdisplay.hourSlot.style.fontSize = '8vw';
            dtdisplay.colon1.style.fontSize = '8vw';
            dtdisplay.minuteSlot.style.fontSize = '8vw';
            dtdisplay.colon2.style.fontSize = '8vw';
            dtdisplay.secondSlot.style.fontSize = '8vw';
            dtdisplay.indicatorSlot.style.fontSize = '1vw';
            dtdisplay.date.style.fontSize = '1vw';
            break;
        case 'default':
            dtdisplay.hourSlot.style.fontSize = '10vw';
            dtdisplay.colon1.style.fontSize = '10vw';
            dtdisplay.minuteSlot.style.fontSize = '10vw';
            dtdisplay.colon2.style.fontSize = '10vw';
            dtdisplay.secondSlot.style.fontSize = '10vw';
            dtdisplay.indicatorSlot.style.fontSize = '1.5vw';
            dtdisplay.date.style.fontSize = '1.5vw';
            break;
        case 'large':
            dtdisplay.hourSlot.style.fontSize = '12vw';
            dtdisplay.colon1.style.fontSize = '12vw';
            dtdisplay.minuteSlot.style.fontSize = '12vw';
            dtdisplay.colon2.style.fontSize = '12vw';
            dtdisplay.secondSlot.style.fontSize = '12vw';
            dtdisplay.indicatorSlot.style.fontSize = '2vw';
            dtdisplay.date.style.fontSize = '2vw';
            break;
        case 'larger':
            dtdisplay.hourSlot.style.fontSize = '14vw';
            dtdisplay.colon1.style.fontSize = '14vw';
            dtdisplay.minuteSlot.style.fontSize = '14vw';
            dtdisplay.colon2.style.fontSize = '14vw';
            dtdisplay.secondSlot.style.fontSize = '14vw';
            dtdisplay.indicatorSlot.style.fontSize = '2.2vw';
            dtdisplay.date.style.fontSize = '2.2vw';
            break;
    }
});

//Font text shadow listener
font.shadowrange.addEventListener('input', function() {
    var currentValue = this.value;
    var opacity = currentValue / 5;
    var strength = currentValue * 3;
    var dropShadowValue = `5px 5px ${strength}px rgba(0, 0, 0, ${opacity})`;
    document.getElementById("dropShadowRangeLabel").textContent = `Drop shadow: ${currentValue}`;
    
    dtdisplay.ccontainer.style.textShadow = currentValue > 0 ? dropShadowValue : 'none';
  });
  
// Add a change event listener to the radio button group
menu.bordertyperadio.forEach((radio) => {
  radio.addEventListener('change', () => {
    if (radio.id === 'bordertypedisabled') {
      menu.borderstyleselect.disabled = true;
      dtdisplay.tcontainer.style.borderStyle = 'none';
      dtdisplay.tcontainer.style.borderBottomStyle = 'none';
    } else if (radio.id === 'bordertyperegular') {
      menu.borderstyleselect.disabled = false;
      dtdisplay.tcontainer.style.borderBottomStyle = 'none';
      dtdisplay.tcontainer.style.borderStyle = menu.borderstyleselect.value;
    } else if (radio.id === 'bordertypebottom') {
      menu.borderstyleselect.disabled = false;
      dtdisplay.tcontainer.style.borderStyle = 'none';
      dtdisplay.tcontainer.style.borderBottomStyle = menu.borderstyleselect.value;
    }
  });
});

// Add a change event listener to the select dropdown
menu.borderstyleselect.addEventListener('change', () => {
  if (document.getElementById('bordertyperegular').checked) {
    dtdisplay.tcontainer.style.borderStyle = menu.borderstyleselect.value;
  } else if (document.getElementById('bordertypebottom').checked) {
    dtdisplay.tcontainer.style.borderBottomStyle = menu.borderstyleselect.value;
  }
});

// Menu button listener
menu.obutton.addEventListener("click", function() {
    menu.options.classList.add("menu-options-show");

    // Make close button visible
    menu.cbutton.style.display = "block";
    menu.obutton.style.display = "none";
});

// Close button listener
menu.cbutton.addEventListener("click", function() {
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
