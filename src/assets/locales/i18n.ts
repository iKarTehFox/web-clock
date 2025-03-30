import i18next from 'i18next';
import { logConsole } from '../../utils/dom-utils';

// Translations
import enResource from './en';
import { font, menu } from '../../utils/dom-elements';

// Get language
function getBrowserLanguage(): string {
    const browserLang = navigator.language || (navigator as any).userLanguage;
    // Extract the base language code (e.g., 'en' from 'en-US')
    const baseLanguage = browserLang.split('-')[0];
    logConsole(`Detected browser language: ${browserLang}, using: ${baseLanguage}`, 'debug', true);
    return baseLanguage;
};

// Language map
const supportedLangs = ['en'];

// Get init lang
const getInitialLanguage = (): string => {
    const browserLang = getBrowserLanguage();
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
    document.querySelectorAll('[data-i18n-label], [data-i18n-placeholder], [data-i18n-bs-title]').forEach((element) => {
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
        logConsole(`Updating ${key} with value: ${translation}`, 'debug', true);
        
        if (translation === key) {
            console.warn(`Translation missing for key: ${key}`);
        }

        element.textContent = translation;
    });

    // Inner HTML
    document.querySelectorAll('[data-i18n-html]').forEach((element) => {
        const key = element.getAttribute('data-i18n-html') || '';
        const translation = i18next.t(key);
        logConsole(`Updating ${key} with value: ${translation}`, 'debug', true);

        if (translation === key) {
            console.warn(`Translation missing for key: ${key}`);
        }

        element.innerHTML = translation;
    });

    // Handle other attributes
    document.querySelectorAll('[data-i18n-label], [data-i18n-placeholder], [data-i18n-data-bs-title], [data-i18n-aria-label]').forEach((element) => {
        Array.from(element.attributes)
            // Ensure again that the attribute starts with 'data-i18n-'
            .filter(attr => attr.name.startsWith('data-i18n-'))
            .forEach(attr => {
                // Extract the target attribute name
                const targetAttr = attr.name.substring('data-i18n-'.length);
                const key = attr.value;
                // Update the attribute value
                logConsole(`Updating attribute ${targetAttr} with key ${key} value ${i18next.t(key)}`, 'debug');
                element.setAttribute(targetAttr, i18next.t(key));
            });
    });
}

export function initDynamicTranslations() {
    // Set default values for interpolated strings
    const defaultValues = {
        'dropShadow': '0',
        'strokeWidth': '0',
        'strokeColor': '#000000',
        'textColor': '#000000',
        'imageBlur': '0'
    };

    // Update the content
    font.shadowlabel.textContent = i18next.t('menu.section.fontcustomization.setting.texteffects.option.dropshadow', { 0: defaultValues.dropShadow });
    font.strokerangelabel.textContent = i18next.t('menu.section.fontcustomization.setting.texteffects.option.strokeradius', { 0: defaultValues.strokeWidth });
    font.strokecolorlabel.textContent = i18next.t('menu.section.fontcustomization.setting.texteffects.option.strokecolor', { 0: defaultValues.strokeColor });
    menu.textcolorlabel.textContent = i18next.t('menu.section.backgroundtheme.setting.textcoloroverride.option.textcolor', { 0: defaultValues.textColor });
    menu.imageblurlabel.textContent = i18next.t('menu.section.backgroundtheme.setting.imageeffects.option.imageblur', { 0: defaultValues.imageBlur });
}

// Export function to manually update translations
export function updateTranslations() {
    updateContent();
}
