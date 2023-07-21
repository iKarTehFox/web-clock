luxon.Settings.defaultZoneName = 'system';

var dateFormat = 'D';
var timeDisplayMethod = 0;

// Page duration elements
var durationElement = document.getElementById("time-duration");
var pageLoadTime = new Date();

menu.timeMethodSelect.addEventListener('change', () => {
  // Get the selected value from the select element
  const selectedValue = menu.timeMethodSelect.value;

  // Update the timeDisplayMethod variable with the selected value
  timeDisplayMethod = selectedValue;

  // Update the time display using updateTime()
  updateTime();
});

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
        dtdisplay.colon2.style.display = 'none';
        dtdisplay.secondSlot.style.display = 'none';
    } else {
        dtdisplay.colon2.style.display = '';
        dtdisplay.secondSlot.style.display = '';
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

function updateTime() {
    var time = luxon.DateTime.now();
    time = time.setZone(luxon.Settings.defaultZoneName);
    var hrs = cMode == 0 ? time.toFormat('h') : time.toFormat('HH');
    var min = time.toFormat('mm');
    var sec = time.toFormat('ss');
    var ind = cMode == 0 ? time.toFormat('a') : '';
    
    document.title = `Time: ${hrs}:${min}:${sec} ${ind}`
    updateFavicon(time.toFormat('h'));
    
    // Time display methods
    if (timeDisplayMethod === "binary") {
        hrs = parseInt(hrs, 10).toString(2);
        min = parseInt(min, 10).toString(2);
        sec = parseInt(sec, 10).toString(2);
    } else if (timeDisplayMethod === "emoji") {
        hrs = convertToEmojiBlock(hrs);
        min = convertToEmojiBlock(min);
        sec = convertToEmojiBlock(sec);
    } else if (timeDisplayMethod === "roman") {
        hrs = convertToRomanNumerals(hrs);
        min = convertToRomanNumerals(min);
        sec = convertToRomanNumerals(sec);
    } else if (timeDisplayMethod === "hexa") {
        hrs = parseInt(hrs, 10).toString(16);
        min = parseInt(min, 10).toString(16);
        sec = parseInt(sec, 10).toString(16);
    } else if (timeDisplayMethod === "octal") {
        hrs = parseInt(hrs, 10).toString(8);
        min = parseInt(min, 10).toString(8);
        sec = parseInt(sec, 10).toString(8);
    } else if (timeDisplayMethod === "words") {
        hrs = numberToWords.toWords(hrs);
        min = min === '0' || min === '00' ? "o'clock" : parseInt(min, 10) < 10 ? `oh ${numberToWords.toWords(min)}` : numberToWords.toWords(min);

        sec = numberToWords.toWords(sec);
    }
    
    dtdisplay.hourSlot.textContent = hrs;
    dtdisplay.minuteSlot.textContent = min;
    dtdisplay.secondSlot.textContent = sec;
    dtdisplay.indicatorSlot.textContent = ind;
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

// Emoji block function
function convertToEmojiBlock(number) {
  const emojiBlocks = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
  const digits = number.toString().split('');
  const emojiDigits = digits.map((digit) => emojiBlocks[parseInt(digit, 10)]);
  return emojiDigits.join('');
}

// Roman numeral converter function
function convertToRomanNumerals(number) {
    if (isNaN(number))
        return NaN;
    if (number === 0 || number === '00')
        return number;
    var digits = String(+number).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
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