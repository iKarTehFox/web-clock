import { doc, menu } from './global';
import { logConsole } from './utils/dom-utils';

export function uploadBGImg() {
    const input = document.createElement('input');
    const bodyElement = document.body;
    input.type = 'file';
    input.accept = 'image/*';
    
    input.addEventListener('change', (e) => {
        // Asserting e.target as HTMLInputElement
        const target = e.target as HTMLInputElement;
        
        if (target && target.files && target.files.length > 0) {
            const file = target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            
            reader.onload = function() {
                // Ensure the result is treated as a string
                const imageUrl = reader.result as string;
                bodyElement.style.backgroundImage = `url('${imageUrl}')`;
                logConsole('Background image set.', 'info');
            };
        } else {
            logConsole('No file selected or input element is missing.', 'error');
        }
    });
    
    input.click();
}

menu.imagesizeselect.addEventListener('change', () => {
    const value = menu.imagesizeselect.value;
    const bodyElement = document.body;
    
    switch (value) {
    case 'auto':
        bodyElement.style.backgroundSize = value;
        logConsole(`Image sizing set to: ${value}`, 'info');
        break;
    case 'cover':
        bodyElement.style.backgroundSize = value;
        logConsole(`Image sizing set to: ${value}`, 'info');
        break;
    case 'stretch':
        bodyElement.style.backgroundSize = '100vw 100vh';
        logConsole(`Image sizing set to: ${value}`, 'info');
        break;
    default:
        logConsole(`Unsupported background size value: ${value}`, 'error');
        break;
    }
});

menu.imageblurrange.addEventListener('input', () => {
    const blurValue = menu.imageblurrange.value;
    doc.blurpanel.style.backdropFilter = (`blur(${blurValue}px)`);
    menu.imageblurlabel.textContent = `Image Blur: ${blurValue}px`;
    logConsole(`Image blur set to: ${blurValue}px`, 'info');
});