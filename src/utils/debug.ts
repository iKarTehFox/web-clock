// This file sets global debug flags. Constants must be exported and imported from this file.
export let debugMode: boolean = false;
export let localStorageTesting: boolean = false;
export let timeRefresh: number = 250;

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