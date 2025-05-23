import { match } from 'ts-pattern';
import { createBsModal, logConsole } from '../utils/dom-utils';
import i18next from 'i18next';
import { menu } from './dom-elements';

// Hardcoded values. Change as needed.
export const versionNumber = '1.7.1';
export const versionNumberString = `v${versionNumber}`;
const releaseNotes = `https://github.com/iKarTehFox/web-clock/releases/tag/${versionNumber}`;

interface UpdateNotificationOptions {
  bypassCheck?: boolean;
  customTitle?: string;
  customDescription?: string;
  customReleaseUrl?: string;
  modalTimeout?: number;
}

export function showUpdateNotification(options: UpdateNotificationOptions = {}) {
    const {
        bypassCheck = false,
        customTitle = i18next.t('bsmodal.updatenoti.newversion', {0: versionNumberString}),
        customDescription,
        customReleaseUrl = releaseNotes,
        modalTimeout = 30
    } = options;
  
    const lastSeen = localStorage.getItem('lastUpdateNotification');
  
    // Version check
    if (!bypassCheck && (lastSeen === 'never' || lastSeen === versionNumber)) return;

    if (!bypassCheck) {
        localStorage.setItem('lastUpdateNotification', versionNumber);
    }
  
    // Create description element
    const descriptionElement = document.createElement('p');
    descriptionElement.innerHTML = customDescription || 
    i18next.t('bsmodal.updatenoti.releasenote', {0: versionNumberString});
  
    logConsole(`Showing update notification for version ${versionNumber}`, 'debug', true);
  
    // Show the modal
    createBsModal(
        customTitle, 
        descriptionElement, 
        bypassCheck ? 
            [
                {label: i18next.t('bsmodal.button.releasenotes'), className: 'btn btn-primary', value: 'release-note'}
            ] : 
            [
                {label: i18next.t('bsmodal.button.dontshowagain'), className: 'btn btn-secondary', value: 'never-show'}, 
                {label: i18next.t('bsmodal.button.releasenotes'), className: 'btn btn-primary', value: 'release-note'}
            ], 
        modalTimeout
    ).then((result) => {
        match(result)
            .with('release-note', () => {
                window.open(customReleaseUrl, '_blank');
            })
            .with('never-show', () => {
                localStorage.setItem('lastUpdateNotification', 'never');
            });
    });
}

window.addEventListener('DOMContentLoaded', () => {
    menu.versionlabelclk.textContent = versionNumberString;
    logConsole(`Updated version label to ${versionNumberString}`, 'debug', true);
});
