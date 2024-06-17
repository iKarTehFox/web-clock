import { menu } from '../global';
import { presetLocalJSON } from '../importExport';

export function applyURLParams() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // Display settings
    // Debug logging mode
    if (urlParams.get('debug') === 'true') {
        menu.debugcheckbox.checked = true;
    }

    // Menu theme
    if (urlParams.get('darkMode') === 'true') {
        menu.themeradio[1].checked = true;
        menu.themeradio[1].dispatchEvent(new Event('change'));
    }

    // Menu visibility
    if (urlParams.get('menuVis') === 'false') {
        menu.menubuttonvischeckbox.checked = false;
        menu.menubuttonvischeckbox.dispatchEvent(new Event('change'));
    }

    // Tab title
    if (urlParams.get('tabTitle') === 'false') {
        menu.titlevischeckbox.checked = false;
        menu.titlevischeckbox.dispatchEvent(new Event('change'));
    }

    // Presets
    if (urlParams.get('preset') !== null) {
        const preset = urlParams.get('preset') as string;
        switch (preset) {
        case 'usdonlineclock-amoled-preset':
            presetLocalJSON(preset, false);
            break;
        case 'usdonlineclock-digitsbinary-preset':
            presetLocalJSON(preset, false);
            break;
        case 'usdonlineclock-minimallight-preset':
            presetLocalJSON(preset, false);
            break;
        case 'usdonlineclock-devfavorite-preset':
            presetLocalJSON(preset, false);
            break;
        default:
            console.error(`ERROR - Invalid preset in URL parameters: ${preset}`);
            alert('Invalid preset in URL parameters. Please check the URL parameters and try again.');
            break;
        }
    }
}
