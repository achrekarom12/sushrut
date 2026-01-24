// Signup Form Handler
const signupForm = document.getElementById('signup-form');

if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
}

function handleSignup(e) {
    e.preventDefault();

    const mobile = document.getElementById('mobile').value.trim();
    const password = document.getElementById('password').value;

    // Basic validation
    if (!mobile || !password) {
        alert('Please fill in all fields');
        return;
    }

    // Validate mobile number (10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
        alert('Please enter a valid 10-digit mobile number');
        return;
    }

    // Validate password length
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }

    // Success - In a real app, you would send this to your backend
    console.log('Signup Data:', {
        mobile: mobile,
        password: password
    });

    alert('Signup successful! Welcome to Sushrut.');

    // Optionally clear the form
    signupForm.reset();
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
