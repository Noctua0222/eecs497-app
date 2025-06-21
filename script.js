function navigateTo(section) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(section).classList.add('active');
}

function toggleFavorite(button) {
  button.classList.toggle('favorited');
  button.textContent = button.classList.contains('favorited') ? '♥' : '♡';
}

function showImageDescription(text) {
  document.getElementById('image-description').textContent = text;
  document.getElementById('image-overlay').style.display = 'flex';
}

function showGameDescription(text) {
  document.getElementById('game-description').textContent = text;
  document.getElementById('game-overlay').style.display = 'flex';
}

function hideOverlay(id) {
  document.getElementById(id).style.display = 'none';
}
