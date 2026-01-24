// PWA Installation and Service Worker Registration
let deferredPrompt;
const installBanner = document.getElementById('install-banner');
const installButton = document.getElementById('install-button');
const dismissButton = document.getElementById('dismiss-button');

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js');
            console.log('Service Worker registered successfully:', registration.scope);
            updateServiceWorkerStatus('Active ✓');
            updateCacheStatus('Enabled ✓');
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            updateServiceWorkerStatus('Not Available');
            updateCacheStatus('Not Available');
        }
    });
} else {
    updateServiceWorkerStatus('Not Supported');
    updateCacheStatus('Not Supported');
}

// Install Prompt Handler
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBanner.classList.remove('hidden');
});

installButton.addEventListener('click', async () => {
    if (!deferredPrompt) {
        return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);

    deferredPrompt = null;
    installBanner.classList.add('hidden');
});

dismissButton.addEventListener('click', () => {
    installBanner.classList.add('hidden');
});

// App Installed Handler
window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    installBanner.classList.add('hidden');
});

// Online/Offline Status
const onlineStatus = document.getElementById('online-status');
const statusText = document.getElementById('status-text');
const networkStatus = document.getElementById('network-status');

function updateOnlineStatus() {
    const isOnline = navigator.onLine;

    if (isOnline) {
        onlineStatus.classList.remove('offline');
        onlineStatus.classList.add('online');
        statusText.textContent = 'Online';
        networkStatus.textContent = 'Online ✓';
    } else {
        onlineStatus.classList.remove('online');
        onlineStatus.classList.add('offline');
        statusText.textContent = 'Offline';
        networkStatus.textContent = 'Offline';
    }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus();

// Demo Interactive Section
const demoInput = document.getElementById('demo-input');
const demoButton = document.getElementById('demo-button');
const demoOutput = document.getElementById('demo-output');
const outputContent = demoOutput.querySelector('.output-content');

demoButton.addEventListener('click', handleDemoSubmit);
demoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleDemoSubmit();
    }
});

function handleDemoSubmit() {
    const message = demoInput.value.trim();

    if (!message) {
        return;
    }

    // Show output with animation
    demoOutput.classList.remove('hidden');
    outputContent.innerHTML = `
        <strong>You said:</strong> "${message}"<br>
        <strong>Response:</strong> Message received! This PWA is working perfectly. 🎉
    `;

    // Add a subtle animation
    demoOutput.style.animation = 'none';
    setTimeout(() => {
        demoOutput.style.animation = '';
    }, 10);

    // Clear input
    demoInput.value = '';
}

// Update PWA Status Functions
function updateServiceWorkerStatus(status) {
    const swStatus = document.getElementById('sw-status');
    if (swStatus) {
        swStatus.textContent = status;
    }
}

function updateCacheStatus(status) {
    const cacheStatus = document.getElementById('cache-status');
    if (cacheStatus) {
        cacheStatus.textContent = status;
    }
}

// Add smooth scroll behavior for any future anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add intersection observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards for scroll animations
document.querySelectorAll('.feature-card, .info-card, .demo-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(card);
});

// Log PWA capabilities
console.log('PWA Capabilities:', {
    serviceWorker: 'serviceWorker' in navigator,
    notifications: 'Notification' in window,
    pushManager: 'PushManager' in window,
    cacheStorage: 'caches' in window,
    indexedDB: 'indexedDB' in window,
    geolocation: 'geolocation' in navigator
});
