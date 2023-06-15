function setTextColor(element) {
  // Get the text element
  var clockContainer = document.getElementById("clock-container");

  // Get the data-color attribute value from the clicked element
  var color = element.getAttribute("data-color");

  // Determine the luminance of the background color
  var luminance = getLuminance(color);

  // Set the text color based on the background luminance
  if (luminance > 0.62) {
    clockContainer.style.color = "#212529"; // Set black text color
  } else {
    clockContainer.style.color = "#FFFFFF"; // Set white text color
  }
}

function getLuminance(color) {
  // Calculate the luminance of the color
  // You can use different algorithms to calculate luminance, such as the relative luminance formula

  // Assuming color is in RGB format, convert it to relative luminance
  var r = parseInt(color.substr(1, 2), 16) / 255;
  var g = parseInt(color.substr(3, 2), 16) / 255;
  var b = parseInt(color.substr(5, 2), 16) / 255;

  // Calculate the relative luminance using the sRGB color space formula
  var luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luminance;
}
