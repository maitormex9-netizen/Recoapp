document.addEventListener('DOMContentLoaded', function () {
  const slider = document.querySelector('.slider');
  const handle = document.getElementById('sliderHandle');
  const sliderText = document.getElementById('sliderText');

  let dragging = false;
  let startX = 0;
  let currentX = 0;
  const threshold = 0.75; // 75%

  function openGoogleMaps() {
    const addressInput = document.getElementById('businessAddress');
    const address = addressInput ? addressInput.value.trim() : '';
    const url = address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
      : 'https://www.google.com/maps';
    window.open(url, '_blank', 'noopener');
  }

  function maxLimit() {
    // 8px ≈ margen interno que ya usas (4px izq + 4px der)
    return slider.offsetWidth - handle.offsetWidth - 8;
  }

  function updateHandlePosition(posX) {
    const max = maxLimit();
    let x = Math.max(0, Math.min(posX, max));
    handle.style.left = x + 'px';

    const valueNow = max > 0 ? Math.round((x / max) * 100) : 0;
    slider.setAttribute('aria-valuenow', valueNow);

    if (valueNow >= threshold * 100) {
      sliderText.textContent = 'Deslizado completamente';
      sliderText.classList.add('disabled');
    } else {
      sliderText.textContent = 'Deslice para abrir Google Maps';
      sliderText.classList.remove('disabled');
    }
  }

  function resetHandle() {
    handle.style.left = '4px';
    slider.setAttribute('aria-valuenow', '0');
    sliderText.textContent = 'Deslice para abrir Google Maps';
    sliderText.classList.remove('disabled');
  }

  function pointerDown(clientX) {
    dragging = true;
    startX = clientX;
    currentX = parseInt(handle.style.left, 10) || 4;
  }

  function pointerMove(clientX) {
    if (!dragging) return;
    const deltaX = clientX - startX;
    updateHandlePosition(currentX + deltaX);
  }

  function pointerUp() {
    if (!dragging) return;
    dragging = false;
    const max = maxLimit();
    const leftPos = parseInt(handle.style.left, 10) || 4;

    if (leftPos >= max * threshold) {
      updateHandlePosition(max);
      openGoogleMaps();
      setTimeout(resetHandle, 700);
    } else {
      resetHandle();
    }
  }

  // mouse (desktop)
  slider.addEventListener('mousedown', (e) => {
    e.preventDefault();
    pointerDown(e.clientX);
  });
  document.addEventListener('mousemove', (e) => pointerMove(e.clientX));
  document.addEventListener('mouseup', pointerUp);

  // touch (móvil)
  slider.addEventListener('touchstart', (e) => {
    pointerDown(e.touches[0].clientX);
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    // Evita que la página haga scroll mientras arrastras
    e.preventDefault();
    pointerMove(e.touches[0].clientX);
  }, { passive: false });

  document.addEventListener('touchend', pointerUp, { passive: true });
  document.addEventListener('touchcancel', pointerUp, { passive: true });

  // Accesibilidad por teclado
  slider.addEventListener('keydown', (e) => {
    const max = maxLimit();
    const curLeft = parseInt(handle.style.left, 10) || 4;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      updateHandlePosition(Math.min(curLeft + 15, max));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      updateHandlePosition(Math.max(curLeft - 15, 0));
    } else if (e.key === 'End') {
      e.preventDefault();
      updateHandlePosition(max);
      openGoogleMaps();
      setTimeout(resetHandle, 700);
    } else if (e.key === 'Home') {
      e.preventDefault();
      resetHandle();
    }
  });
});
