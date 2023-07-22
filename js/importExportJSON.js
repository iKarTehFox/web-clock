function getSolidColorValue() {
  const checkedColorInput = document.querySelector('input[name="solid-color-radio"]:checked');
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
            clockMode: cMode,
            clockDisplay: menu.timeMethodSelect.value,
            secondsVis: document.querySelector('input[name="seconds-vis-radio"]:checked').id,
            dateFormat: menu.dateformselect.value,
            dateAlign: document.querySelector('input[name="date-position-radio"]:checked').id,
            borderMode: document.querySelector('input[name="border-type-radio"]:checked').id,
            borderStyle: menu.borderstyleselect.value
        },
        fontConfig: {
            fontFamily: font.selector.value,
            fontStyle: document.querySelector('input[name="font-style-radio"]:checked').id,
            fontWeight: document.querySelector('input[name="font-weight-radio"]:checked').id,
            fontSize: font.sizesel.value,
            dropShadow: font.shadowrange.value
        },
        colorTheme: {
            colorMode: document.querySelector('input[name="color-mode-radio"]:checked').id,
            solidColor: (document.querySelector('input[name="color-mode-radio"]:checked').id) == 'solidmode' ? getSolidColorValue() : ''
        },
        exportTimestamp: timeExported
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
  cMode = clockConfig.clockMode;
  menu.timeMethodSelect.value = clockConfig.clockDisplay;
  document.querySelector(`input[name="seconds-vis-radio"][id="${clockConfig.secondsVis}"]`).checked = true;
  menu.dateformselect.value = clockConfig.dateFormat;
  document.querySelector(`input[name="date-position-radio"][id="${clockConfig.dateAlign}"]`).checked = true;
  document.querySelector(`input[name="border-type-radio"][id="${clockConfig.borderMode}"]`).checked = true;
  menu.borderstyleselect.value = clockConfig.borderStyle;

  // Update fontConfig settings
  const fontConfig = importedSettings.fontConfig;
  font.selector.value = fontConfig.fontFamily;
  document.querySelector(`input[name="font-style-radio"][id="${fontConfig.fontStyle}"]`).checked = true;
  document.querySelector(`input[name="font-weight-radio"][id="${fontConfig.fontWeight}"]`).checked = true;
  font.sizesel.value = fontConfig.fontSize;
  font.shadowrange.value = fontConfig.dropShadow;

  // Update colorTheme settings
  const colorTheme = importedSettings.colorTheme;
  document.querySelector(`input[name="color-mode-radio"][id="${colorTheme.colorMode}"]`).checked = true;
  if (colorTheme.colorMode === 'solidmode') {
    document.querySelector(`input[name="solid-color-radio"][data-color="${colorTheme.solidColor}"]`).checked = true;
  }
  
  // Trigger change events for updated elements
  menu.timeMethodSelect.dispatchEvent(new Event('change'));
  document.querySelector(`input[name="seconds-vis-radio"][id="${clockConfig.secondsVis}"]`).dispatchEvent(new Event('change'));
  menu.dateformselect.dispatchEvent(new Event('change'));
  document.querySelector(`input[name="date-position-radio"][id="${clockConfig.dateAlign}"]`).dispatchEvent(new Event('change'));
  document.querySelector(`input[name="border-type-radio"][id="${clockConfig.borderMode}"]`).dispatchEvent(new Event('change'));
  menu.borderstyleselect.dispatchEvent(new Event('change'));

  font.selector.dispatchEvent(new Event('change'));
  document.querySelector(`input[name="font-style-radio"][id="${fontConfig.fontStyle}"]`).dispatchEvent(new Event('change'));
  document.querySelector(`input[name="font-weight-radio"][id="${fontConfig.fontWeight}"]`).dispatchEvent(new Event('change'));
  font.sizesel.dispatchEvent(new Event('change'));
  font.shadowrange.dispatchEvent(new Event('input'));

  document.querySelector(`input[name="color-mode-radio"][id="${colorTheme.colorMode}"]`).dispatchEvent(new Event('change'));
  if (colorTheme.colorMode === 'solidmode') {
    document.querySelector('input[name="solid-color-radio"]:checked').dispatchEvent(new Event('change'));
  }
}

// Value constraints
const validCM = [0, 1];
const validCD = ['binary','octal','decimal','hexa','emoji','roman','words'];
const validSV = ['secOn','secOff'];
const validDF = ['D','DD','DDD','DDDD',''];
const validDA = ['dateleft','datecenter','dateright'];
const validBM = ['bordertypedisabled','bordertyperegular','bordertypebottom'];
const validBS = ['solid','dashed','dotted','double'];
const validFF = ['','Lato','Montserrat','Open Sans','Oswald','Poppins','Roboto','Tektur','Ubuntu','Ubuntu Mono','Dancing Script','Merriweather','Nanum Brush Script','Pangolin'];
const validFS = ['regularStyle','italicStyle'];
const validFW = ['lightWeight','normalWeight','boldWeight'];
const validFZ = ['smaller','small','default','large','larger'];
const validDS = ['0', '1', '2', '3', '4'];
const validCMo = ['fademode','solidmode'];
const validSC = ['','#FF0000','#FFA500','#FFFF00','#00FF00','#0000FF','#FF00FF','#FF00FF','#000000','#808080','#F2B5D4','#C2E0E9','#E1D5E7','#B0E0E6','#F7D5AA','#D5E8D4','#92A8D1','#E6AF75','#D9B5A5','#9AC1B7','#D0B9C3','#C4B7D9','#D72C6F','#227FBF','#7E3F9D','#367F89','#FF713F','#549F55','#2B4771','#C55324','#954A3E','#457E70','#8B2C5A','#7C5793'];

function containsValue(array, value) {
  return array.includes(value);
}

function verifySettingsJSON(jsonData) {
  const requiredKeys = ["clockConfig", "fontConfig", "colorTheme"];
  
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

  return true;
}
