// This file sets the debug mode. debugMode can be globally accessed.
export let debugMode: boolean = false;

export function setDebug(value: boolean): void {
    debugMode = value;
    console.log(`Debug mode is now ${value ? 'on' : 'off'}.`);
}