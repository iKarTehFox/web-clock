import { match } from 'ts-pattern';
import { menu, dtdisplay, doc } from './utils/dom-elements';
import { getFirstElement } from './utils/dom-selectors';
import { logConsole } from './utils/dom-utils';

// Text color override listener
let isTextColorOverride = 0;
menu.textcoloroverrideradio.forEach((radio) => {
    radio.addEventListener('change', () => {
        match(radio.id)
            .with('tcovD', () => {
                isTextColorOverride = 0;
                menu.textcolorinput.disabled = true;
                if (menu.colormodeselect.value === 'solidmode') {
                    // Use setTimeout to ensure preset colors have been updated first
                    setTimeout(() => {
                        try {
                            const checkedPresetColor = getFirstElement<HTMLInputElement>('input[name="preset-color-radio"]:checked');
                            if (checkedPresetColor && checkedPresetColor.dataset.color) {
                                // Trigger the preset color change to set appropriate text color
                                checkedPresetColor.dispatchEvent(new Event('change'));
                                logConsole(`Text color override disabled, restored to preset color: ${checkedPresetColor.dataset.color}`, 'debug');
                            } else {
                                throw new Error('No valid preset color found');
                            }
                        } catch (error) {
                            // Fallback: determine text color based on current background
                            const currentBgColor = getComputedStyle(document.body).backgroundColor;
                            logConsole(`No preset color selected, current background: ${currentBgColor}`, 'debug');
                            
                            if (currentBgColor === 'rgb(0, 0, 0)' || currentBgColor === '#000000') {
                                dtdisplay.ccontainer.style.color = '#FFFFFF';
                                dtdisplay.timeBar.style.backgroundColor = '#FFFFFF';
                                doc.cnote.style.color = '#FFFFFF';
                                logConsole('No preset color selected, defaulting to white text for black background', 'warning');
                            } else {
                                // For any other background, use smart color detection
                                const bgColorHex = rgbToHex(currentBgColor);
                                if (bgColorHex) {
                                    const luminance = getLuminance(bgColorHex);
                                    const textColor = luminance > 0.62 ? '#212529' : '#FFFFFF';
                                    dtdisplay.ccontainer.style.color = textColor;
                                    dtdisplay.timeBar.style.backgroundColor = textColor;
                                    doc.cnote.style.color = textColor;
                                    logConsole(`Smart text color for ${bgColorHex} (luminance: ${luminance}): ${textColor}`, 'debug');
                                } else {
                                    // Ultimate fallback
                                    dtdisplay.ccontainer.style.color = '#212529';
                                    dtdisplay.timeBar.style.backgroundColor = '#212529';
                                    doc.cnote.style.color = '#212529';
                                    logConsole('Could not determine background color, defaulting to black text', 'warning');
                                }
                            }
                        }
                    }, 0);
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

function rgbToHex(rgb: string): string {
    // Convert rgb(r, g, b) format to hex
    const rgbMatch = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    return rgb; // Return as-is if not rgb format
}