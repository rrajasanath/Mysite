document.querySelectorAll('.sus').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.sus').forEach((item) => (item.style.borderColor = 'transparent'));
    button.style.borderColor = '#ff5f73';
  });
});

const readyBtn = document.querySelector('.ready');
if (readyBtn) {
  readyBtn.addEventListener('click', () => {
    readyBtn.textContent = readyBtn.textContent === 'Ready' ? 'Ready ✓' : 'Ready';
    readyBtn.style.background = readyBtn.textContent.includes('✓') ? '#4ed489' : '#ffd447';
  });
}
