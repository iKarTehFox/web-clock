// This file sets the debug mode. debugMode can be globally accessed.
export let debugMode: boolean = false;
export let timeRefresh: number = 250;
export function setDebug(value: boolean): void {
    debugMode = value;
    console.log(`Debug mode is now ${value ? 'on' : 'off'}.`);
}

export function setTimeRefresh(value: number): void {
    timeRefresh = value;
    console.log(`Time refresh delay set to ${value}ms.`);
}