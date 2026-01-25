// API Configuration
const API_BASE_URL = 'https://sushrut-870116182456.europe-west1.run.app/v1';
// const API_BASE_URL = 'http://10.125.167.198:3000/v1';

// LocalStorage Keys
const STORAGE_KEYS = {
    USER_DATA: 'sushrut_user_data',
    IS_LOGGED_IN: 'sushrut_logged_in'
};

// Configure Marked.js
if (typeof marked !== 'undefined') {
    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: false,
        mangle: false
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initLanguageListeners();
});

// Get DOM elements
const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const loginForm = document.getElementById('login-form');
const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const logoutBtn = document.getElementById('logout-btn');
const reportUploadInput = document.getElementById('report-upload');
const uploadBtn = document.getElementById('upload-btn');
const pdfsList = document.getElementById('pdfs-list');
const imagesList = document.getElementById('images-list');

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

// Profile modal elements
const profileModal = document.getElementById('profile-modal');
const profileBtn = document.getElementById('profile-btn');
const closeProfileBtn = document.getElementById('close-profile');
const profileForm = document.getElementById('profile-form');
const displayName = document.getElementById('display-name');
const displayAgeGender = document.getElementById('display-age-gender');

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

if (uploadBtn) {
    uploadBtn.addEventListener('click', () => reportUploadInput.click());
}

if (reportUploadInput) {
    reportUploadInput.addEventListener('change', handleFileUpload);
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

    let messageHtml = text;
    if (type === 'received' && typeof marked !== 'undefined') {
        // AI response - render as markdown
        messageHtml = marked.parse(text);
    } else {
        // Sent message or fallback - treat as plain text but wrap in p
        // Simple escape for text
        const p = document.createElement('p');
        p.textContent = text;
        messageHtml = p.innerHTML;
    }

    if (type === 'received') {
        messageDiv.innerHTML = `
            <div class="message-avatar">🏥</div>
            <div class="message-content">
                <div class="message-text">${messageHtml}</div>
                <span class="message-time">${currentTime}</span>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${messageHtml}</div>
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

// Profile handlers
if (profileBtn) {
    profileBtn.addEventListener('click', () => {
        closeSidebar();
        openProfileModal();
    });
}

if (closeProfileBtn) {
    closeProfileBtn.addEventListener('click', closeProfileModal);
}

if (profileModal) {
    profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) {
            closeProfileModal();
        }
    });
}

if (profileForm) {
    profileForm.addEventListener('submit', handleSaveProfile);
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

function openProfileModal() {
    profileModal.classList.add('active');
    loadProfileData();
}

function closeProfileModal() {
    profileModal.classList.remove('active');
}

function loadProfileData() {
    const savedData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (!savedData) return;

    try {
        const userData = JSON.parse(savedData);
        if (displayName) displayName.textContent = userData.name || 'User';

        const age = userData.age || '--';
        const genderShort = userData.gender ? userData.gender.charAt(0).toUpperCase() : '-';
        if (displayAgeGender) displayAgeGender.textContent = `${age}, ${genderShort}`;

        // Load comorbidities
        if (userData.healthMetadata) {
            try {
                const metadata = JSON.parse(userData.healthMetadata);
                const comorbidities = metadata.comorbidities || [];

                const checkboxes = profileForm.querySelectorAll('input[name="comorbidity"]');
                checkboxes.forEach(cb => {
                    cb.checked = comorbidities.includes(cb.value);
                });
            } catch (e) {
                console.error('Error parsing healthMetadata:', e);
            }
        }
    } catch (error) {
        console.error('Error loading profile data:', error);
    }
}

async function handleSaveProfile(e) {
    e.preventDefault();

    const savedData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (!savedData) return;

    const currentUser = JSON.parse(savedData);

    // Get selected comorbidities
    const checkboxes = profileForm.querySelectorAll('input[name="comorbidity"]:checked');
    const comorbidities = Array.from(checkboxes).map(cb => cb.value);

    const healthMetadata = JSON.stringify({ comorbidities });

    const saveBtn = profileForm.querySelector('button[type="submit"]');
    const originalBtnText = saveBtn.textContent;
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    try {
        const response = await fetch(`${API_BASE_URL}/users/${currentUser.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ healthMetadata })
        });

        if (response.ok) {
            const user = await response.json();
            // Update localStorage
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
            alert('Profile updated successfully!');
            closeProfileModal();
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to update profile.');
        }
    } catch (error) {
        console.error('Save error:', error);
        alert('Unable to connect to the server.');
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = originalBtnText;
    }
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

            // Set language preference
            const language = userData.languagePreference || 'english';
            const languageInput = document.querySelector(`input[name="language"][value="${language}"]`);
            if (languageInput) {
                languageInput.checked = true;
            }

            // Render reports
            renderReports(userData);
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }
}

async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const savedData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (!savedData) return;

    const currentUser = JSON.parse(savedData);
    const formData = new FormData();
    formData.append('file', file);

    const originalBtnContent = uploadBtn.innerHTML;
    uploadBtn.disabled = true;
    uploadBtn.innerHTML = '<span class="loading-spinner"></span>';

    try {
        const response = await fetch(`${API_BASE_URL}/users/${currentUser.id}/reports`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const updatedUser = await response.json();
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
            renderReports(updatedUser);
            addMessage(`Report uploaded: ${file.name}`, 'sent');
            addMessage(`I've received your report "${file.name}". I've forwarded this to our EHR Admin.`, 'received');
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to upload report.');
        }
    } catch (error) {
        console.error('Upload error:', error);
        alert('Unable to connect to the server for upload.');
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.innerHTML = originalBtnContent;
        reportUploadInput.value = ''; // Reset input
    }
}

function renderReports(userData) {
    if (!pdfsList || !imagesList) return;

    let files = [];
    if (userData.healthMetadata) {
        try {
            const metadata = typeof userData.healthMetadata === 'string'
                ? JSON.parse(userData.healthMetadata)
                : userData.healthMetadata;
            files = metadata.files || [];
        } catch (e) {
            console.error('Error parsing reports:', e);
        }
    }

    const pdfs = files.filter(f => f.name.toLowerCase().endsWith('.pdf'));
    const images = files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name));

    // Render PDFs
    if (pdfs.length === 0) {
        pdfsList.innerHTML = '<p class="no-reports">No PDFs uploaded yet.</p>';
    } else {
        pdfsList.innerHTML = pdfs.reverse().map((report, index) => `
            <div class="report-item">
                <a href="${report.url}" target="_blank" class="report-name" title="${report.name}">${report.name}</a>
                <button class="delete-report-btn" data-type="pdf" data-url="${report.url}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
            </div>
        `).join('');
    }

    // Render Images
    if (images.length === 0) {
        imagesList.innerHTML = '<p class="no-reports">No images uploaded yet.</p>';
    } else {
        imagesList.innerHTML = images.reverse().map((report, index) => `
            <div class="report-item">
                <a href="${report.url}" target="_blank" class="report-name" title="${report.name}">${report.name}</a>
                <button class="delete-report-btn" data-type="image" data-url="${report.url}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
            </div>
        `).join('');
    }

    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-report-btn').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const url = btn.getAttribute('data-url');
            deleteFile(url);
        };
    });
}

// Language Preference Handler
async function handleLanguageChange(e) {
    const selectedLanguage = e.target.value;
    const savedData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (!savedData) return;

    const currentUser = JSON.parse(savedData);

    try {
        const response = await fetch(`${API_BASE_URL}/users/${currentUser.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ languagePreference: selectedLanguage })
        });

        if (response.ok) {
            const user = await response.json();
            // Update localStorage
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
            console.log('Language preference updated to:', selectedLanguage);

            // Optional: Provide visual feedback
            const activeLabel = e.target.closest('.language-option');
            activeLabel.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
            setTimeout(() => {
                activeLabel.style.backgroundColor = '';
            }, 500);
        } else {
            console.error('Failed to update language preference');
        }
    } catch (error) {
        console.error('Language update error:', error);
    }
}

// Initialize language listeners
function initLanguageListeners() {
    const languageInputs = document.querySelectorAll('input[name="language"]');
    languageInputs.forEach(input => {
        input.addEventListener('change', handleLanguageChange);
    });
}

async function deleteFile(fileUrl) {
    if (!confirm('Are you sure you want to delete this file?')) return;

    const savedData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (!savedData) return;

    const currentUser = JSON.parse(savedData);
    let metadata = {};
    try {
        metadata = typeof currentUser.healthMetadata === 'string'
            ? JSON.parse(currentUser.healthMetadata)
            : currentUser.healthMetadata;
    } catch (e) {
        console.error('Error parsing metadata for delete:', e);
        return;
    }

    if (!metadata.files) return;

    // Filter out the file to be deleted
    const updatedFiles = metadata.files.filter(f => f.url !== fileUrl);
    metadata.files = updatedFiles;

    const updatedHealthMetadata = JSON.stringify(metadata);

    try {
        const response = await fetch(`${API_BASE_URL}/users/${currentUser.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ healthMetadata: updatedHealthMetadata })
        });

        if (response.ok) {
            const updatedUser = await response.json();
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
            renderReports(updatedUser);
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to delete file.');
        }
    } catch (error) {
        console.error('Delete error:', error);
        alert('Unable to connect to the server.');
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
