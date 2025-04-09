import { match } from 'ts-pattern';
import { createBsModal, logConsole } from '../utils/dom-utils';

// Hardcoded values. Change as needed.
const versionNumber = '1.7.0';
const releaseNotes = `https://github.com/iKarTehFox/web-clock/releases/tag/${versionNumber}`;
const releaseDescription = document.createElement('p');
releaseDescription.innerHTML = `Online Web Clock was just updated to ${versionNumber}! Check the release notes for more information.`;

export function showUpdateNotification() {
    const lastSeen = localStorage.getItem('lastUpdateNotification');
    
    // Respect user choice
    if (lastSeen === 'never') return;

    if (lastSeen !== versionNumber) {
        localStorage.setItem('lastUpdateNotification', versionNumber);
        logConsole(`Showing update notification for version ${versionNumber}`, 'debug', true);
        createBsModal(`New Version! (${versionNumber})`, releaseDescription, [{label: 'Don\'t show again', className: 'btn btn-secondary', value: 'never-show'}, {label: 'Release notes', className: 'btn btn-primary', value: 'release-note'}], 15)
            .then((result) => {
                match(result)
                    .with('release-note', () => {
                        window.open(releaseNotes, '_blank');
                    })
                    .with('never-show', () => {
                        localStorage.setItem('lastUpdateNotification', 'never');
                    });
            });
    }
}