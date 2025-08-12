import { match } from 'ts-pattern';
import { menu, debug, dtdisplay, doc } from './utils/dom-elements';
import { logConsole, setMetaColor } from './utils/dom-utils';

let fadeIntervalID: NodeJS.Timeout;
const bodyElement = document.body;

export function startColorFade() {
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

    // Initial color update
    bodyElement.style.backgroundColor = colors[colorNames[currentIndex]];

    const fadetime = menu.fadetransrange.value; // Get fade transition length value when restarted
    bodyElement.style.transition = `background-color ${fadetime}s ease-in-out`;
    menu.colorbadge.textContent = colors[colorNames[currentIndex]]; // Initial color badge update

    fadeIntervalID = setInterval(() => {
        currentIndex = (currentIndex + 1) % colorNames.length;
        const currentColor = colors[colorNames[currentIndex]];
        bodyElement.style.backgroundColor = currentColor;
        menu.colorbadge.textContent = currentColor;
        setMetaColor('color', currentColor);
        logConsole(`Fade background color to: ${currentColor}`, 'debug');
    }, 3000);
}

export function stopColorFade() {
    clearInterval(fadeIntervalID);
    setMetaColor('color', '#FFFFFF'); // Reset to white
    logConsole('Color fade stopped', 'info');
}

// Color mode listener
menu.colormodeselect.addEventListener('change', () => {
    // Reset color to "black" first
    dtdisplay.ccontainer.style.color = '#212529';
    dtdisplay.timeBar.style.backgroundColor = '#212529';
    doc.cnote.style.color = '#212529';
    const colorMode = menu.colormodeselect.value;
        
    match(colorMode)
        .with('fademode', () => {
            startColorFade();
            logConsole(`Color mode set to: ${colorMode}`, 'debug');
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
            menu.colorbadgelabel.classList.remove('d-none');
            menu.fadegroup.classList.remove('d-none');
            menu.presetgroup.classList.add('d-none');
            debug.devcolorscontainer.classList.add('d-none');
            menu.textcolorgroup.classList.add('d-none');
            menu.imagegroup.classList.add('d-none');
        })
        .with('solidmode', () => {
            stopColorFade();
            logConsole(`Color mode set to: ${colorMode}`, 'debug');
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
            menu.colorbadgelabel.classList.remove('d-none');
            menu.fadegroup.classList.remove('d-none');
            menu.presetgroup.classList.remove('d-none');
            debug.devcolorscontainer.classList.remove('d-none');
            menu.textcolorgroup.classList.remove('d-none');
            menu.imagegroup.classList.add('d-none');
        })
        .with('imgmode', () => {
            stopColorFade();
            logConsole(`Color mode set to: ${colorMode}`, 'debug');
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
            menu.colorbadgelabel.classList.add('d-none');
            menu.fadegroup.classList.add('d-none');
            menu.presetgroup.classList.add('d-none');
            debug.devcolorscontainer.classList.add('d-none');
            menu.textcolorgroup.classList.remove('d-none');
            menu.imagegroup.classList.remove('d-none');
        })
        .otherwise(() => {
            logConsole('Invalid color mode selected', 'error');
        });
});

// Fade transition range listener
menu.fadetransrange.addEventListener('input', () => {
    const value = menu.fadetransrange.value;
    bodyElement.style.transition = `background-color ${value}s ease-in-out`;
    menu.fadetransrangelabel.textContent = value + 's';
    logConsole(`Fade transition length set to: ${value}s`, 'debug');
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
        setMetaColor('color', selectedColor);
        logConsole(`Preset color changed to: ${selectedColor}`, 'debug');
    });
});

startColorFade();
