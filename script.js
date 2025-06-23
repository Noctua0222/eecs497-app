function navigateTo(section) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(section).classList.add('active');

  if (section === 'favorites') renderFavorites();
  if (section === 'music') renderSounds();
  if (section === 'images') renderImages();
  if (section === 'games') renderGames();
}

// ---------------- SOUND SECTION ---------------- //

const SOUND_LIBRARY = [
  {
    name: "Bamboo Flute",
    file: "sounds/BambooFluteSound.mp3",
    image: "images/bamboo_flutePic.jpg",
    genres: ["Instrumental", "Calm", "Soothing"]
  },
  {
    name: "Birds Chirping",
    file: "sounds/BirdsSound.mp3",
    image: "images/Birds_Chirping.jpg",
    genres: ["Nature", "Ambient", "Calm"]
  },
  {
    name: "Crackling Fire",
    file: "sounds/CracklingFire.mp3",
    image: "images/crackling_fire.jpg",
    genres: ["Ambient", "Soothing"]
  },
  {
    name: "Harp",
    file: "sounds/HarpSound.mp3",
    image: "images/Harp.jpg",
    genres: ["Instrumental", "Soothing", "Calm"]
  },
  {
    name: "Ocean Waves",
    file: "sounds/Ocean.mp3",
    image: "images/Ocean_waves_pic.jpg",
    genres: ["Nature", "Ambient", "Soothing"]
  },
  {
    name: "Piano with Fire",
    file: "sounds/PianoFireMusic.mp3",
    image: "images/Piano_with_fire.jpg",
    genres: ["Instrumental", "Soothing"]
  },
  {
    name: "Rain",
    file: "sounds/RainSound.mp3",
    image: "images/Rain.jpg",
    genres: ["Nature", "Ambient", "Calm"]
  }
];

let selectedGenre = "All";

function filterByGenre(genre) {
  selectedGenre = genre;
  renderSounds();
}

function renderSounds() {
  const container = document.getElementById('sound-container');
  container.innerHTML = '';

  const favorites = getFavorites();
  const filtered = SOUND_LIBRARY.filter(sound =>
    selectedGenre === "All" || sound.genres.includes(selectedGenre)
  );

  filtered.forEach(sound => {
    const isFavorite = favorites.includes(sound.name);
    const card = document.createElement('div');
    card.className = 'sound-card';
    card.innerHTML = `
      <img src="${sound.image}" alt="${sound.name}">
      <p>${sound.name}</p>
      <button onclick="playSound('${sound.name}', '${sound.file}', this)">▶️</button>
      <button onclick="toggleFavorite(this)" class="favorite ${isFavorite ? 'favorited' : ''}">
        ${isFavorite ? '★' : '☆'}
      </button>
    `;
    container.appendChild(card);
  });
}

// ---------------- FAVORITE LOGIC ---------------- //

function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites') || '[]');
}

function saveFavorites(favs) {
  localStorage.setItem('favorites', JSON.stringify(favs));
}

function toggleFavorite(button) {
  const card = button.closest('.sound-card, .image-card, .game');
  const name = card.querySelector('p, span')?.textContent.trim();

  let favorites = getFavorites();
  const isAlreadyFavorited = favorites.includes(name);

  if (isAlreadyFavorited) {
    favorites = favorites.filter(n => n !== name);
    button.classList.remove('favorited');
    button.textContent = '☆';
  } else {
    favorites.push(name);
    button.classList.add('favorited');
    button.textContent = '★';
  }

  saveFavorites(favorites);
  renderFavorites();
}

function renderFavorites() {
  const container = document.getElementById('favorites-container');
  container.innerHTML = '';

  const favorites = getFavorites();
  const allItems = [...SOUND_LIBRARY, ...IMAGE_LIBRARY, ...GAME_LIBRARY];
  const filtered = allItems.filter(item => favorites.includes(item.name));

  if (filtered.length === 0) {
    container.innerHTML = '<p>No favorites yet. Go add some from Sounds, Images, or Games!</p>';
    return;
  }

  filtered.forEach(item => {
    const isGame = item.file?.endsWith('.html');
    const isSound = item.file?.endsWith('.mp3');
    const card = document.createElement('div');
    card.className = isGame ? 'game-card' : isSound ? 'sound-card' : 'image-card';

    card.innerHTML = `
      ${item.image ? `<img src="${item.image}" alt="${item.name}" ${item.caption ? `onclick="showImageOverlay('${item.image}', '${item.caption.replace(/'/g, "\\'")}')"` : ''}>` : ''}
      <p>${item.name}</p>
      ${isSound ? `<button onclick="playSound('${item.name}', '${item.file}', this)">▶️</button>` : ''}
      ${isGame ? `<button onclick="openGame('${item.file}')">▶️ Play</button>` : ''}
      <button onclick="toggleFavorite(this)" class="favorite favorited">★</button>
    `;

    container.appendChild(card);
  });
}

// ---------------- AUDIO LOGIC ---------------- //

let currentAudio = null;
let isPlaying = false;
let currentButton = null;
let currentTrackFile = null;

function playSound(name, file, button) {
  if (currentAudio && currentTrackFile === file) {
    togglePlayPause();
    return;
  }

  if (currentAudio) {
    currentAudio.pause();
    if (currentButton) currentButton.textContent = '▶️';
  }

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

// ---------------- IMAGE SECTION ---------------- //

const IMAGE_LIBRARY = [
  { name: "Cats Sleeping", image: "images/cats_sleeping.jpg", caption: "Two peaceful cats sleeping.", genres: ["Calm", "Animals"] },
  { name: "Happy Dog", image: "images/happy_dog.jpg", caption: "A joyful dog in nature.", genres: ["Animals", "Uplifting"] },
  { name: "Ocean Sunset", image: "images/ocean_sunset.jpg", caption: "A sunset over the ocean.", genres: ["Nature", "Soothing"] },
  { name: "Peaceful Nature", image: "images/Peaceful_nature.jpg", caption: "Lush green forest pathway.", genres: ["Nature", "Calm"] },
  { name: "Thank You Gesture", image: "images/Thank_you_gesture.png", caption: "A visual thank you gesture.", genres: ["Gestures"] },
  { name: "Help Sign", image: "images/Help_sign.jpg", caption: "HELPPPPP!", genres: ["Gestures"] },
  { name: "Birds & Flowers", image: "images/flower.png", caption: "Flowers with colorful birds.", genres: ["Nature"] },
  { name: "Walking Ducks", image: "images/ducks_walking.jpg", caption: "Cute ducks walking in a row.", genres: ["Animals", "Calm"] },
  { name: "Flower Closeup", image: "images/Flowers.jpg", caption: "Closeup of colorful flowers.", genres: ["Nature"] }
];

let selectedImageGenre = "All";

function filterImagesByGenre(genre) {
  selectedImageGenre = genre;
  renderImages();
}

function renderImages() {
  const container = document.getElementById('image-gallery');
  container.innerHTML = '';

  const favorites = getFavorites();
  const filtered = IMAGE_LIBRARY.filter(img =>
    selectedImageGenre === "All" || img.genres.includes(selectedImageGenre)
  );

  filtered.forEach(img => {
    const isFavorite = favorites.includes(img.name);
    const card = document.createElement('div');
    card.className = 'image-card';
    card.innerHTML = `
      <img src="${img.image}" alt="${img.name}" onclick="showImageOverlay('${img.image}', '${img.caption.replace(/'/g, "\\'")}')">
      <p>${img.name}</p>
      <button onclick="toggleFavorite(this)" class="favorite ${isFavorite ? 'favorited' : ''}">
        ${isFavorite ? '★' : '☆'}
      </button>
    `;
    container.appendChild(card);
  });
}

// ---------------- GAME SECTION ---------------- //

const GAME_LIBRARY = [
  { name: "Snake", file: "JavaScript-Snake/src/index.html", description: "Classic Snake Game!" },
  { name: "Tic Tac Toe", file: "tic-tac-toe/index.html", description: "Play Tic Tac Toe!" },
  { name: "Matching Game", file: "matching-game/index.html", description: "Match the tiles!" }
];

function renderGames() {
  const container = document.querySelector(".games-list");
  container.innerHTML = '';

  const favorites = getFavorites();

  GAME_LIBRARY.forEach(game => {
    const isFavorite = favorites.includes(game.name);
    const gameDiv = document.createElement("div");
    gameDiv.className = "game";
    gameDiv.innerHTML = `
      <span>${game.name}</span>
      <button onclick="openGame('${game.file}')">▶️ Play</button>
      <button onclick="toggleFavorite(this)" class="favorite ${isFavorite ? 'favorited' : ''}">
        ${isFavorite ? '★' : '☆'}
      </button>
    `;
    container.appendChild(gameDiv);
  });
}

// ---------------- OVERLAYS ---------------- //

function showImageOverlay(imageUrl, captionText) {
  document.getElementById('overlay-image').src = imageUrl;
  document.getElementById('image-description').textContent = captionText;
  document.getElementById('image-overlay').style.display = 'flex';
}

function showGameDescription(text) {
  document.getElementById('game-description').textContent = text;
  document.getElementById('game-description-overlay').style.display = 'flex';
}

function hideOverlay(id) {
  document.getElementById(id).style.display = 'none';
}

// ---------------- GAME EMBED ---------------- //

function openGame(url) {
  const popup = document.getElementById('game-popup');
  const iframe = document.getElementById('game-frame');
  iframe.src = url;
  popup.style.display = 'flex';
}

function closeGame() {
  const iframe = document.getElementById('game-frame');
  iframe.src = '';
  document.getElementById('game-popup').style.display = 'none';
}
