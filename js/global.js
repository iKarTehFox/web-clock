const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

const menu = {
    clockmoderadio: document.querySelectorAll('input[name="clock-mode-radio"]'),
    timeMethodSelect: document.getElementById('timeMethodSelect'),
    secondsvisradio: document.querySelectorAll('input[name="seconds-vis-radio"]'),
    secondsbarradio: document.querySelectorAll('input[name="seconds-bar-radio"]'),
    datealignradio: document.querySelectorAll('input[name="date-position-radio"]'),
    visCheckbox: document.getElementById('menuButtonVisible'),
    options: document.getElementById("menu-options"),
    obutton: document.getElementById('open-button'),
    cbutton: document.getElementById('close-button'),
    dateformselect: document.getElementById("dateFormatSelect"),
    faderad: document.getElementById('fademode'),
    solidrad: document.getElementById('solidmode'),
    colorbadge: document.getElementById('current-color-badge'),
    colormoderadio: document.querySelectorAll('input[name="color-mode-radio"]'),
    presetcolors: document.querySelectorAll('input[name="preset-color-radio"]'),
    bordertyperadio: document.querySelectorAll('input[name="border-type-radio"]'),
    borderstyleselect: document.getElementById('borderStyleSelect')
};

const font = {
    familysel: document.getElementById('fontFamilySelect'),
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
    date: document.getElementById("date"),
    secondsBar: document.getElementById("seconds-progress-bar")
}

// Define font sizes
const fontSizeOptions = {
    // 'container font size': 'indicator/date font size'
    '6vw': '1vw',
    '8vw': '1.25vw',
    '10vw': '1.5vw',
    '12vw': '2vw',
    '14vw': '2.25vw',
    '18vw': '3vw'
};

// Font style handler function
function modifyFontStyle(type, value) {
    switch (type) {
        case 'style':
            dtdisplay.ccontainer.style.fontStyle = value;
            break;
        case 'weight':
            dtdisplay.ccontainer.style.fontWeight = value;
            break;
        case 'size':
            dtdisplay.ccontainer.style.fontSize = value;
            dtdisplay.indicatorSlot.style.fontSize = fontSizeOptions[value];
            dtdisplay.date.style.fontSize = fontSizeOptions[value];
            break;
        case 'family':
            dtdisplay.ccontainer.style.fontFamily = value;
            break;
        default:
            console.error(`Invalid font modification type: ${type}`);
            break;
    }
}

// Seconds visibility listener
menu.secondsvisradio.forEach((radio) => {
    radio.addEventListener('change', () => {
        const value = radio.dataset.value;
        dtdisplay.colon2.style.display = value;
        dtdisplay.secondSlot.style.display = value;
    });
});

// Seconds bar visibility listener
menu.secondsbarradio.forEach((radio) => {
    radio.addEventListener('change', () => {
        const value = radio.dataset.value;
        if (value === 'block') {
            menu.bordertyperadio.forEach((btn) => {
                btn.disabled = true;
                if (btn.id === 'btyD') {
                    btn.checked = true;
                    btn.dispatchEvent(new Event('change'));
                }
            });
        } else {
            menu.bordertyperadio.forEach((btn) => {
                btn.disabled = false;
            });
        }
        dtdisplay.secondsBar.style.display = value;
    });
});

// Date alignment listener
menu.datealignradio.forEach((radio) => {
    radio.addEventListener('change', () => {
        const value = radio.dataset.value;
        dtdisplay.date.style.textAlign = value;
    });
});

// Font family listener
font.familysel.addEventListener('change', function() {
    const value = font.familysel.value;
    modifyFontStyle('family', value);
    font.customfontinput.value = '';
});

// Custom font input listeners and button status function
let fontButtonStatusID;

font.applyfontinput.addEventListener("click", function() {
  const customFont = font.customfontinput.value;

  if (customFont.length > 0) {
    clearTimeout(fontButtonStatusID);
    if (isFontAvailable(customFont)) {
      font.familysel.value = '';
      modifyFontStyle('family', customFont);
      applyFontStatus('success', 'Applied!');
    } else {
      applyFontStatus('danger', 'Invalid font!');
      font.customfontinput.value = '';
    }
  }
});

function applyFontStatus(status, text) {
  font.applyfontinput.className = `btn btn-outline-${status}`;
  font.applyfontinput.textContent = text;

  fontButtonStatusID = setTimeout(function() {
    font.applyfontinput.className = ('btn btn-outline-primary');
    font.applyfontinput.textContent = 'Submit';
  }, 2500);
}

// Font style listener
font.styleradio.forEach((radio) => {
    radio.addEventListener('change', () => {
        const value = radio.dataset.value;
        modifyFontStyle('style',value);
    });
});

// Font weight listener
font.weightradio.forEach((radio) => {
    radio.addEventListener('change', () => {
        const value = radio.dataset.value;
        modifyFontStyle('weight',value);
    });
});

// Font size listener
font.sizesel.addEventListener('change', () => {
    const value = font.sizesel.value;
    modifyFontStyle('size', value);
});

// Font text shadow listener
font.shadowrange.addEventListener('input', function() {
    var currentValue = this.value;
    var opacity = currentValue / 5;
    var strength = currentValue * 3;
    var dropShadowValue = `5px 5px ${strength}px rgba(0, 0, 0, ${opacity})`;
    document.getElementById("dropShadowRangeLabel").textContent = `Drop shadow: ${currentValue}`;

    dtdisplay.ccontainer.style.textShadow = currentValue > 0 ? dropShadowValue : 'none';
});

// Border type listener
menu.bordertyperadio.forEach((radio) => {
  radio.addEventListener('change', () => {
    const value = radio.dataset.value;
    menu.borderstyleselect.disabled = value === 'none';

    switch (value) {
      case 'none':
        menu.secondsbarradio.forEach((btn) => {
            btn.disabled = false;
        });
        dtdisplay.tcontainer.style.borderStyle = value;
        dtdisplay.tcontainer.style.borderBottomStyle = value;
        break;
      case 'regular':
        menu.secondsbarradio.forEach((btn) => {
            btn.disabled = true;
            if (btn.id === 'sbaN') {
                btn.checked = true;
                btn.dispatchEvent(new Event('change'));
            }
        });
        dtdisplay.tcontainer.style.borderBottomStyle = 'none';
        dtdisplay.tcontainer.style.borderStyle = menu.borderstyleselect.value;
        break;
      case 'bottom':
        menu.secondsbarradio.forEach((btn) => {
            btn.disabled = true;
            if (btn.id === 'sbaN') {
                btn.checked = true;
                btn.dispatchEvent(new Event('change'));
            }
        });
        dtdisplay.tcontainer.style.borderStyle = 'none';
        dtdisplay.tcontainer.style.borderBottomStyle = menu.borderstyleselect.value;
        break;
      default:
        console.error(`Invalid border type: ${value}`);
        break;
    }
  });
});

// Add a change event listener to the select dropdown
menu.borderstyleselect.addEventListener('change', () => {
    if (document.getElementById('btyR').checked) {
        dtdisplay.tcontainer.style.borderStyle = menu.borderstyleselect.value;
    } else if (document.getElementById('btyB').checked) {
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
        menu.obutton.style.display = 'block';
        menu.visCheckbox.checked = true;
    }
});

// Fullscreen function
function toggleFullscreen() {
    const element = document.documentElement;
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        // Enter fullscreen mode
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
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
