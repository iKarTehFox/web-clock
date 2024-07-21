import { menu, dtdisplay } from './global';
import { getFirstElement, logConsole } from './utils/dom-utils';

// Text color override listener
let tcoO = 0;
menu.textcoloroverrideradio.forEach((radio) => {
    radio.addEventListener('change', () => {
        if (radio.id === 'tcovD') {
            tcoO = 0;
            menu.textcolorinput.disabled = true;
            if (getFirstElement<HTMLInputElement>('input[name="color-mode-radio"]:checked').id === 'solidmode') {
                try {
                    getFirstElement<HTMLInputElement>('input[name="preset-color-radio"]:checked').dispatchEvent(new Event('change'));
                } catch (error) {
                    dtdisplay.ccontainer.style.color = '#212529';
                    dtdisplay.secondsBar.style.backgroundColor = '#212529';
                }
            }
            logConsole('Text color override disabled');
        } else {
            tcoO = 1;
            menu.textcolorinput.disabled = false;
            menu.textcolorinput.dispatchEvent(new Event('input'));
            logConsole('Text color override enabled');
        }
    });
});

menu.textcolorinput.addEventListener('input', function() {
    const color = menu.textcolorinput.value;
    dtdisplay.ccontainer.style.color = color;
    dtdisplay.secondsBar.style.backgroundColor = color;
    menu.textcolorlabel.textContent = `Text color: ${menu.textcolorinput.value}`;
    logConsole(`Text color override: ${color}`);
});

// Preset color buttons listener
menu.presetcolors.forEach((radio) => {
    radio.addEventListener('change', () => {
        const color = radio.dataset.color;
        // Determine the luminance of the background color
        const luminance = getLuminance(color as string);

        // Set the text color based on the background luminance
        if (luminance > 0.62 && tcoO === 0) {
            dtdisplay.ccontainer.style.color = '#212529'; // Set black text color
            dtdisplay.secondsBar.style.backgroundColor = '#212529';
        } else if (tcoO === 0) {
            dtdisplay.ccontainer.style.color = '#FFF'; // Set white text color
            dtdisplay.secondsBar.style.backgroundColor = '#FFF';
        }
    });
});

function getLuminance(color: string): number {
    // Assuming color is in RGB format, convert it to relative luminance
    const r = parseInt(color.substring(1, 3), 16) / 255;
    const g = parseInt(color.substring(3, 5), 16) / 255;
    const b = parseInt(color.substring(5, 7), 16) / 255;

    // Calculate the relative luminance using the sRGB color space formula
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    logConsole(`Luminance for ${color}: ${luminance}`);

    return luminance;
}