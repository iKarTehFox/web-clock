function uploadBGImg() {
    const input = document.createElement('input');
    const bodyElement = document.body;
    input.type = 'file';
    input.accept = 'image/*';
    
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onload = function() {
            const imageUrl = reader.result;
            bodyElement.style.backgroundImage = `url('${imageUrl}')`;
        };
    });
    
    input.click();
}

menu.imagesizeselect.addEventListener('change', () => {
    const value = menu.imagesizeselect.value;
    const bodyElement = document.body;
    
    switch (value) {
    case 'auto':
        bodyElement.style.backgroundSize = value;
        break;
    case 'cover':
        bodyElement.style.backgroundSize = value;
        break;
    case 'stretch':
        bodyElement.style.backgroundSize = '100vw 100vh';
        break;
    default:
        console.error(`Unsupported background size value: ${value}`);
        break;
    }
});

menu.imageblurrange.addEventListener('input', () => {
    doc.blurpanel.style.backdropFilter = (`blur(${menu.imageblurrange.value}px)`);
    menu.imageblurlabel.textContent = `Image Blur: ${menu.imageblurrange.value}px`;
});