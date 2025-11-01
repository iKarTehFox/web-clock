// Built-in presets
import './owc-amoled-preset.json';
import './owc-devfavorite-preset.json';
import './owc-digitsbinary-preset.json';
import './owc-minimallight-preset.json';
import './owc-preset.json';
import './owc-defaults.json';

// Debugging presets
import './debug-version-error.json';
import './debug-invalid-error.json';
import './debug-incomp-error.json';
import './debug-missing-error.json';
import './debug-unexpected-error.json';

export interface PresetInfo {
    filename: string;
    alias?: string[]; // Alternative filenames
    displayName: string;
    description?: string;
    hotkey?: number;
}

// Preset hotkey definitions
export const presetList: PresetInfo[] = [
    {
        filename: 'owc-amoled-preset',
        alias: ['onlinewebclock-amoled-preset', 'amoled-preset', 'amoled', 'oled'],
        displayName: 'AMOLED Theme',
        description: 'Save yourself from burn-in with this preset!',
        hotkey: 1
    },
    {
        filename: 'owc-digitsbinary-preset',
        alias: ['onlinewebclock-digitsbinary-preset', 'digitsbinary-preset', 'binary', 'hacker', 'hacker-green'],
        displayName: 'Hacker Green',
        description: 'Become a hacker with this green, digital binary clock! kinda...',
        hotkey: 2
    },
    {
        filename: 'owc-minimallight-preset',
        alias: ['onlinewebclock-minimallight-preset', 'minimallight-preset', 'minimallight', 'minimal-light'],
        displayName: 'Minimalist Light',
        description: 'Go minimal with this simple, black on white theme!',
        hotkey: 3
    },
    {
        filename: 'owc-devfavorite-preset',
        alias: ['onlinewebclock-devfavorite-preset', 'devfavorite-preset', 'devfavorite', 'simple-blue'],
        displayName: 'Simple blue',
        description: 'A personal favorite from iKarTehFox... me! :)',
        hotkey: 4
    },
    {
        filename: 'owc-preset',
        alias: ['onlinewebclock-preset', 'red-clouds'],
        displayName: 'Red clouds',
        description: 'The example clock configuration shown in the GitHub README. Shows how extensively the clock can be customized!',
        hotkey: 5
    }
];

export function getPresetByHotkey(key: number): PresetInfo | undefined {
    return presetList.find(preset => preset.hotkey === key);
}
