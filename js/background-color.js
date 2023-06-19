let colorFadeInterval;

function startColorFade() {
  const colors = ['#FFC0CB', '#FFD700', '#7FFFD4', '#FFA500', '#9370DB', '#00FFFF'];
  let currentIndex = 0;
  const bodyElement = document.body;

  bodyElement.style.backgroundColor = colors[currentIndex];
  bodyElement.style.transition = 'background-color 2.8s ease-in-out';

  colorFadeInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % colors.length;
    bodyElement.style.backgroundColor = colors[currentIndex];
    menu.colorbadge.textContent = colors[currentIndex];
  }, 3000);
}

function stopColorFade() {
  clearInterval(colorFadeInterval);
}

function handleModeSelection() {
  dtdisplay.clock.style.color = "#212529";

  if (menu.faderad.checked) {
    startColorFade();
    menu.presetcolors.forEach((btn) => {
      btn.disabled = true;
      btn.checked = false;
    });
  } else if (menu.solidrad.checked) {
    stopColorFade();
    menu.presetcolors.forEach((btn) => {
      btn.disabled = false;
    });
  }
}

menu.faderad.addEventListener('change', handleModeSelection);
menu.solidrad.addEventListener('change', handleModeSelection);

menu.presetcolors.forEach((btn) => {
  btn.addEventListener('click', () => {
    const selectedColor = btn.getAttribute('data-color');
    document.body.style.backgroundColor = selectedColor;
    menu.colorbadge.textContent = selectedColor;
  });
});

startColorFade();
