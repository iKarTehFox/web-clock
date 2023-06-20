var timezoneSelect = document.getElementById('timeZoneSelect');

// Group timezones by continents
var continents = {
  Africa: [],
  America: [],
  Asia: [],
  Europe: [],
  Pacific: []
};

// Populate the timezone groups
var timezones = Intl.supportedValuesOf('timeZone');
timezones.forEach(function(timezone) {
  if (timezone.includes('Africa')) {
    continents.Africa.push(timezone);
  } else if (timezone.includes('America')) {
    continents.America.push(timezone);
  } else if (timezone.includes('Asia')) {
    continents.Asia.push(timezone);
  } else if (timezone.includes('Europe')) {
    continents.Europe.push(timezone);
  } else if (timezone.includes('Pacific')) {
    continents.Pacific.push(timezone);
  }
});

// Create options for each timezone group
for (var continent in continents) {
  var continentOptGroup = document.createElement('optgroup');
  continentOptGroup.label = continent;

  continents[continent].forEach(function(timezone) {
    var option = document.createElement('option');
    option.value = timezone;
    
    var slashIndex = timezone.indexOf('/');
    if (slashIndex !== -1) {
      option.textContent = timezone.substring(slashIndex + 1); // Extract text after the slash
    } else {
      option.textContent = timezone; // Use the original timezone value if no slash is found
    }

    continentOptGroup.appendChild(option);
  });

  timezoneSelect.appendChild(continentOptGroup);
}

// Listen for the change event on the dropdown
timezoneSelect.addEventListener('change', function() {
  var selectedTimezone = timezoneSelect.value;
  luxon.Settings.defaultZoneName = selectedTimezone;
  updateTime(); // Replace with your function to update the time
});
