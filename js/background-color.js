let fadeIntervalID;

function startColorFade() {
    const colors = ['#FFC0CB', '#FFD700', '#7FFFD4', '#FFA500', '#9370DB', '#00FFFF'];
    let currentIndex = 0;
    const bodyElement = document.body;

    bodyElement.style.backgroundColor = colors[currentIndex];
    bodyElement.style.transition = 'background-color 2.8s ease-in-out';

    fadeIntervalID = setInterval(() => {
        currentIndex = (currentIndex + 1) % colors.length;
        bodyElement.style.backgroundColor = colors[currentIndex];
        menu.colorbadge.textContent = colors[currentIndex];
    }, 3000);
}

function stopColorFade() {
    clearInterval(fadeIntervalID);
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
        const selectedColor = radio.getAttribute('data-color');
        document.body.style.backgroundColor = selectedColor;
        menu.colorbadge.textContent = selectedColor;
    });
});

// Start color fade on page load
startColorFade();
