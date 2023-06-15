// Get the page load time
var durationElement = document.getElementById("time-duration");
var pageLoadTime = new Date();

// Function to calculate the duration and update the element
function updatePageDuration() {
  // Get the current time
  var currentTime = new Date();

  // Calculate the time difference in milliseconds
  var timeDiff = currentTime - pageLoadTime;

  // Convert the time difference to seconds, minutes, and hours
  var seconds = Math.floor(timeDiff / 1000) % 60;
  var minutes = Math.floor(timeDiff / (1000 * 60)) % 60;
  var hours = Math.floor(timeDiff / (1000 * 60 * 60));

  // Update the element with the duration
  var durationElement = document.getElementById("time-duration");
  durationElement.textContent = hours + "h, " + minutes + "m, and " + seconds + "s";
}


// Call the function to update the duration initially
updatePageDuration();

// Set up a setInterval to update the duration every second
setInterval(updatePageDuration, 1000);
