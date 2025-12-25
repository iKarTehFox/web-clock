import { match } from 'ts-pattern';
import { createBsModal, logConsole } from '../utils/dom-utils';
import i18next from 'i18next';
import { menu } from './dom-elements';
import { once } from '../system/event-bus';

// Hardcoded values. Change as needed.
export const versionNumber = '1.8.2';
export const versionNumberString = `v${versionNumber}`;
const releaseNotes = `https://github.com/iKarTehFox/web-clock/releases/tag/${versionNumber}`;

interface UpdateNotificationOptions {
  bypassCheck?: boolean;
  customTitle?: string;
  customDescription?: string;
  customReleaseUrl?: string;
  modalTimeout?: number;
}

function showWelcomeModal() {
    const welcomeTitle = i18next.t('bsmodal.welcome.title');
    
    // Create description element
    const descriptionElement = document.createElement('div');
    descriptionElement.innerHTML = `
        <p>${i18next.t('bsmodal.welcome.description')}</p>
        <p>${i18next.t('bsmodal.welcome.help')}</p>
    `;
    
    logConsole('Showing welcome modal for new user', 'debug', true);
    
    // Show the welcome modal
    createBsModal({
        title: welcomeTitle,
        content: descriptionElement,
        buttons: [
            {label: i18next.t('bsmodal.button.gethelp'), className: 'btn btn-info', value: 'help'},
            {label: 'GitHub', className: 'btn btn-secondary', value: 'github'},
            {label: i18next.t('bsmodal.button.getstarted'), className: 'btn btn-primary', value: 'get-started'}
        ],
        timeoutDelay: 60
    }).then((result) => {
        match(result)
            .with('help', () => {
                // Open OWC docs
                window.open('https://online-clock-docs.pages.dev', '_blank');
            })
            .with('github', () => {
                // Open GitHub
                window.open('https://github.com/iKarTehFox/web-clock', '_blank');
            })
            .otherwise(() => {
                // Get Started or dismissed modal
            });
    });
    
    // Set the localStorage item so they won't see this welcome modal again
    localStorage.setItem('lastUpdateNotification', versionNumber);
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
  
    // Check if user is new (no localStorage item or empty)
    if (!bypassCheck && (!lastSeen || lastSeen === '')) {
        showWelcomeModal();
        return;
    }
    
    // Version check for existing users
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
    createBsModal({
        title: customTitle,
        content: descriptionElement,
        buttons: bypassCheck ? 
            [
                {label: i18next.t('bsmodal.button.releasenotes'), className: 'btn btn-primary', value: 'release-note'}
            ] : 
            [
                {label: i18next.t('bsmodal.button.dontshowagain'), className: 'btn btn-secondary', value: 'never-show'}, 
                {label: i18next.t('bsmodal.button.releasenotes'), className: 'btn btn-primary', value: 'release-note'}
            ],
        timeoutDelay: modalTimeout
    }).then((result) => {
        match(result)
            .with('release-note', () => {
                window.open(customReleaseUrl, '_blank');
            })
            .with('never-show', () => {
                localStorage.setItem('lastUpdateNotification', 'never');
            });
    });
}

once('domLoaded', () => {
    menu.versionlabelclk.textContent = versionNumberString;
    logConsole(`Updated version label to ${versionNumberString}`, 'debug');
});
