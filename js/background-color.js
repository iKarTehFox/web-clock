// Get the mode radio buttons
const fadeModeRadio = document.getElementById('fadeModeRadio');
const solidModeRadio = document.getElementById('solidModeRadio');

// Get the color fade interval ID
let colorFadeInterval;

// Function to start color fade
function startColorFade() {
  const colors = ['#FFC0CB', '#FFD700', '#7FFFD4', '#FFA500', '#9370DB', '#00FFFF'];
  let currentIndex = 0;

  const bodyElement = document.body;

  // Set initial color
  bodyElement.style.backgroundColor = colors[currentIndex];

  // Apply transition for smooth color fading
  bodyElement.style.transition = 'background-color 2.8s ease-in-out';

  colorFadeInterval = setInterval(() => {
    // Transition to the next color
    currentIndex = (currentIndex + 1) % colors.length;
    bodyElement.style.backgroundColor = colors[currentIndex];
  }, 3000);
}

// Function to stop color fade
function stopColorFade() {
  clearInterval(colorFadeInterval);
}

// Event listener for fade mode selection
fadeModeRadio.addEventListener('change', () => {
  var clockContainer = document.getElementById("clock-container");
  clockContainer.style.color = "#212529";
  if (fadeModeRadio.checked) {
    startColorFade();
    // Disable the solid color buttons
    document.querySelectorAll('.preset-color').forEach((btn) => {
      btn.disabled = true;
      btn.checked = false;
    });
  }
});

// Event listener for solid mode selection
solidModeRadio.addEventListener('change', () => {
  if (solidModeRadio.checked) {
    stopColorFade();
    // Enable the solid color buttons
    document.querySelectorAll('.preset-color').forEach((btn) => {
      btn.disabled = false;
    });
  }
});

document.querySelectorAll('.preset-color').forEach((btn) => {
  btn.addEventListener('click', () => {
    const selectedColor = btn.getAttribute('data-color');
    stopColorFade();
    document.body.style.backgroundColor = selectedColor;
  });
});

startColorFade();
