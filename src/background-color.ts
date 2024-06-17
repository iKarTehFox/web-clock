import { menu, dtdisplay } from './global';

let fadeIntervalID: NodeJS.Timeout;

function startColorFade() {
    if (menu.debugcheckbox.checked) {console.log('DEBUG - Color fade started');}
    const colors = ['#FFC0CB', '#FFD700', '#7FFFD4', '#FFA500', '#9370DB', '#00FFFF'];
    let currentIndex = 0;
    const bodyElement = document.body;

    bodyElement.style.backgroundColor = colors[currentIndex];
    bodyElement.style.transition = 'background-color 2.8s ease-in-out';

    fadeIntervalID = setInterval(() => {
        currentIndex = (currentIndex + 1) % colors.length;
        bodyElement.style.backgroundColor = colors[currentIndex];
        menu.colorbadge.textContent = colors[currentIndex];
        if (menu.debugcheckbox.checked) {console.log(`DEBUG - Set background color to ${colors[currentIndex]}`);}
    }, 3000);
}

export function stopColorFade() {
    clearInterval(fadeIntervalID);
    if (menu.debugcheckbox.checked) {console.log('DEBUG - Color fade stopped');}
}

// Color mode listener
menu.colormoderadio.forEach(radio => {
    radio.addEventListener('change', () => {
        // Reset color to "black" first
        dtdisplay.ccontainer.style.color = '#212529';
        dtdisplay.secondsBar.style.backgroundColor = '#212529';
        const colorMode = radio.id;
        const bodyElement = document.body;
        
        if (colorMode === 'fademode') {
            startColorFade();
            if (menu.debugcheckbox.checked) {console.log(`DEBUG - Color mode set to ${colorMode}`);}
            menu.presetcolors.forEach((radio) => {
                radio.disabled = true;
                radio.checked = false;
            });
            menu.textcoloroverrideradio.forEach((radio) => {
                radio.disabled = true;
                if (radio.id === 'tcovD') {
                    radio.checked = true;
                    radio.dispatchEvent(new Event('change'));
                }
            });
            menu.imageuploadbutton.disabled = true;
            menu.imagesizeselect.disabled = true;
            bodyElement.style.backgroundImage = '';
            // Set groups display
            menu.presetgroup.style.display = 'none';
            menu.textcolorgroup.style.display = 'none';
            menu.imagegroup.style.display = 'none';
        } else if (colorMode === 'solidmode') {
            stopColorFade();
            if (menu.debugcheckbox.checked) {console.log(`DEBUG - Color mode set to ${colorMode}`);}
            menu.presetcolors.forEach((radio) => {
                radio.disabled = false;
            });
            menu.textcoloroverrideradio.forEach((radio) => {
                radio.disabled = false;
            });
            menu.imageuploadbutton.disabled = true;
            menu.imagesizeselect.disabled = true;
            bodyElement.style.backgroundImage = '';
            // Set groups display
            menu.presetgroup.style.display = '';
            menu.textcolorgroup.style.display = '';
            menu.imagegroup.style.display = 'none';
        } else if (colorMode === 'imgmode') {
            stopColorFade();
            if (menu.debugcheckbox.checked) {console.log(`DEBUG - Color mode set to ${colorMode}`);}
            menu.presetcolors.forEach((radio) => {
                radio.disabled = true;
                radio.checked = false;
            });
            // Reset background color to black
            document.body.style.backgroundColor = '#000000';
            menu.textcoloroverrideradio.forEach((radio) => {
                if (radio.id === 'tcovO') {
                    radio.disabled = false;
                    radio.checked = true;
                    radio.dispatchEvent(new Event('change'));
                } else {
                    radio.disabled = true;
                }
            });
            menu.imageuploadbutton.disabled = false;
            menu.imagesizeselect.disabled = false;
            // Set groups display
            menu.presetgroup.style.display = 'none';
            menu.textcolorgroup.style.display = '';
            menu.imagegroup.style.display = '';
        }
    });
});

// Add listeners to all preset color buttons
menu.presetcolors.forEach((radio) => {
    radio.addEventListener('change', () => {
        const selectedColor = String(radio.getAttribute('data-color'));
        document.body.style.backgroundColor = selectedColor;
        menu.colorbadge.textContent = selectedColor;
        if (menu.debugcheckbox.checked) {console.log(`DEBUG - Preset color changed to ${selectedColor}`);}
    });
});

// Start color fade on page load
startColorFade();
