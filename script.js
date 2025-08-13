(function(){
  const slider = document.querySelector('.slider');
  const handle = document.getElementById('sliderHandle');
  const sliderText = document.getElementById('sliderText');
  let dragging = false, startX = 0, currentX = 0, sliderWidth = 0;
  const threshold = 0.75;

  function openGoogleMaps() {
    const address = document.getElementById('businessAddress').value.trim();
    const url = address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : 'https://www.google.com/maps';
    window.open(url, '_blank', 'noopener');
  }

  function updateHandlePosition(posX) {
    let maxLimit = sliderWidth - handle.offsetWidth - 8;
    if (posX < 0) posX = 0;
    if (posX > maxLimit) posX = maxLimit;
    handle.style.left = posX + 'px';
    let valueNow = Math.round((posX / maxLimit) * 100);
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
    slider.setAttribute('aria-valuenow', 0);
    sliderText.textContent = 'Deslice para abrir Google Maps';
    sliderText.classList.remove('disabled');
  }

  slider.addEventListener('mousedown', e => { dragging = true; sliderWidth = slider.offsetWidth; startX = e.clientX; currentX = parseInt(handle.style.left) || 4; });
  document.addEventListener('mouseup', e => { 
    if (!dragging) return; 
    dragging = false; 
    let maxLimit = sliderWidth - handle.offsetWidth - 8; 
    let leftPos = parseInt(handle.style.left) || 4; 
    if (leftPos >= maxLimit * threshold) { 
      updateHandlePosition(maxLimit); 
      openGoogleMaps(); 
      setTimeout(resetHandle, 700); 
    } else { 
      resetHandle(); 
    } 
  });
  document.addEventListener('mousemove', e => { if (!dragging) return; let deltaX = e.clientX - startX; updateHandlePosition(currentX + deltaX); });

  // Registro Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('Service Worker registrado'))
      .catch(err => console.error('Error SW:', err));
  }
})();
