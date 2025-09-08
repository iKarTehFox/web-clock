import i18next from 'i18next';
import { logConsole } from '../../utils/dom-utils';

// Translations
import enResource from './en';
import esResource from './es';
import { menu } from '../../utils/dom-elements';
import { Tooltip } from 'bootstrap';
import { Settings } from 'ts-luxon';
import { emit } from '../../system/event-bus';

// Get language
function getBrowserLanguage(): string {
    const browserLang = navigator.language || (navigator as any).userLanguage;
    // Extract the base language code (e.g., 'en' from 'en-US')
    const baseLanguage = browserLang.split('-')[0];
    logConsole(`Detected browser language: ${browserLang}, using: ${baseLanguage}`, 'debug', true);
    return baseLanguage;
};

// Language map
const supportedLangs = ['en', 'es'];

// Get init lang
const getInitialLanguage = (): string => {
    const browserLang = getBrowserLanguage();
    menu.languageradio.forEach(radio => {
        if (radio.id === browserLang.toLowerCase()) {
            radio.checked = true;
        } else {
            radio.checked = false;
        }
    });
    return supportedLangs.includes(browserLang) ? browserLang : 'en';
};

// Helper function to get a nested property from an object using a dot-notation string
function getFallbackTranslation(obj: any, path: string): string | undefined {
    return path.split('.').reduce((prev, curr) => {
        return prev && prev[curr] ? prev[curr] : undefined;
    }, obj);
}

// Function to apply fallback translations directly without i18next
export function applyFallbackTranslations() {
    // Text content
    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.getAttribute('data-i18n') || '';
        // Directly get translation
        let translation = getFallbackTranslation(enResource, key);
        if (translation) {
            element.textContent = translation;
        } else {
            // Last resort if translation is not found
            element.textContent = key;
            logConsole(`Missing fallback translation for key: ${key}`, 'error');
        }
    });

    // Inner HTML
    document.querySelectorAll('[data-i18n-html]').forEach((element) => {
        const key = element.getAttribute('data-i18n-html') || '';
        // Directly get translation
        let translation = getFallbackTranslation(enResource, key);
        if (translation) {
            element.innerHTML = translation;
        } else {
            // Last resort if translation is not found
            element.innerHTML = key;
            logConsole(`Missing fallback translation for key: ${key}`, 'error');
        }
    });

    // Handle other attributes
    document.querySelectorAll('[data-i18n-label], [data-i18n-placeholder], [data-i18n-bs-title], [data-i18n-aria-label], [data-i18n-value]').forEach((element) => {
        Array.from(element.attributes)
            // Ensure again that the attribute starts with 'data-i18n-'
            .filter(attr => attr.name.startsWith('data-i18n-'))
            .forEach(attr => {
                // Extract the target attribute name
                const targetAttr = attr.name.substring('data-i18n-'.length);
                const key = attr.value;
                // Get fallback translation
                let translation = getFallbackTranslation(enResource, key);
                if (translation) {
                    // Update the attribute value
                    element.setAttribute(targetAttr, translation);
                } else {
                    // Last resort if translation is not found
                    element.setAttribute(targetAttr, key.split('.').pop() || targetAttr);
                    logConsole(`Missing fallback translation for key: ${key}`, 'error');
                }
            });
    });
}

i18next.init({
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    debug: false,
    resources: {
        en: {
            translation: enResource
        },
        es: {
            translation: esResource
        }
    }
}, (err, t) => {
    if (err) {
        console.error('i18next initialization error:', err);
        applyFallbackTranslations();
        return;
    }
});

function updateContent() {
    // Text content
    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.getAttribute('data-i18n') || '';
        const translation = i18next.t(key);
        //logConsole(`Updating ${key} with value: ${translation}`, 'debug', true);
        
        if (translation === key) {
            console.warn(`Translation missing for key: ${key}`);
        }

        element.textContent = translation;
    });

    // Inner HTML
    document.querySelectorAll('[data-i18n-html]').forEach((element) => {
        const key = element.getAttribute('data-i18n-html') || '';
        const translation = i18next.t(key);
        //logConsole(`Updating ${key} with value: ${translation}`, 'debug', true);

        if (translation === key) {
            console.warn(`Translation missing for key: ${key}`);
        }

        element.innerHTML = translation;
    });

    // Handle other attributes
    document.querySelectorAll('[data-i18n-label], [data-i18n-placeholder], [data-i18n-data-bs-title], [data-i18n-aria-label], [data-i18n-value]').forEach((element) => {
        Array.from(element.attributes)
            // Ensure again that the attribute starts with 'data-i18n-'
            .filter(attr => attr.name.startsWith('data-i18n-'))
            .forEach(attr => {
                // Extract the target attribute name
                const targetAttr = attr.name.substring('data-i18n-'.length);
                const key = attr.value;
                // Update the attribute value
                //logConsole(`Updating attribute ${targetAttr} with key ${key} value ${i18next.t(key)}`, 'debug');
                element.setAttribute(targetAttr, i18next.t(key));
            });
    });

    // Reinitialize Bootstrap tooltips
    const tooltipTriggerList = (document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipTriggerElArray = Array.from(tooltipTriggerList);
    const tooltipList = tooltipTriggerElArray.map(tooltipTriggerEl => {
        return new Tooltip(tooltipTriggerEl); 
    });

    emit('i18nFinishedUpdate', { language: i18next.language });
}

// Export function to manually update translations
export function updateTranslations() {
    updateContent();
}

i18next.on('languageChanged', (lng) => {
    console.log(`Language changed to: ${lng}`);
    Settings.defaultLocale = lng;
    menu.languageradio.forEach((radio) => {
        const id = radio.id;
        if (id === lng) {
            radio.checked = true;
        } else {
            radio.checked = false;
        }
    });
});

menu.languageradio.forEach((radio) => {
    radio.addEventListener('change', () => {
        const selectedLanguage = radio.id;
        i18n.changeLanguage(selectedLanguage).catch(error => {
            logConsole(`Failed to change language: ${error}`, 'error');
        });
    });
});

// Export i18n interface methods
export const i18n = {
    getCurrentLanguage: () => i18next.language,
    getSupportedLanguages: () => supportedLangs,
    changeLanguage: (langCode: string) => {
        if (!supportedLangs.includes(langCode)) {
            throw new Error(`Unsupported language: ${langCode}. Supported languages: ${supportedLangs.join(', ')}`);
        }
    
        return i18next.changeLanguage(langCode).then(() => {
        // Update translations
            updateTranslations();
        
            logConsole(`Language changed to ${langCode}`, 'info');
        });
    },
    translate: (key: string, options?: any) => i18next.t(key, options),
    isReady: () => i18next.isInitialized
};

// Default export
export default i18n;
