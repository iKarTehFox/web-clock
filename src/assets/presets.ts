// Presets (JSON) Imports
import './onlinewebclock-amoled-preset.json';
import './onlinewebclock-devfavorite-preset.json';
import './onlinewebclock-digitsbinary-preset.json';
import './onlinewebclock-minimallight-preset.json';
import './onlinewebclock-preset.json';
import './onlinewebclock-defaults.json';

// Debug Testing Presets
import './debug-version-error.json';
import './debug-invalid-error.json';
import './debug-incomp-error.json';
import './debug-missing-error.json';
import './debug-unexpected-error.json';

export interface PresetInfo {
    filename: string;
    displayName: string;
    description?: string;
    hotkey?: number;
}

// Preset hotkey definitions
export const presetList: PresetInfo[] = [
    {
        filename: 'onlinewebclock-amoled-preset',
        displayName: 'AMOLED Theme',
        description: 'Save yourself from burn-in with this preset!',
        hotkey: 1
    },
    {
        filename: 'onlinewebclock-digitsbinary-preset',
        displayName: 'Hacker Green',
        description: 'Become a hacker with this green, digital binary clock! kinda...',
        hotkey: 2
    },
    {
        filename: 'onlinewebclock-minimallight-preset',
        displayName: 'Minimalist Light',
        description: 'Go minimal with this simple, black on white theme!',
        hotkey: 3
    },
    {
        filename: 'onlinewebclock-devfavorite-preset',
        displayName: 'Simple blue',
        description: 'A personal favorite from iKarTehFox... me! :)',
        hotkey: 4
    },
    {
        filename: 'onlinewebclock-preset',
        displayName: 'Red clouds',
        description: 'The example clock configuration shown in the GitHub README. Shows how extensively the clock can be customized!',
        hotkey: 5
    }
];

export function getPresetByHotkey(key: number): PresetInfo | undefined {
    return presetList.find(preset => preset.hotkey === key);
}
