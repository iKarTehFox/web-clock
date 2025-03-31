import { match } from 'ts-pattern';
import { menu, dtdisplay, doc } from './utils/dom-elements';
import { getFirstElement, logConsole } from './utils/dom-utils';
import i18next from 'i18next';

// Text color override listener
let isTextColorOverride = 0;
menu.textcoloroverrideradio.forEach((radio) => {
    radio.addEventListener('change', () => {
        match(radio.id)
            .with('tcovD', () => {
                isTextColorOverride = 0;
                menu.textcolorinput.disabled = true;
                if (getFirstElement<HTMLInputElement>('input[name="color-mode-radio"]:checked').id === 'solidmode') {
                    try {
                        getFirstElement<HTMLInputElement>('input[name="preset-color-radio"]:checked').dispatchEvent(new Event('change'));
                    } catch (error) {
                    // Catch if none are selected (switching from imgmode to solidmode)
                        if (document.body.style.backgroundColor === 'rgb(0, 0, 0)') {
                            dtdisplay.ccontainer.style.color = '#FFFFFF';
                            dtdisplay.timeBar.style.backgroundColor = '#FFFFFF';
                            doc.cnote.style.color = '#FFFFFF';
                        } else {
                            dtdisplay.ccontainer.style.color = '#212529';
                            dtdisplay.timeBar.style.backgroundColor = '#212529';
                            doc.cnote.style.color = '#212529';
                        }
                    }
                }
                logConsole('Text color override disabled', 'info');
            })
            .otherwise(() => {
                isTextColorOverride = 1;
                menu.textcolorinput.disabled = false;
                menu.textcolorinput.dispatchEvent(new Event('input'));
                logConsole('Text color override enabled', 'info');
            });
    });
});

menu.textcolorinput.addEventListener('input', function() {
    const color = menu.textcolorinput.value;
    dtdisplay.ccontainer.style.color = color;
    dtdisplay.timeBar.style.backgroundColor = color;
    doc.cnote.style.color = color;
    menu.textcolorlabel.textContent = color;
    logConsole(`Text color override: ${color}`, 'debug');
});

// Preset color buttons listener
menu.presetcolors.forEach((radio) => {
    radio.addEventListener('change', () => {
        const color = radio.dataset.color;
        // Determine the luminance of the background color
        const luminance = getLuminance(color as string);

        // Set the text color based on the background luminance
        if (luminance > 0.62 && isTextColorOverride === 0) {
            dtdisplay.ccontainer.style.color = '#212529'; // Set black text color
            dtdisplay.timeBar.style.backgroundColor = '#212529';
            doc.cnote.style.color = '#212529';
        } else if (isTextColorOverride === 0) {
            dtdisplay.ccontainer.style.color = '#FFF'; // Set white text color
            dtdisplay.timeBar.style.backgroundColor = '#FFF';
            doc.cnote.style.color = '#FFF';
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
    logConsole(`Luminance for ${color}: ${luminance}`, 'debug');

    return luminance;
}