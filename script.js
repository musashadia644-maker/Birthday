// DOM Elements
const friendNameElement = document.getElementById('friend-name');
const mainPhotoElement = document.getElementById('main-photo');
const partyModeBtn = document.getElementById('party-mode');
const showSurpriseBtn = document.getElementById('show-surprise');
const playMusicBtn = document.getElementById('play-music');
const birthdaySong = document.getElementById('birthday-song');
const galleryItems = document.querySelectorAll('.gallery-item');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const currentPhotoSpan = document.getElementById('current-photo');
const totalPhotosSpan = document.getElementById('total-photos');
const uploadArea = document.getElementById('upload-area');
const photoUpload = document.getElementById('photo-upload');
const wishMessage = document.getElementById('wish-message');
const yourNameInput = document.getElementById('your-name');
const generateWishBtn = document.getElementById('generate-wish');
const saveWishBtn = document.getElementById('save-wish');
const shareWishBtn = document.getElementById('share-wish');
const wishButtons = document.querySelectorAll('.wish-btn');
const themeOptions = document.querySelectorAll('.theme-option');
const wishCard = document.getElementById('wish-card');
const cardFriendName = document.getElementById('card-friend-name');
const currentDateElement = document.getElementById('current-date');
const editDateBtn = document.getElementById('edit-date');
const birthdayDateElement = document.getElementById('birthday-date');
const setReminderBtn = document.getElementById('set-reminder');
const countdownDays = document.getElementById('countdown-days');
const countdownHours = document.getElementById('countdown-hours');
const countdownMinutes = document.getElementById('countdown-minutes');
const countdownSeconds = document.getElementById('countdown-seconds');
const printCardBtn = document.getElementById('print-card');
const footerFriendName = document.getElementById('footer-friend-name');

// Friend Information
const friendInfo = {
    name: "Morore",
    birthday: "December 28, 2025",
    photos: [
        "image/WhatsApp Image 2025-12-23 at 15.46.01 (1).jpeg",
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1540569876033-6e5d046a1d77?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1528892952291-009c663ce843?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    ]
};

// Current photo index for gallery
let currentPhotoIndex = 0;
const totalPhotos = friendInfo.photos.length;

// Birthday Messages
const birthdayMessages = [
    "To my amazing friend, on your special day I wish you endless joy, laughter, and success. May all your dreams come true and may this year be your best one yet!",
    "Happy Birthday to someone who makes the world a better place just by being in it! Your kindness, humor, and friendship mean everything to me.",
    "Another trip around the sun! Wishing you a birthday filled with love, laughter, and all your favorite things. Cheers to more adventures together!",
    "To the friend who has been there through thick and thin – thank you for everything. May your birthday be as wonderful as you are!",
    "They say the best things in life are free, and having you as a friend is proof of that! Happy Birthday to an incredible person!"
];

// Initialize the website
function initWebsite() {
    console.log("Initializing birthday website...");
    
    // Set friend's name throughout the website
    updateFriendName(friendInfo.name);
    
    // Update total photos count
    totalPhotosSpan.textContent = totalPhotos;
    currentPhotoSpan.textContent = currentPhotoIndex + 1;
    
    // Set current date
    updateCurrentDate();
    
    // Set birthday date
    birthdayDateElement.textContent = friendInfo.birthday;
    
    // Initialize countdown
    startCountdown();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize gallery
    updateGallery();
    
    // Initialize fancybox for gallery if jQuery is loaded
    if (window.jQuery && $.fancybox) {
        $('[data-fancybox="gallery"]').fancybox({
            buttons: [
                "zoom",
                "share",
                "slideShow",
                "fullScreen",
                "download",
                "thumbs",
                "close"
            ]
        });
    } else {
        console.log("jQuery or fancybox not loaded, using simple image clicks");
        setupSimpleGallery();
    }
    
    console.log("Website initialized successfully!");
}

// Setup simple gallery functionality if fancybox isn't available
function setupSimpleGallery() {
    document.querySelectorAll('.gallery-item a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const imgUrl = this.getAttribute('href');
            const caption = this.getAttribute('data-caption') || 'Photo';
            
            // Create modal for image viewing
            const modal = document.createElement('div');
            modal.className = 'image-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <img src="${imgUrl}" alt="${caption}">
                    <p>${caption}</p>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Show modal
            setTimeout(() => modal.classList.add('show'), 10);
            
            // Close modal
            modal.querySelector('.close-modal').addEventListener('click', () => {
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            });
            
            // Close on background click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                    setTimeout(() => modal.remove(), 300);
                }
            });
        });
    });
}

// Update friend's name throughout the website
function updateFriendName(name) {
    if (friendNameElement) friendNameElement.textContent = name + "!";
    if (cardFriendName) cardFriendName.textContent = name;
    if (footerFriendName) footerFriendName.textContent = name;
}

// Update current date
function updateCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    if (currentDateElement) {
        currentDateElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

// Gallery Navigation
function updateGallery() {
    // Remove active class from all items
    galleryItems.forEach(item => item.classList.remove('active'));
    
    // Add active class to current item
    if (galleryItems[currentPhotoIndex]) {
        galleryItems[currentPhotoIndex].classList.add('active');
    }
    
    // Update counter
    currentPhotoSpan.textContent = currentPhotoIndex + 1;
    
    // Update main photo
    if (mainPhotoElement && friendInfo.photos[currentPhotoIndex]) {
        mainPhotoElement.src = friendInfo.photos[currentPhotoIndex];
    }
}

// Start birthday countdown
function startCountdown() {
    const birthdayDate = new Date(friendInfo.birthday);
    
    function updateCountdown() {
        const now = new Date();
        const diff = birthdayDate - now;
        
        if (diff <= 0) {
            // Birthday has arrived!
            countdownDays.textContent = "00";
            countdownHours.textContent = "00";
            countdownMinutes.textContent = "00";
            countdownSeconds.textContent = "00";
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        if (countdownDays) countdownDays.textContent = days.toString().padStart(2, '0');
        if (countdownHours) countdownHours.textContent = hours.toString().padStart(2, '0');
        if (countdownMinutes) countdownMinutes.textContent = minutes.toString().padStart(2, '0');
        if (countdownSeconds) countdownSeconds.textContent = seconds.toString().padStart(2, '0');
    }
    
    // Update immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Generate random wish
function generateRandomWish() {
    const randomIndex = Math.floor(Math.random() * birthdayMessages.length);
    if (wishMessage) {
        wishMessage.value = birthdayMessages[randomIndex];
        showNotification('New wish generated!', 'success');
    }
}

// Save wish as image
function saveWishAsImage() {
    if (typeof html2canvas === 'undefined') {
        showNotification('Please wait for the page to fully load or try again later.', 'error');
        return;
    }
    
    html2canvas(wishCard).then(canvas => {
        const link = document.createElement('a');
        link.download = `birthday-wish-for-${friendInfo.name}.png`;
        link.href = canvas.toDataURL();
        link.click();
        showNotification('Birthday wish saved as image!', 'success');
    }).catch(error => {
        console.error('Error saving wish as image:', error);
        showNotification('Could not save image. Please try again.', 'error');
    });
}

// Share wish
function shareWish() {
    const wishText = wishMessage ? wishMessage.value : 'Happy Birthday!';
    
    if (navigator.share) {
        const shareData = {
            title: `Happy Birthday ${friendInfo.name}!`,
            text: wishText,
            url: window.location.href
        };
        
        navigator.share(shareData)
            .then(() => showNotification('Wish shared successfully!', 'success'))
            .catch(err => {
                console.error('Share error:', err);
                copyToClipboard(wishText);
            });
    } else {
        copyToClipboard(wishText);
    }
}

// Copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(`${text}\n\n${window.location.href}`)
        .then(() => showNotification('Wish copied to clipboard!', 'success'))
        .catch(err => {
            console.error('Copy error:', err);
            showNotification('Could not copy to clipboard.', 'error');
        });
}

// Set birthday reminder
function setBirthdayReminder() {
    if (!("Notification" in window)) {
        showNotification("This browser doesn't support notifications", 'error');
        return;
    }
    
    if (Notification.permission === "granted") {
        scheduleNotification();
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                scheduleNotification();
            } else {
                showNotification('Notification permission denied.', 'error');
            }
        });
    } else {
        showNotification('Notification permission denied. Please enable in browser settings.', 'error');
    }
}

function scheduleNotification() {
    const birthdayDate = new Date(friendInfo.birthday);
    const now = new Date();
    const timeUntilBirthday = birthdayDate - now;
    
    if (timeUntilBirthday > 0) {
        // For demo purposes, we'll schedule for 10 seconds from now
        // In production, use timeUntilBirthday
        setTimeout(() => {
            if (Notification.permission === "granted") {
                new Notification(`🎉 Happy Birthday ${friendInfo.name}!`, {
                    body: "It's your birthday today! Time to celebrate!",
                    icon: mainPhotoElement ? mainPhotoElement.src : ''
                });
            }
        }, 10000); // 10 seconds for demo
        
        showNotification('Birthday reminder set for 10 seconds from now!', 'success');
    } else {
        showNotification('Birthday has already passed!', 'error');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#FF6B6B' : type === 'success' ? '#06D6A0' : '#4A90E2'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 600;
        transform: translateX(150%);
        transition: transform 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Party mode
let partyModeActive = false;
let confettiInterval = null;

function togglePartyMode() {
    partyModeActive = !partyModeActive;
    
    if (partyModeActive) {
        document.body.classList.add('party-mode');
        partyModeBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Party';
        startConfetti();
        
        if (birthdaySong) {
            birthdaySong.play().catch(e => {
                console.log("Autoplay prevented:", e);
                showNotification('Click "Play Birthday Song" to start music', 'info');
            });
        }
        
        showNotification('Party mode activated! 🎉', 'success');
    } else {
        document.body.classList.remove('party-mode');
        partyModeBtn.innerHTML = '<i class="fas fa-party-horn"></i> Party Mode';
        stopConfetti();
        
        if (birthdaySong) {
            birthdaySong.pause();
            birthdaySong.currentTime = 0;
        }
    }
}

// Confetti animation
function startConfetti() {
    const colors = ['#FF6B8B', '#4A90E2', '#FFD166', '#06D6A0', '#9B59B6'];
    
    // Clear any existing confetti
    stopConfetti();
    
    confettiInterval = setInterval(() => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-particle';
        confetti.style.cssText = `
            position: fixed;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}%;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            z-index: 9999;
            pointer-events: none;
        `;
        
        document.body.appendChild(confetti);
        
        // Animate confetti
        const startTime = Date.now();
        const duration = Math.random() * 3000 + 2000;
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                const x = Math.sin(progress * Math.PI * 2) * 50;
                const y = progress * window.innerHeight;
                const rotation = progress * 360;
                
                confetti.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
                confetti.style.opacity = `${1 - progress}`;
                requestAnimationFrame(animate);
            } else {
                if (confetti.parentNode) {
                    confetti.remove();
                }
            }
        }
        
        animate();
    }, 100);
}

function stopConfetti() {
    if (confettiInterval) {
        clearInterval(confettiInterval);
        confettiInterval = null;
    }
    
    // Remove all confetti particles
    document.querySelectorAll('.confetti-particle').forEach(el => {
        if (el.parentNode) {
            el.remove();
        }
    });
}

// Set up all event listeners
function setupEventListeners() {
    console.log("Setting up event listeners...");
    
    // Party mode
    if (partyModeBtn) {
        partyModeBtn.addEventListener('click', togglePartyMode);
    }
    
    // Show surprise
    if (showSurpriseBtn) {
        showSurpriseBtn.addEventListener('click', () => {
            startConfetti();
            if (birthdaySong) {
                birthdaySong.play().catch(e => {
                    console.log("Autoplay prevented");
                    showNotification('Click play button to start music', 'info');
                });
            }
            showNotification('Surprise! Happy Birthday! 🎂', 'success');
        });
    }
    
    // Play music
    if (playMusicBtn && birthdaySong) {
        playMusicBtn.addEventListener('click', () => {
            if (birthdaySong.paused) {
                birthdaySong.play()
                    .then(() => {
                        playMusicBtn.innerHTML = '<i class="fas fa-pause"></i> Pause Song';
                    })
                    .catch(e => {
                        console.log("Play failed:", e);
                        showNotification('Click to allow audio playback', 'info');
                    });
            } else {
                birthdaySong.pause();
                playMusicBtn.innerHTML = '<i class="fas fa-music"></i> Play Birthday Song';
            }
        });
        
        // Update button when song ends
        birthdaySong.addEventListener('ended', () => {
            playMusicBtn.innerHTML = '<i class="fas fa-music"></i> Play Birthday Song';
        });
    }
    
    // Gallery navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentPhotoIndex = (currentPhotoIndex - 1 + totalPhotos) % totalPhotos;
            updateGallery();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentPhotoIndex = (currentPhotoIndex + 1) % totalPhotos;
            updateGallery();
        });
    }
    
    // Photo upload
    if (uploadArea && photoUpload) {
        uploadArea.addEventListener('click', () => photoUpload.click());
        photoUpload.addEventListener('change', handlePhotoUpload);
    }
    
    // Generate random wish
    if (generateWishBtn) {
        generateWishBtn.addEventListener('click', generateRandomWish);
    }
    
    // Save wish
    if (saveWishBtn) {
        saveWishBtn.addEventListener('click', saveWishAsImage);
    }
    
    // Share wish
    if (shareWishBtn) {
        shareWishBtn.addEventListener('click', shareWish);
    }
    
    // Premade wish buttons
    if (wishButtons.length > 0) {
        wishButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (wishMessage) {
                    wishMessage.value = button.dataset.wish;
                    showNotification('Wish applied!', 'success');
                }
            });
        });
    }
    
    // Theme options
    if (themeOptions.length > 0) {
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                updateCardTheme(theme);
            });
        });
    }
    
    // Edit birthday date
    if (editDateBtn) {
        editDateBtn.addEventListener('click', () => {
            const newDate = prompt('Enter new birthday date (e.g., December 25, 2024):', friendInfo.birthday);
            if (newDate) {
                friendInfo.birthday = newDate;
                if (birthdayDateElement) {
                    birthdayDateElement.textContent = newDate;
                }
                startCountdown(); // Restart countdown with new date
                showNotification('Birthday date updated!', 'success');
            }
        });
    }
    
    // Set reminder
    if (setReminderBtn) {
        setReminderBtn.addEventListener('click', setBirthdayReminder);
    }
    
    // Print card
    if (printCardBtn) {
        printCardBtn.addEventListener('click', () => {
            window.print();
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update main photo when gallery items are clicked
    if (galleryItems.length > 0) {
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                // Only update if not clicking on a link
                if (!e.target.closest('a')) {
                    currentPhotoIndex = index;
                    updateGallery();
                }
            });
        });
    }
    
    console.log("Event listeners set up successfully!");
}

// Handle photo upload
function handlePhotoUpload(e) {
    const files = e.target.files;
    if (files.length > 0) {
        const file = files[0];
        if (!file.type.match('image.*')) {
            showNotification('Please select an image file', 'error');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(event) {
            // Add new photo to gallery
            const newPhotoUrl = event.target.result;
            friendInfo.photos.push(newPhotoUrl);
            
            // Create new gallery item
            const newIndex = friendInfo.photos.length - 1;
            const galleryGrid = document.querySelector('.gallery-grid');
            
            if (galleryGrid) {
                const newItem = document.createElement('div');
                newItem.className = 'gallery-item';
                newItem.dataset.index = newIndex;
                newItem.innerHTML = `
                    <a href="${newPhotoUrl}" data-fancybox="gallery" data-caption="New Memory">
                        <img src="${newPhotoUrl}" alt="New Photo">
                        <div class="gallery-overlay">
                            <div class="overlay-content">
                                <i class="fas fa-search-plus"></i>
                                <span>Click to enlarge</span>
                            </div>
                        </div>
                    </a>
                    <div class="photo-caption">
                        <h3>New Memory</h3>
                        <p>Just added!</p>
                    </div>
                `;
                
                galleryGrid.appendChild(newItem);
                
                // Update fancybox if available
                if (window.jQuery && $.fancybox) {
                    $('[data-fancybox="gallery"]').fancybox();
                } else {
                    setupSimpleGallery();
                }
                
                // Update total count
                totalPhotosSpan.textContent = friendInfo.photos.length;
                
                // Add click event to new item
                newItem.addEventListener('click', (e) => {
                    if (!e.target.closest('a')) {
                        currentPhotoIndex = newIndex;
                        updateGallery();
                    }
                });
                
                showNotification('Photo uploaded successfully!', 'success');
            }
        };
        
        reader.readAsDataURL(file);
    }
}

// Update card theme
function updateCardTheme(theme) {
    const themes = {
        gold: 'linear-gradient(135deg, #FFD700, #FFA500)',
        blue: 'linear-gradient(135deg, #4A90E2, #2E5AA6)',
        pink: 'linear-gradient(135deg, #FF6B8B, #FF2E5E)',
        purple: 'linear-gradient(135deg, #9B59B6, #8E44AD)'
    };
    
    if (themes[theme] && wishCard) {
        wishCard.style.background = themes[theme];
        showNotification(`Card theme changed to ${theme}`, 'success');
    }
}

// Add CSS for simple modal
function addModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .image-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .image-modal.show {
            opacity: 1;
            visibility: visible;
        }
        
        .image-modal .modal-content {
            max-width: 90%;
            max-height: 90%;
            position: relative;
        }
        
        .image-modal img {
            max-width: 100%;
            max-height: 80vh;
            display: block;
            margin: 0 auto;
        }
        
        .image-modal p {
            color: white;
            text-align: center;
            margin-top: 1rem;
            font-size: 1.2rem;
        }
        
        .image-modal .close-modal {
            position: absolute;
            top: -40px;
            right: 0;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            background: none;
            border: none;
        }
        
        .confetti-particle {
            animation: fall linear forwards;
        }
        
        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
        
        .party-mode .floating-elements > div {
            animation-duration: 0.5s !important;
        }
    `;
    document.head.appendChild(style);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    
    // Add modal styles
    addModalStyles();
    
    // Initialize website
    initWebsite();
    
    // Check for jQuery and fancybox
    if (!window.jQuery) {
        console.log("jQuery not loaded, using fallback gallery");
    }
    
    // Add a welcome notification after a short delay
    setTimeout(() => {
        showNotification(`Welcome  ${friendInfo.name} to your Birthday Celebration! 🎉`, 'success');
    }, 1000);
});

// Handle page errors
window.addEventListener('error', function(e) {
    console.error('Page error:', e.error);
    showNotification('Something went wrong. Please refresh the page.', 'error');
});