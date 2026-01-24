// API Configuration
const API_BASE_URL = 'https://sushrut-870116182456.europe-west1.run.app/v1';

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

async function handleLogin(e) {
    e.preventDefault();

    const mobile = document.getElementById('mobile').value.trim();
    const password = document.getElementById('password').value;

    const loginBtn = loginForm.querySelector('button[type="submit"]');
    const originalBtnText = loginBtn.textContent;
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';

    try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phonenumber: mobile,
                password: password
            })
        });

        console.log(response);

        if (response.ok) {
            const userData = await response.json();

            // Mark as logged in
            localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

            // Success - Show chat screen
            showChatScreen();

            // Load user data into settings modal
            loadUserData();
        } else {
            const error = await response.json();
            alert(error.message || 'Login failed! Please check your credentials.');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Unable to connect to the server. Please make sure the backend is running.');
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = originalBtnText;
    }
}

// Chat Form Handler
if (chatForm) {
    chatForm.addEventListener('submit', handleSendMessage);
}

async function handleSendMessage(e) {
    e.preventDefault();

    const message = messageInput.value.trim();
    if (!message) return;

    // Get user data for userId
    const savedData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    let userId = 'anonymous';
    if (savedData) {
        try {
            const user = JSON.parse(savedData);
            userId = user.id || user.user_id || user.id || 'anonymous';
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    }

    // Add sent message
    addMessage(message, 'sent');

    // Clear input
    messageInput.value = '';

    // Add typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message received typing';
    typingDiv.innerHTML = `
        <div class="message-avatar">🏥</div>
        <div class="message-content">
            <div class="message-text">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const response = await fetch(`${API_BASE_URL}/ai/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: message,
                userId: userId.toString()
            })
        });

        // Remove typing indicator
        if (typingDiv && typingDiv.parentNode) {
            chatMessages.removeChild(typingDiv);
        }

        if (response.ok) {
            const data = await response.json();
            addMessage(data.text, 'received');
        } else {
            console.error('API Error:', response.statusText);
            addMessage("I'm sorry, I'm having trouble responding right now. Please try again later.", 'received');
        }
    } catch (error) {
        // Remove typing indicator if it exists
        if (typingDiv && typingDiv.parentNode) {
            chatMessages.removeChild(typingDiv);
        }
        console.error('Chat error:', error);
        addMessage("Unable to connect to the medical assistant. Please check your internet connection.", 'received');
    }
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

async function handleSaveSettings(e) {
    e.preventDefault();

    const savedData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (!savedData) return;

    const currentUser = JSON.parse(savedData);
    const updatedData = {
        name: userNameInput.value.trim(),
        age: parseInt(userAgeInput.value),
        gender: userGenderInput.value
    };

    const saveBtn = settingsForm.querySelector('button[type="submit"]');
    const originalBtnText = saveBtn.textContent;
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    try {
        const response = await fetch(`${API_BASE_URL}/users/${currentUser.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            const user = await response.json();
            // Update localStorage
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
            alert('Settings saved successfully!');
            closeSettingsModal();
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to save settings.');
        }
    } catch (error) {
        console.error('Save error:', error);
        alert('Unable to connect to the server.');
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = originalBtnText;
    }
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
