function getSolidColorValue() {
  const checkedColorInput = document.querySelector('input[name="preset-color-radio"]:checked');
  if (checkedColorInput) {
    const colorValue = checkedColorInput.dataset.color;
    return colorValue;
  } else {
      return '';
  }
}

function exportSettingsToJSON() {
    // Get time and set export timestamp
    var time = luxon.DateTime.now();
    const timeExported = time.toFormat('FFFF');
    
    // Get all settings
    const usersettings = {
        clockConfig: {
            clockMode: document.querySelector('input[name="clock-mode-radio"]:checked').id,
            clockDisplay: menu.timeMethodSelect.value,
            secondsVis: document.querySelector('input[name="seconds-vis-radio"]:checked').id,
            dateFormat: menu.dateformselect.value,
            dateAlign: document.querySelector('input[name="date-position-radio"]:checked').id,
            borderMode: document.querySelector('input[name="border-type-radio"]:checked').id,
            borderStyle: menu.borderstyleselect.value,
            secondsBarVis: document.querySelector('input[name="seconds-bar-radio"]:checked').id
        },
        fontConfig: {
            fontFamily: font.familysel.value,
            fontStyle: document.querySelector('input[name="font-style-radio"]:checked').id,
            fontWeight: document.querySelector('input[name="font-weight-radio"]:checked').id,
            fontSize: font.sizesel.value,
            dropShadow: font.shadowrange.value
        },
        displaySettings: {
            menuVisibility: menu.visCheckbox.checked
        },
        colorTheme: {
            colorMode: document.querySelector('input[name="color-mode-radio"]:checked').id,
            solidColor: (document.querySelector('input[name="color-mode-radio"]:checked').id) == 'solidmode' ? getSolidColorValue() : ''
        },
        exportTimestamp: timeExported,
        version: 2
    }
    
    const settingsJSON = JSON.stringify(usersettings);
    const blob = new Blob([settingsJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Initiate download
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `usdonlineclock-settings_${time.toFormat('X')}.json`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// Function to handle the import process
function importSettingsFromJSON() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';

  // Listen for changes in the input file selection
  input.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target.result);
        
        // File validation
        if (!verifySettingsJSON(importedSettings)) {
            alert('Error importing settings. Please check console for more info.');
            return;
        }
        
        updateClockSettings(importedSettings);
        console.log('Settings successfully loaded!')
        alert(`Settings successfully imported!\nFile timestamp: ${(importedSettings.exportTimestamp ? importedSettings.exportTimestamp : 'Unknown or missing timestamp')}`);
      } catch (error) {
        console.error('Error importing settings:', error);
        alert('Invalid settings file. Please make sure the file contains valid JSON.');
      }
    };
    
    reader.readAsText(file);
  });

  input.click();
}

function updateClockSettings(importedSettings) {
  // Update clockConfig settings
  const clockConfig = importedSettings.clockConfig;
  document.querySelector(`input[name="clock-mode-radio"][id="${clockConfig.clockMode}"]`).checked = true;
  menu.timeMethodSelect.value = clockConfig.clockDisplay;
  document.querySelector(`input[name="seconds-vis-radio"][id="${clockConfig.secondsVis}"]`).checked = true;
  menu.dateformselect.value = clockConfig.dateFormat;
  document.querySelector(`input[name="date-position-radio"][id="${clockConfig.dateAlign}"]`).checked = true;
  if (clockConfig.secondsBarVis === 'sbaN') {
    document.querySelector(`input[name="border-type-radio"][id="${clockConfig.borderMode}"]`).checked = true;
  }
  menu.borderstyleselect.value = clockConfig.borderStyle;
  if (clockConfig.borderMode === 'btyD') {
    document.querySelector(`input[name="seconds-bar-radio"][id="${clockConfig.secondsBarVis}"]`).checked = true;
  }

  // Update fontConfig settings
  const fontConfig = importedSettings.fontConfig;
  font.familysel.value = fontConfig.fontFamily;
  document.querySelector(`input[name="font-style-radio"][id="${fontConfig.fontStyle}"]`).checked = true;
  document.querySelector(`input[name="font-weight-radio"][id="${fontConfig.fontWeight}"]`).checked = true;
  font.sizesel.value = fontConfig.fontSize;
  font.shadowrange.value = fontConfig.dropShadow;

  // Update colorTheme settings
  const colorTheme = importedSettings.colorTheme;
  document.querySelector(`input[name="color-mode-radio"][id="${colorTheme.colorMode}"]`).checked = true;
  if (colorTheme.colorMode === 'solidmode') {
    document.querySelector(`input[name="preset-color-radio"][data-color="${colorTheme.solidColor}"]`).checked = true;
  }
  
  // Update displaySettings settings
  const displaySettings = importedSettings.displaySettings;
  menu.visCheckbox.checked = displaySettings.menuVisibility;
  
  // Trigger change events for updated elements
  document.querySelector(`input[name="clock-mode-radio"][id="${clockConfig.clockMode}"]`).dispatchEvent(new Event('change'));
  menu.timeMethodSelect.dispatchEvent(new Event('change'));
  document.querySelector(`input[name="seconds-vis-radio"][id="${clockConfig.secondsVis}"]`).dispatchEvent(new Event('change'));
  menu.dateformselect.dispatchEvent(new Event('change'));
  document.querySelector(`input[name="date-position-radio"][id="${clockConfig.dateAlign}"]`).dispatchEvent(new Event('change'));
  document.querySelector(`input[name="border-type-radio"][id="${clockConfig.borderMode}"]`).dispatchEvent(new Event('change'));
  menu.borderstyleselect.dispatchEvent(new Event('change'));
  document.querySelector(`input[name="seconds-bar-radio"][id="${clockConfig.secondsBarVis}"]`).dispatchEvent(new Event('change'));

  font.familysel.dispatchEvent(new Event('change'));
  document.querySelector(`input[name="font-style-radio"][id="${fontConfig.fontStyle}"]`).dispatchEvent(new Event('change'));
  document.querySelector(`input[name="font-weight-radio"][id="${fontConfig.fontWeight}"]`).dispatchEvent(new Event('change'));
  font.sizesel.dispatchEvent(new Event('change'));
  font.shadowrange.dispatchEvent(new Event('input'));

  document.querySelector(`input[name="color-mode-radio"][id="${colorTheme.colorMode}"]`).dispatchEvent(new Event('change'));
  if (colorTheme.colorMode === 'solidmode') {
    document.querySelector('input[name="preset-color-radio"]:checked').dispatchEvent(new Event('change'));
  }
}

// Value constraints
const validCM = ['cmo12','cmo24'];
const validCD = ['binary','octal','decimal','hexa','emoji','roman','words'];
const validSV = ['sviD','sviN'];
const validDF = ['D','DD','DDD','DDDD',''];
const validDA = ['dpoL','dpoC','dpoR'];
const validBM = ['btyD','btyR','btyB'];
const validBS = ['solid','dashed','dotted','double'];
const validSB = ['','sbaB','sbaN']
const validFF = ['','Lato','Montserrat','Open Sans','Oswald','Poppins','Roboto','Tektur','Ubuntu','Ubuntu Mono','Dancing Script','Merriweather','Nanum Brush Script','Pangolin'];
const validFS = ['fstR','fstI'];
const validFW = ['fweL','fweN','fweB'];
const validFZ = ['6vw','8vw','10vw','12vw','14vw','18vw'];
const validDS = ['0', '1', '2', '3', '4'];
const validCMo = ['fademode','solidmode'];
const validSC = ['','#FF0000','#FFA500','#FFFF00','#00FF00','#0000FF','#FF00FF','#FF00FF','#000000','#808080','#F2B5D4','#C2E0E9','#E1D5E7','#B0E0E6','#F7D5AA','#D5E8D4','#92A8D1','#E6AF75','#D9B5A5','#9AC1B7','#D0B9C3','#C4B7D9','#D72C6F','#227FBF','#7E3F9D','#367F89','#FF713F','#549F55','#2B4771','#C55324','#954A3E','#457E70','#8B2C5A','#7C5793'];
const validMV = ['true','false'];
const validVer = [2];

function containsValue(array, value) {
  return array.includes(value);
}

function verifySettingsJSON(jsonData) {
  const requiredKeys = ["clockConfig", "fontConfig", "colorTheme", "version"];
  
  // Check if all required keys are present in the JSON object
  const missingKeys = requiredKeys.filter(key => !(key in jsonData));
  if (missingKeys.length > 0) {
    console.error(`Missing required keys: ${missingKeys.join(", ")}`);
    return false;
  }

  // Perform validation for the "clockConfig" subkeys
  const clockConfig = jsonData.clockConfig;

  if (!containsValue(validCM, clockConfig.clockMode)) {
    console.error(`Invalid clockMode value: ${clockConfig.clockMode}`);
    return false;
  }

  if (!containsValue(validCD, clockConfig.clockDisplay)) {
    console.error(`Invalid clockDisplay value: ${clockConfig.clockDisplay}`);
    return false;
  }

  if (!containsValue(validSV, clockConfig.secondsVis)) {
    console.error(`Invalid secondsVis value: ${clockConfig.secondsVis}`);
    return false;
  }

  if (!containsValue(validDF, clockConfig.dateFormat)) {
    console.error(`Invalid dateFormat value: ${clockConfig.dateFormat}`);
    return false;
  }

  if (!containsValue(validDA, clockConfig.dateAlign)) {
    console.error(`Invalid dateAlign value: ${clockConfig.dateAlign}`);
    return false;
  }

  if (!containsValue(validBM, clockConfig.borderMode)) {
    console.error(`Invalid borderMode value: ${clockConfig.borderMode}`);
    return false;
  }

  if (!containsValue(validBS, clockConfig.borderStyle)) {
    console.error(`Invalid borderStyle value: ${clockConfig.borderStyle}`);
    return false;
  }
  
  if (!containsValue(validSB, clockConfig.secondsBarVis)) {
    console.error(`Invalid secondsBarVis value: ${clockConfig.secondsBarVis}`);
    return false;
  }
  
  if ((clockConfig.borderMode === 'btyB' || clockConfig.borderMode === 'btyR') && clockConfig.secondsBarVis === 'sbaB') {
      console.error(`Incompatible borderMode and secondsBarVis values: ${clockConfig.borderMode}, ${clockConfig.secondsBarVis}`);
      return false;
  }
  
  // Perform validation for the "fontConfig" subkeys
  const fontConfig = jsonData.fontConfig;

  if (!containsValue(validFF, fontConfig.fontFamily)) {
    console.error(`Invalid fontFamily value: ${fontConfig.fontFamily}`);
    return false;
  }

  if (!containsValue(validFS, fontConfig.fontStyle)) {
    console.error(`Invalid fontStyle value: ${fontConfig.fontStyle}`);
    return false;
  }

  if (!containsValue(validFW, fontConfig.fontWeight)) {
    console.error(`Invalid fontWeight value: ${fontConfig.fontWeight}`);
    return false;
  }

  if (!containsValue(validFZ, fontConfig.fontSize)) {
    console.error(`Invalid fontSize value: ${fontConfig.fontSize}`);
    return false;
  }

  if (!containsValue(validDS, fontConfig.dropShadow)) {
    console.error(`Invalid dropShadow value: ${fontConfig.dropShadow}`);
    return false;
  }

  // Perform validation for the "colorTheme" subkeys
  const colorTheme = jsonData.colorTheme;

  if (!containsValue(validCMo, colorTheme.colorMode)) {
    console.error(`Invalid colorMode value: ${colorTheme.colorMode}`);
    return false;
  }

  if (colorTheme.colorMode === 'solidmode' && !containsValue(validSC, colorTheme.solidColor)) {
    console.error(`Invalid solidColor value: ${colorTheme.solidColor}`);
    return false;
  }
  
  // Perform validation for the "version" key
  const version = jsonData.version;
  
  if (!containsValue(validVer, version)) {
    console.error(`Invalid version value: ${version}`);
    return false;
  }

  return true;
}
