const pageId = document.body.id;

const phraseMap = {
"home-page": [
    "Welcome!",
    "Glad you're here!",
    "Hello there!",
],
"projects-page": [
    "Welcome!",
    "See what I’ve built!",
    "Explore my projects!",
    "Check out my work!",
    "Discover my creations!",
],
"contact-page": [
    "Reach out and say hi!",
    "Let's connect!",
    "I'd love to hear from you!",
    "Feel free to contact me!",
    "Get in touch!",
],
"about-page": [
    "Learn more about me!",
    "Discover my journey!",
    "Find out who I am!",
    "Get to know me!",
    "Here's my story!",
],
};

const phrases = phraseMap[pageId] || ["Hello!"];  // fallback
const selectedPhrase = phrases[Math.floor(Math.random() * phrases.length)];
const textElement = document.getElementById("welcome-text");

window.addEventListener("load", () => {
    if (textElement) {
        textElement.textContent = selectedPhrase;

        // Ensure initial opacity is 0 and transition is set
        textElement.style.opacity = 0;
        textElement.style.transition = "opacity 1s";

        // Fade in
        setTimeout(() => {
            textElement.style.opacity = 1;
        }, 200);

        // Fade out after visible for ~3s, smoothly
        setTimeout(() => {
            textElement.style.opacity = 0;
        }, 3200);
    }

    // Remove overlay
    setTimeout(() => {
        const overlay = document.querySelector(".overlay");
        if (overlay) overlay.remove();
    }, 8000);
});

const videos = [
    "resources/background/background1.mp4",
    "resources/background/background2.mp4",
    "resources/background/background3.mp4",
    "resources/background/background4.mp4",
    "resources/background/background5.mp4",
];

function getRandomIndex(excludeList = []) {
    let available = videos.map((_, i) => i).filter(i => !excludeList.includes(i));
    if (available.length === 0) available = videos.map((_, i) => i); // fallback
    const idx = Math.floor(Math.random() * available.length);
    return available[idx];
}

window.addEventListener("load", () => {
    const vidEl = document.querySelector(".bg-videos");
    const changeBtn = document.getElementById("change-bg-btn");

    // Track last two backgrounds to avoid repeats
    let lastTwo = [];

    // show one on load
    let current = getRandomIndex();
    lastTwo.push(current);
    vidEl.src = videos[current];
    setTimeout(() => vidEl.style.opacity = 1, 100);

    function swapBackground() {
        const next = getRandomIndex(lastTwo);
        current = next;
        lastTwo.push(current);
        if (lastTwo.length > 2) lastTwo.shift();
        vidEl.style.opacity = 0;
        setTimeout(() => {
            vidEl.src = videos[current];
            vidEl.load();
            setTimeout(() => vidEl.style.opacity = 1, 100);
        }, 500);
    }

    // 1) interval-based reshuffle every minute
    setInterval(swapBackground, 60000);

    // 2) on-click handler to manually change it
    changeBtn.addEventListener("click", swapBackground);

    // 3) Shuffle background when clicking a menu option
    document.querySelectorAll('#nav-menu a').forEach(link => {
        link.addEventListener('click', swapBackground);
    });
});

const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
});
// Optional: Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('open');
    }
});

// Spinning Profile Image with Music on Click or Double Click
const profileImg = document.getElementById('spinning-profile');
const musicTracks = [
    "/resources/audio/Alfonso Peduto - Binary Data II Live [Disklavier  realtime delays].mp3",
    "/resources/audio/Alfonso Peduto - Binary Data IV Live [Disklavier  realtime delays].mp3.mp3",
    "/resources/audio/Alfonso Peduto - Binary Data IX.mp3",
    "/resources/audio/Alfonso Peduto - Binary Data V [OFFICIAL AUDIO].mp3",
    '/resources/audio/Alfonso Peduto - Binary Data XVIII.mp3',
];
let spinning = false;
let rotation = 0;
let animationFrame;
let audio = null;
let lastMusicIndex = -1;
let clickTimeout = null;

function spin() {
    if (!spinning) return;
    rotation += 3; // Adjust for speed (lower = slower)
    profileImg.style.transform = `rotate(${rotation}deg)`;
    animationFrame = requestAnimationFrame(spin);
}

function getRandomMusicIndex(exclude) {
    let idx;
    do {
        idx = Math.floor(Math.random() * musicTracks.length);
    } while (idx === exclude && musicTracks.length > 1);
    return idx;
}

function playMusic(index) {
    // Stop previous audio if playing
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
    audio = new Audio(musicTracks[index]);
    audio.play();
    lastMusicIndex = index;
}

function playRandomMusicNoRepeat() {
    const idx = getRandomMusicIndex(lastMusicIndex);
    playMusic(idx);
}

profileImg.addEventListener('click', () => {
    // Use timeout to distinguish single vs double click
    if (clickTimeout) return; // Prevent multiple timers
    clickTimeout = setTimeout(() => {
        if (spinning) {
            // Stop spinning and music
            spinning = false;
            cancelAnimationFrame(animationFrame);
            rotation = 0;
            profileImg.style.transform = 'rotate(0deg)';
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        } else {
            // Start spinning and play random music
            spinning = true;
            spin();
            playRandomMusicNoRepeat();
        }
        clickTimeout = null;
    }, 250); // 250ms threshold for double click
});

profileImg.addEventListener('dblclick', () => {
    // Cancel single click action
    if (clickTimeout) {
        clearTimeout(clickTimeout);
        clickTimeout = null;
    }
    // Only change music if spinning
    if (spinning) {
        playRandomMusicNoRepeat();
    }
});

const bgContainer = document.querySelector('.bg-container');
const footer = document.querySelector('footer');

function checkFooterOverlap() {
    const footerRect = footer.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (footerRect.top < windowHeight) {
        // Footer is entering view, allow background to scroll with it
        bgContainer.style.position = 'absolute';
        bgContainer.style.top = `${window.scrollY}px`;
    } else {
        // Background should be fixed
        bgContainer.style.position = 'fixed';
        bgContainer.style.top = '0';
    }
}

window.addEventListener('scroll', checkFooterOverlap);
window.addEventListener('resize', checkFooterOverlap); // Adjust on resize
window.addEventListener('load', checkFooterOverlap);



