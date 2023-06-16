// Page duration elements
var durationElement = document.getElementById("time-duration");
var pageLoadTime = new Date();

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

// Clock functions
const clockModeGroup = document.getElementById('clock-mode-group');
let cMode = 0;

// Listen for 12/24-hour radio change
clockModeGroup.addEventListener('change', function() {
  // Get the selected radio button
  const clockMode = document.querySelector('input[name="clock-mode-radio"]:checked');

  // Update the clock mode based on the selected button
  if (clockMode.id == '24hour') {
    cMode = 1; // 24-hour mode
  } else {
    cMode = 0; // 12-hour mode
  }
  updateTime();
});

function getTime() {
    var clock = new Date();
    var ind = (clock.getHours()) < 12 ? "AM" : "PM";
    var hrs = (cMode === 0) ? (clock.getHours() % 12 == 0 ? 12 : clock.getHours()) % 12 : String(clock.getHours()).padStart(2, '0');
    var min = String(clock.getMinutes()).padStart(2, '0');
    var sec = String(clock.getSeconds()).padStart(2, '0');
    
    // Return the values as an object
    return {
    indicator: ind,
    hours: hrs,
    minutes: min,
    seconds: sec
    };
}

function updateTime() {
    var time=getTime();
    
    // Update the hour span
    var hourSlot = document.getElementById('hour-slot');
    hourSlot.textContent = time.hours;

    // Update the minute span
    var minuteSlot = document.getElementById('minute-slot');
    minuteSlot.textContent = time.minutes;

    // Update the second span
    var secondSlot = document.getElementById('second-slot');
    secondSlot.textContent = time.seconds;
    
    // Update AM/PM indicator
    var indicatorSlot = document.getElementById('indicator');
    indicatorSlot.textContent = cMode === 0 ? time.indicator : "";
    
    // Update the document title because why not
    document.title = `Time: ${time.hours}:${time.minutes}:${time.seconds} ${cMode === 0 ? time.indicator : ""}`
}

// Run immediately, then start the interval
updateTime();

setInterval(function() {
    updateTime();
    updatePageDuration();
}, 250);
