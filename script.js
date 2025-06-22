function navigateTo(section) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(section).classList.add('active');
}

function toggleFavorite(button) {
  button.classList.toggle('favorited');
  button.textContent = button.classList.contains('favorited') ? '★' : '☆';
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

let currentAudio = null;
let isPlaying = false;
let currentButton = null;
let currentTrackFile = null;

function playSound(name, file, button) {
  if (currentAudio && currentTrackFile === file) {
    // Same track clicked, so just toggle play/pause
    togglePlayPause();
    return;
  }

  // If switching to a different track, reset the previous button/icon
  if (currentAudio) {
    currentAudio.pause();
    if (currentButton) {
      currentButton.textContent = '▶️';
    }
  }

  // Start the new track
  currentAudio = new Audio(file);
  currentAudio.play();
  isPlaying = true;
  currentButton = button;
  currentTrackFile = file;

  button.textContent = '⏸️';

  document.getElementById('now-playing').textContent = `Now Playing: ${name}`;
  document.getElementById('mini-player').classList.remove('hidden');
  document.getElementById('play-pause').textContent = '⏸️';

  currentAudio.onended = () => {
    // Reset icons when playback ends
    isPlaying = false;
    if (currentButton) currentButton.textContent = '▶️';
    document.getElementById('play-pause').textContent = '▶️';
  };
}

function togglePlayPause() {
  if (!currentAudio) return;

  if (isPlaying) {
    currentAudio.pause();
    document.getElementById('play-pause').textContent = '▶️';
    if (currentButton) currentButton.textContent = '▶️';
  } else {
    currentAudio.play();
    document.getElementById('play-pause').textContent = '⏸️';
    if (currentButton) currentButton.textContent = '⏸️';
  }

  isPlaying = !isPlaying;
}
