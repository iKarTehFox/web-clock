// Text color override listener
let tcoO = 0;
menu.textcoloroverrideradio.forEach((radio) => {
    radio.addEventListener('change', () => {
        if (radio.id === 'tcovD') {
            tcoO = 0;
            menu.textcolorinput.disabled = true;
            if (document.querySelector('input[name="color-mode-radio"]:checked').id === 'solidmode') {
                try {
                    document.querySelector('input[name="preset-color-radio"]:checked').dispatchEvent(new Event('change'));
                } catch (error) {
                    console.log('Tried to reset text color but no preset color selected. Setting to white.')
                    dtdisplay.ccontainer.style.color = '#fff';
                    dtdisplay.secondsBar.style.backgroundColor = '#fff';
                }
            }
        } else {
            tcoO = 1;
            menu.textcolorinput.disabled = false;
            menu.textcolorinput.dispatchEvent(new Event('input'));
        }
    });
});

menu.textcolorinput.addEventListener('input', function() {
    dtdisplay.ccontainer.style.color = this.value;
    dtdisplay.secondsBar.style.backgroundColor = this.value;
});

// Preset color buttons listener
menu.presetcolors.forEach((radio) => {
  radio.addEventListener('change', () => {
    const color = radio.dataset.color;
    // Determine the luminance of the background color
    var luminance = getLuminance(color);

    // Set the text color based on the background luminance
    if (luminance > 0.62 && tcoO === 0) {
        dtdisplay.ccontainer.style.color = "#212529"; // Set black text color
        dtdisplay.secondsBar.style.backgroundColor = "#212529";
    } else if (tcoO === 0) {
        dtdisplay.ccontainer.style.color = "#FFF"; // Set white text color
        dtdisplay.secondsBar.style.backgroundColor = "#FFF";
    }
    });
});

function getLuminance(color) {
  // Assuming color is in RGB format, convert it to relative luminance
  var r = parseInt(color.substr(1, 2), 16) / 255;
  var g = parseInt(color.substr(3, 2), 16) / 255;
  var b = parseInt(color.substr(5, 2), 16) / 255;

  // Calculate the relative luminance using the sRGB color space formula
  var luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luminance;
}