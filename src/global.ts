import { match } from 'ts-pattern';
import { menu, font, dtdisplay, stopwatch, countdown, doc, panel } from './utils/dom-elements';
import { logConsole, setMenuTheme, showToast } from './utils/dom-utils';
import { showUpdateNotification, versionNumberString } from './utils/update-notify';
import i18next from 'i18next';

// Define font sizes
export type FontSizeKey = '6vw' | '8vw' | '10vw' | '12vw' | '14vw' | '18vw';

const fontSizeOptions: Record<FontSizeKey, string> = {
    '6vw': '1.09vw',
    '8vw': '1.45vw',
    '10vw': '1.82vw',
    '12vw': '2.18vw',
    '14vw': '2.55vw',
    '18vw': '3.27vw'
};

// Font style handler function
function modifyFontStyle(type: string, value: string) {
    const fontSize = value as FontSizeKey;
    match(type)
        .with('style', () => {
            dtdisplay.ccontainer.style.fontStyle = value;
            doc.cnote.style.fontStyle = value;
            stopwatch.display.style.fontStyle = value;
            countdown.display.style.fontStyle = value;
            logConsole(`Font style set to: ${value}`, 'debug');
        })
        .with('weight', () => {
            dtdisplay.ccontainer.style.fontWeight = value;
            stopwatch.display.style.fontWeight = value;
            countdown.display.style.fontWeight = value;
            logConsole(`Font weight set to: ${value}`, 'debug');
        })
        .with('size', () => {
            if (fontSize in fontSizeOptions) {
                dtdisplay.ccontainer.style.fontSize = value;
                dtdisplay.indicatorSlot.style.fontSize = fontSizeOptions[fontSize];
                dtdisplay.date.style.fontSize = fontSizeOptions[fontSize];
                logConsole(`Font sizing set to: ${value}`, 'debug');
            } else {
                logConsole(`Invalid font size: ${value}`, 'error');
            }
        })
        .with('family', () => {
            dtdisplay.ccontainer.style.fontFamily = value;
            doc.cnote.style.fontFamily = value;
            countdown.display.style.fontFamily = value;
            logConsole(`Font family set to: ${value}`, 'debug');
        })
        .with('strokewidth', () => {
            dtdisplay.ccontainer.style.webkitTextStrokeWidth = `${value}px`;
            font.strokerangelabel.textContent = value + 'px';
            logConsole(`Font stroke width set to: ${value}px`, 'debug');
        })
        .with('strokecolor', () => {
            dtdisplay.ccontainer.style.webkitTextStrokeColor = value;
            font.strokecolorlabel.textContent = value;
            logConsole(`Font stroke color set to: ${value}`, 'debug');
        })
        .otherwise(() => {
            logConsole(`Invalid font modification type: ${type}`, 'error');
        });
}

panel.section.fc.addEventListener('change', handleFontEvents);
panel.section.fc.addEventListener('input', handleFontEvents);
panel.section.fc.addEventListener('click', handleFontEvents);

function handleFontEvents(e: Event) {
    const target = e.target as HTMLElement;
    
    match(target.tagName)
        .with('SELECT', () => {
            const selectElement = target as HTMLSelectElement;
            match(selectElement.id)
                .with('fontFamilySelect', () => {
                    modifyFontStyle('family', selectElement.value);
                    font.customfontinput.value = '';
                })
                .with('sizeSelect', () => {
                    modifyFontStyle('size', selectElement.value);
                })
                .otherwise(() => {});
        })
        .with('INPUT', () => {
            const inputElement = target as HTMLInputElement;
            match([inputElement.type, inputElement.name || inputElement.id])
                .with(['radio', 'font-style-radio'], () => {
                    modifyFontStyle('style', String(inputElement.dataset.value));
                })
                .with(['radio', 'font-weight-radio'], () => {
                    modifyFontStyle('weight', String(inputElement.dataset.value));
                })
                .with(['range', 'dropShadowRange'], () => {
                    const value = Number(inputElement.value);
                    const opacity = value / 5;
                    const strength = value * 3;
                    const dropShadowValue = `5px 5px ${strength}px rgba(0, 0, 0, ${opacity})`;
                    font.shadowlabel.textContent = strength + 'px';
                    dtdisplay.ccontainer.style.textShadow = value > 0 ? dropShadowValue : '';
                    logConsole(`Font text shadow set to: ${dropShadowValue}`, 'debug');
                })
                .with(['range', 'textStrokeRange'], () => {
                    const size = inputElement.value;
                    font.strokecolor.disabled = parseInt(size) <= 0;
                    modifyFontStyle('strokewidth', size);
                })
                .with(['color', 'textStrokeColor'], () => {
                    modifyFontStyle('strokecolor', inputElement.value);
                })
                .otherwise(() => {});
        })
        .with('BUTTON', () => {
            const buttonElement = target as HTMLButtonElement;
            match(buttonElement.id)
                .with('applyCustomFontButton', () => {
                    const customFont = font.customfontinput.value;
                    if (customFont.length > 0) {
                        font.familysel.value = '';
                        modifyFontStyle('family', customFont);
                    }
                })
                .otherwise(() => {});
        })
        .otherwise(() => {});
}

// Border type listener
menu.bordertyperadio.forEach((radio) => {
    radio.addEventListener('change', () => {
        const value = radio.dataset.value ?? '';
        menu.borderstyleselect.disabled = value === 'none';

        match(value)
            .with('none', () => {
                menu.timebarselect.disabled = false;
                dtdisplay.tcontainer.style.borderStyle = value;
                dtdisplay.tcontainer.style.borderBottomStyle = value;
                logConsole(`Border type set to: ${value}`, 'debug');
            })
            .with('regular', () => {
                menu.timebarselect.disabled = true;
                menu.timebarselect.value = 'tbarNone';
                menu.timebarselect.dispatchEvent(new Event('change'));
                dtdisplay.tcontainer.style.borderBottomStyle = 'none';
                dtdisplay.tcontainer.style.borderStyle = menu.borderstyleselect.value;
                logConsole(`Border type set to: ${value}`, 'debug');
            })
            .with('bottom', () => {
                menu.timebarselect.disabled = true;
                menu.timebarselect.value = 'tbarNone';
                menu.timebarselect.dispatchEvent(new Event('change'));
                dtdisplay.tcontainer.style.borderStyle = 'none';
                dtdisplay.tcontainer.style.borderBottomStyle = menu.borderstyleselect.value;
                logConsole(`Border type set to: ${value}`, 'debug');
            })
            .otherwise(() => {
                logConsole(`Invalid border type: ${value}`, 'error');
            });
    });
});

// Border style listener
menu.borderstyleselect.addEventListener('change', () => {
    const value = menu.borderstyleselect.value;
    if (menu.bordertyperadio[1].checked) {
        dtdisplay.tcontainer.style.borderStyle = value;
        logConsole(`Border style set to: ${value}`, 'debug');
    } else if (menu.bordertyperadio[2].checked) {
        dtdisplay.tcontainer.style.borderBottomStyle = value;
        logConsole(`Border style set to: ${value}`, 'debug');
    }
});

// Menu theme listener
menu.themeselect.addEventListener('change', () => {
    match(menu.themeselect.value)
        .with('lightthememode', () => {
            setMenuTheme('light');
        })
        .with('darkthememode', () => {
            setMenuTheme('dark');
        })
        .with('midnightthememode', () => {
            setMenuTheme('midnight');
        })
        .with('amoledthememode', () => {
            setMenuTheme('amoled');
        })
        .otherwise(() => {
            logConsole(`Invalid theme mode: ${menu.themeselect.value}`, 'error');
        });
});

// Menu button visibility on double click
document.addEventListener('dblclick', function(e) {
    const target = e.target as HTMLElement;
    const isMenuRelated = menu.container.contains(target) || 
                          panel.menubutton.contains(target);

    if (!isMenuRelated) {
        menu.panelvischeckbox.checked = true;
        menu.panelvischeckbox.dispatchEvent(new Event('change'));
    }
});

// Fullscreen function
export function toggleFullscreen() {
    const element = document.documentElement as HTMLElement & {
        mozRequestFullScreen?: () => Promise<void>;
        webkitRequestFullscreen?: (input?: any) => Promise<void>;
        msRequestFullscreen?: () => Promise<void>;
    };

    if (!document.fullscreenElement && !(document as any).mozFullScreenElement && !(document as any).webkitFullscreenElement && !(document as any).msFullscreenElement) {
        // Enter fullscreen mode
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) { // Mozilla Firefox
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { // Internet Explorer and Edge
            element.msRequestFullscreen();
        }
    } else {
        // Exit fullscreen mode
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
            (document as any).mozCancelFullScreen();
        } else if ((document as any).webkitExitFullscreen) {
            (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
            (document as any).msExitFullscreen();
        }
    }
    logConsole('Toggled fullscreen mode', 'info');
    showToast({
        title: i18next.t('toasts.global.title'),
        icon: 'bi-fullscreen',
        message: i18next.t('toasts.global.fullscreen'),
        duration: 'veryshort'
    });
}

// FS button listener
menu.fullscreenbtn.addEventListener('click', function() {
    toggleFullscreen();
});

// Custom note stuff
menu.cnoteinput.oninput = () => {
    const text = menu.cnoteinput.value;
    doc.cnote.textContent = text;
    doc.cnote.style.whiteSpace = 'pre-wrap';
};

menu.cnotealignradio.forEach(radio => {
    radio.addEventListener('change', () => {
        const align = radio.dataset.value;
        match(align)
            .with('top', () => {
                doc.cnote.style.bottom = '';
                doc.cnote.style.top = '20px';
                logConsole('Set note alignment to top', 'info');
            })
            .with('bottom', () => {
                doc.cnote.style.top = '';
                doc.cnote.style.bottom = '20px';
                logConsole('Set note alignment to bottom', 'info');
            })
            .otherwise(() => {});
    });
});

// Auto-hide mouse functionality
const idleTimeout = 10000;
let idleTimer: NodeJS.Timeout;
let isDebouncing: boolean = false;

menu.mousehidecheckbox.addEventListener('change', () => {
    if (!menu.mousehidecheckbox.checked) {
        clearTimeout(idleTimer);
        doc.blurpanel.classList.remove('hide-cursor');
        dtdisplay.ccontainer.classList.remove('hide-cursor');
        logConsole('Mouse auto-hide disabled', 'info');
    }
});

doc.self.addEventListener('mousemove', () => {
    if (!menu.mousehidecheckbox.checked || isDebouncing) return;

    clearTimeout(idleTimer);

    doc.blurpanel.classList.remove('hide-cursor');
    dtdisplay.ccontainer.classList.remove('hide-cursor');
    idleTimer = setTimeout(() => {
        doc.blurpanel.classList.add('hide-cursor');
        dtdisplay.ccontainer.classList.add('hide-cursor');
        isDebouncing = true;

        setTimeout(() => {
            isDebouncing = false;
        }, 300); // Don't immediately show cursor again
    }, idleTimeout);
});

// Panel vis toggle
menu.panelvischeckbox.addEventListener('change', () => {
    panel.container.classList.toggle('d-none', !menu.panelvischeckbox.checked);
});

// Version label listener
menu.versionlabelclk.addEventListener('click', () => {
    showUpdateNotification({'bypassCheck': true, 'customTitle': `Online Web Clock - ${versionNumberString}`, 'customDescription': i18next.t('bsmodal.updatenoti.releasenotebypass', {0: versionNumberString}), 'modalTimeout': 0});
});
