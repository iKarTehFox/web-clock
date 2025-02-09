// This file sets global debug flags. Flags must be exported and imported from this file.
export let debugMode: boolean = false;
export let localStorageTesting: boolean = false;
export let timeRefresh: number = 250;
export let lockSettings: boolean = false;

export function setDebug(value: boolean): void {
    debugMode = value;
    console.log(`Debug mode is now ${value ? 'on' : 'off'}.`);
}

export function setTimeRefresh(value: number): void {
    timeRefresh = value;
    console.log(`Time refresh delay set to ${value}ms.`);
}

export function setLocalStorageTesting(value: boolean): void {
    localStorageTesting = value;
    console.log(`LocalStorage testing is now ${value ? 'on' : 'off'}.`);
}

export function setLockSettings(value: boolean): void {
    lockSettings = value;
    console.log(`Lock settings is now ${value ? 'on' : 'off'}.`);
}