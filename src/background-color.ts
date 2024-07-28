import { menu, dtdisplay } from './global';
import { logConsole } from './utils/dom-utils';

let fadeIntervalID: NodeJS.Timeout;
const bodyElement = document.body;

function startColorFade() {
    logConsole('Color fade started', 'info');
    const colors = {
        'Pink': '#FFC0CB',
        'Gold': '#FFD700',
        'Aquamarine': '#7FFFD4',
        'Web Orange': '#FFA500',
        'Dull Lavender': '#9370DB',
        'Cyan': '#00FFFF',
        'Deep Blush': '#E969B4',
        'Atlantis': '#8BCE25',
        'Turquoise': '#40E0D0',
        'Coral': '#FF7C4C',
        'Orchid': '#DA70D6',
        'Spring Green': '#00FA9A'
    };
    const colorNames = Object.keys(colors);
    let currentIndex = 0;

    bodyElement.style.backgroundColor = colors[colorNames[currentIndex]];
    const fadetime = menu.fadetransrange.value; // Get fade transition length value when restarted
    bodyElement.style.transition = `background-color ${fadetime}s ease-in-out`;
    menu.colorbadge.textContent = colors[colorNames[currentIndex]]; // Initial color badge update

    fadeIntervalID = setInterval(() => {
        currentIndex = (currentIndex + 1) % colorNames.length;
        const currentColor = colors[colorNames[currentIndex]];
        bodyElement.style.backgroundColor = currentColor;
        menu.colorbadge.textContent = currentColor;
        logConsole(`Fade background color to: ${currentColor}`, 'info');
    }, 3000);
}

export function stopColorFade() {
    clearInterval(fadeIntervalID);
    logConsole('Color fade stopped', 'info');
}

// Color mode listener
menu.colormoderadio.forEach(radio => {
    radio.addEventListener('change', () => {
        // Reset color to "black" first
        dtdisplay.ccontainer.style.color = '#212529';
        dtdisplay.secondsBar.style.backgroundColor = '#212529';
        const colorMode = radio.id;
        
        if (colorMode === 'fademode') {
            startColorFade();
            logConsole(`Color mode set to: ${colorMode}`, 'info');
            menu.presetcolors.forEach((radio) => {
                radio.disabled = true;
                radio.checked = false;
            });
            menu.textcoloroverrideradio.forEach((radio) => {
                radio.disabled = true;
                if (radio.id === 'tcovD') {
                    radio.checked = true;
                    radio.dispatchEvent(new Event('change'));
                }
            });
            menu.imageuploadbutton.disabled = true;
            menu.imagesizeselect.disabled = true;
            bodyElement.style.backgroundImage = '';
            // Set groups display
            menu.colorbadgelabel.style.display = 'block';
            menu.fadegroup.style.display = 'block';
            menu.presetgroup.style.display = 'none';
            menu.textcolorgroup.style.display = 'none';
            menu.imagegroup.style.display = 'none';
        } else if (colorMode === 'solidmode') {
            stopColorFade();
            logConsole(`Color mode set to: ${colorMode}`, 'info');
            menu.presetcolors.forEach((radio) => {
                radio.disabled = false;
            });
            menu.textcoloroverrideradio.forEach((radio) => {
                radio.disabled = false;
            });
            menu.imageuploadbutton.disabled = true;
            menu.imagesizeselect.disabled = true;
            bodyElement.style.backgroundImage = '';
            // Set groups display
            menu.colorbadgelabel.style.display = 'block';
            menu.fadegroup.style.display = 'block';
            menu.presetgroup.style.display = '';
            menu.textcolorgroup.style.display = '';
            menu.imagegroup.style.display = 'none';
        } else if (colorMode === 'imgmode') {
            stopColorFade();
            logConsole(`Color mode set to: ${colorMode}`, 'info');
            menu.presetcolors.forEach((radio) => {
                radio.disabled = true;
                radio.checked = false;
            });
            // Reset background color to black
            document.body.style.backgroundColor = '#000000';
            menu.colorbadge.textContent = '#000000'; // Just for looks. Will appear when switching back to solidmode.
            menu.textcoloroverrideradio.forEach((radio) => {
                if (radio.id === 'tcovO') {
                    radio.disabled = false;
                    radio.checked = true;
                    radio.dispatchEvent(new Event('change'));
                } else {
                    radio.disabled = true;
                }
            });
            menu.imageuploadbutton.disabled = false;
            menu.imagesizeselect.disabled = false;
            // Set groups display
            menu.colorbadgelabel.style.display = 'none';
            menu.fadegroup.style.display = 'none';
            menu.presetgroup.style.display = 'none';
            menu.textcolorgroup.style.display = '';
            menu.imagegroup.style.display = '';
        }
    });
});

// Fade transition range listener
menu.fadetransrange.addEventListener('input', () => {
    const value = menu.fadetransrange.value;
    bodyElement.style.transition = `background-color ${value}s ease-in-out`;
    menu.fadetransrangelabel.textContent = `Length: ${value}s`;
    logConsole(`Fade transition length set to: ${value}s`, 'info');
});

// Fade length reset button listener
menu.faderesetbutton.addEventListener('click', () => {
    menu.fadetransrange.value = '2.8';
    menu.fadetransrange.dispatchEvent(new Event('input'));
});

// Add listeners to all preset color buttons
menu.presetcolors.forEach((radio) => {
    radio.addEventListener('change', () => {
        const selectedColor = String(radio.getAttribute('data-color'));
        bodyElement.style.backgroundColor = selectedColor;
        menu.colorbadge.textContent = selectedColor;
        logConsole(`Preset color changed to: ${selectedColor}`, 'info');
    });
});

// Start color fade on page load
startColorFade();
