luxon.Settings.defaultZoneName = 'system';

// Define time slots
const hourSlot = document.getElementById('hour-slot');
const minuteSlot = document.getElementById('minute-slot');
const scolon = document.getElementById('colon2');
const secondSlot = document.getElementById('second-slot');
const indicatorSlot = document.getElementById('indicator');
var dateFormat = 'D';

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

function setSecondsVis(vis) {
    if (vis === 0) {
        scolon.style.display = 'none';
        secondSlot.style.display = 'none';
    } else {
        scolon.style.display = '';
        secondSlot.style.display = '';
    }
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

// Date format selector listener
menu.dateformselect.addEventListener("change", function() {
  dateFormat = menu.dateformselect.value;
  updateDate();
});

// Get and set time with luxon
function updateTime() {
    // Retrieve now time
    var time = luxon.DateTime.now();
    time = time.setZone(luxon.Settings.defaultZoneName);
    var hrs = cMode == 0 ? time.toFormat('h') : time.toFormat('HH');
    var min = time.toFormat('mm');
    var sec = time.toFormat('ss');
    var ind = cMode == 0 ? time.toFormat('a') : '';
    
    // Set html slots
    hourSlot.textContent = hrs;
    minuteSlot.textContent = min;
    secondSlot.textContent = sec;
    indicatorSlot.textContent = ind;
    
    // Update document title and favicon icon
    document.title = `Time: ${hrs}:${min}:${sec} ${ind}`
    updateFavicon(time.toFormat('h'));
    
    // Update current Date and selector setup
    
}

function updateDate() {
    var time = luxon.DateTime.now();
    dtdisplay.date.innerHTML = time.toFormat(dateFormat);
    document.getElementById('dateVisOp1').textContent = time.toFormat(document.getElementById('dateVisOp1').value);
    document.getElementById('dateVisOp2').textContent = time.toFormat(document.getElementById('dateVisOp2').value);
    document.getElementById('dateVisOp3').textContent = time.toFormat(document.getElementById('dateVisOp3').value);
    document.getElementById('dateVisOp4').textContent = time.toFormat(document.getElementById('dateVisOp4').value);
}

// Change tab favicon function
function updateFavicon(hour) {
  var faviconLink = document.getElementById('favicon');
  faviconLink.href = `./icons/clock-time-${hour}.svg`;
}

// Update on load, then start interval
updateTime();
updateDate();

setInterval(function() {
    updateTime();
    updatePageDuration();
}, 250);

setInterval(function() {
    updateDate();
}, 60000);