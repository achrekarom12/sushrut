// Hardcoded credentials
const CREDENTIALS = {
    mobile: '9876543210',
    password: 'password123'
};

// LocalStorage Keys
const STORAGE_KEYS = {
    USER_DATA: 'sushrut_user_data',
    IS_LOGGED_IN: 'sushrut_logged_in'
};

// Get DOM elements
const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const loginForm = document.getElementById('login-form');
const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const logoutBtn = document.getElementById('logout-btn');

// Sidebar elements
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const menuBtn = document.getElementById('menu-btn');
const closeSidebarBtn = document.getElementById('close-sidebar');
const settingsBtn = document.getElementById('settings-btn');

// Settings modal elements
const settingsModal = document.getElementById('settings-modal');
const settingsForm = document.getElementById('settings-form');
const closeSettingsBtn = document.getElementById('close-settings');
const userNameInput = document.getElementById('user-name');
const userAgeInput = document.getElementById('user-age');
const userGenderInput = document.getElementById('user-gender');

// Login Form Handler
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

function handleLogin(e) {
    e.preventDefault();

    const mobile = document.getElementById('mobile').value.trim();
    const password = document.getElementById('password').value;

    // Validate against hardcoded credentials
    if (mobile === CREDENTIALS.mobile && password === CREDENTIALS.password) {
        // Mark as logged in
        localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');

        // Success - Show chat screen
        showChatScreen();

        // Load user data if exists
        loadUserData();
    } else {
        alert('Invalid credentials! Please use:\nMobile: 9876543210\nPassword: password123');
    }
}

// Chat Form Handler
if (chatForm) {
    chatForm.addEventListener('submit', handleSendMessage);
}

function handleSendMessage(e) {
    e.preventDefault();

    const message = messageInput.value.trim();
    if (!message) return;

    // Add sent message
    addMessage(message, 'sent');

    // Clear input
    messageInput.value = '';

    // Simulate a response after a short delay
    setTimeout(() => {
        const responses = [
            "Thanks for your message. How else can I assist you?",
            "I'm here to help with your healthcare needs.",
            "Got it! Is there anything specific you'd like to know?",
            "I understand. Let me know if you have any other questions.",
            "That's noted. How can I further assist you today?"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage(randomResponse, 'received');
    }, 1000);
}

// Add message to chat
function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    if (type === 'received') {
        messageDiv.innerHTML = `
            <div class="message-avatar">🏥</div>
            <div class="message-content">
                <p class="message-text">${text}</p>
                <span class="message-time">${currentTime}</span>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                <p class="message-text">${text}</p>
                <span class="message-time">${currentTime}</span>
            </div>
        `;
    }

    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show chat screen
function showChatScreen() {
    loginScreen.classList.add('hidden');
    chatScreen.classList.remove('hidden');
}

// Show login screen
function showLoginScreen() {
    chatScreen.classList.add('hidden');
    loginScreen.classList.remove('hidden');

    // Clear login status
    localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);

    // Clear chat messages except the welcome message
    const welcomeMessage = chatMessages.querySelector('.message');
    chatMessages.innerHTML = '';
    if (welcomeMessage) {
        chatMessages.appendChild(welcomeMessage.cloneNode(true));
    }

    // Reset login form
    if (loginForm) {
        loginForm.reset();
    }
}

// Logout handler
if (logoutBtn) {
    logoutBtn.addEventListener('click', showLoginScreen);
}

// Sidebar handlers
if (menuBtn) {
    menuBtn.addEventListener('click', openSidebar);
}

if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener('click', closeSidebar);
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
}

function openSidebar() {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
}

function closeSidebar() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
}

// Settings handlers
if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
        closeSidebar();
        openSettingsModal();
    });
}

if (closeSettingsBtn) {
    closeSettingsBtn.addEventListener('click', closeSettingsModal);
}

if (settingsModal) {
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            closeSettingsModal();
        }
    });
}

if (settingsForm) {
    settingsForm.addEventListener('submit', handleSaveSettings);
}

function openSettingsModal() {
    settingsModal.classList.add('active');
    loadUserData();
}

function closeSettingsModal() {
    settingsModal.classList.remove('active');
}

function handleSaveSettings(e) {
    e.preventDefault();

    const userData = {
        name: userNameInput.value.trim(),
        age: parseInt(userAgeInput.value),
        gender: userGenderInput.value
    };

    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

    // Show success message
    alert('Settings saved successfully!');

    // Close modal
    closeSettingsModal();
}

function loadUserData() {
    const savedData = localStorage.getItem(STORAGE_KEYS.USER_DATA);

    if (savedData) {
        try {
            const userData = JSON.parse(savedData);

            if (userNameInput) userNameInput.value = userData.name || '';
            if (userAgeInput) userAgeInput.value = userData.age || '';
            if (userGenderInput) userGenderInput.value = userData.gender || '';
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }
}

// Add input formatting for mobile number
const mobileInput = document.getElementById('mobile');
if (mobileInput) {
    mobileInput.addEventListener('input', function (e) {
        // Only allow digits
        this.value = this.value.replace(/[^0-9]/g, '');

        // Limit to 10 digits
        if (this.value.length > 10) {
            this.value = this.value.slice(0, 10);
        }
    });
}

// Service Worker Registration (for PWA functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js');
            console.log('Service Worker registered successfully:', registration.scope);
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    });
}
