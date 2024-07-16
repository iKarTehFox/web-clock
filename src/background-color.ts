import { menu, dtdisplay } from './global';
import { logDebug } from './utils/dom-utils';

let fadeIntervalID: NodeJS.Timeout;
const bodyElement = document.body;

function startColorFade() {
    logDebug('Color fade started');
    const colors = [
        '#FFC0CB', // Pink
        '#FFD700', // Gold
        '#7FFFD4', // Aquamarine
        '#FFA500', // Web Orange
        '#9370DB', // Dull Lavender
        '#00FFFF', // Cyan
        '#E969B4', // Deep Blush
        '#8BCE25', // Atlantis
        '#40E0D0', // Turquoise
        '#FF7C4C', // Coral
        '#DA70D6', // Orchid
        '#00FA9A'];// Spring Green
    let currentIndex = 0;

    bodyElement.style.backgroundColor = colors[currentIndex];
    const fadetime = menu.fadetransrange.value; // Get fade transition length value when restarted
    bodyElement.style.transition = `background-color ${fadetime}s ease-in-out`;
    menu.colorbadge.textContent = colors[currentIndex]; // Initial color badge update

    fadeIntervalID = setInterval(() => {
        currentIndex = (currentIndex + 1) % colors.length;
        bodyElement.style.backgroundColor = colors[currentIndex];
        menu.colorbadge.textContent = colors[currentIndex];
        logDebug(`Fade background color to: ${colors[currentIndex]}`);
    }, 3000);
}

export function stopColorFade() {
    clearInterval(fadeIntervalID);
    logDebug('Color fade stopped');
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
            logDebug(`Color mode set to: ${colorMode}`);
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
            menu.fadegroup.style.display = 'block';
            menu.presetgroup.style.display = 'none';
            menu.textcolorgroup.style.display = 'none';
            menu.imagegroup.style.display = 'none';
        } else if (colorMode === 'solidmode') {
            stopColorFade();
            logDebug(`Color mode set to: ${colorMode}`);
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
            menu.fadegroup.style.display = 'block';
            menu.presetgroup.style.display = '';
            menu.textcolorgroup.style.display = '';
            menu.imagegroup.style.display = 'none';
        } else if (colorMode === 'imgmode') {
            stopColorFade();
            logDebug(`Color mode set to: ${colorMode}`);
            menu.presetcolors.forEach((radio) => {
                radio.disabled = true;
                radio.checked = false;
            });
            // Reset background color to black
            document.body.style.backgroundColor = '#000000';
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
    logDebug(`Fade transition length set to: ${value}s`);
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
        logDebug(`Preset color changed to: ${selectedColor}`);
    });
});

// Start color fade on page load
startColorFade();
