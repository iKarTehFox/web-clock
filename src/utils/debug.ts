import { AppEvents, emit } from '../system/event-bus';

// This file sets global debug flags. Flags must be exported and imported from this file.
export let debugMode: boolean = false;
export let timeRefresh: number = 100;
export let lockSettings: boolean = false;
export let isDevConInit: boolean = false;

export function setDebug(value: boolean): void {
    debugMode = value;
    console.warn(`Debug mode is now ${value ? 'on' : 'off'}.`);
    emit(AppEvents.DEBUG_MODE_ENABLED, { state: value });
}

export function setTimeRefresh(value: number): void {
    timeRefresh = value;
    console.log(`Time refresh delay set to ${value}ms.`);
}

export function setLockSettings(value: boolean): void {
    lockSettings = value;
    console.log(`Lock settings is now ${value ? 'on' : 'off'}.`);
}

export function setDevConInit(value: boolean): void {
    isDevConInit = value;
}