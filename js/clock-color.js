menu.presetcolors.forEach((radio) => {
  radio.addEventListener('change', () => {
    const color = radio.dataset.color;
    // Determine the luminance of the background color
    var luminance = getLuminance(color);

    // Set the text color based on the background luminance
    if (luminance > 0.62) {
        dtdisplay.ccontainer.style.color = "#212529"; // Set black text color
        dtdisplay.secondsBar.style.backgroundColor = "#212529";
    } else {
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