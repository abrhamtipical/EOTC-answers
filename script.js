
// Enhanced Theme toggle functionality
let isDarkMode = false;

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    
    const themeButton = document.getElementById('themeToggle');
    const sunIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"></circle>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
    </svg>`;
    
    const moonIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>`;
    
    themeButton.innerHTML = isDarkMode ? sunIcon : moonIcon;
    
    // Add theme transition effect
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
    
    showNotification(`Switched to ${isDarkMode ? 'dark' : 'light'} mode`, 'success');
}

// Enhanced Navigation functions
function navigateToHome() {
    setActiveNavItem('home');
    showLoadingOverlay();
    setTimeout(() => {
        hideLoadingOverlay();
        showNotification('Welcome to EOTC Answers Home', 'success');
    }, 1000);
    console.log('Navigating to Home');
}

function navigateToTeachings() {
    setActiveNavItem('teachings');
    showLoadingOverlay();
    setTimeout(() => {
        hideLoadingOverlay();
        showNotification('Loading Sacred Teachings...', 'info');
    }, 1200);
    console.log('Navigating to Teachings');
}

function navigateToFAQ() {
    setActiveNavItem('faq');
    showLoadingOverlay();
    setTimeout(() => {
        hideLoadingOverlay();
        showNotification('Loading Frequently Asked Questions...', 'info');
    }, 1000);
    console.log('Navigating to FAQ');
}

function navigateToBookmarks() {
    setActiveNavItem('bookmarks');
    showLoadingOverlay();
    setTimeout(() => {
        hideLoadingOverlay();
        showNotification('Loading Your Saved Content...', 'info');
    }, 800);
    console.log('Navigating to Bookmarks');
}

function setActiveNavItem(page) {
    // Remove active class from all nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        // Add smooth transition
        item.style.transform = '';
    });
    
    // Add active class to current page nav item
    const currentNavItem = document.querySelector(`[data-page="${page}"]`);
    if (currentNavItem) {
        currentNavItem.classList.add('active');
        // Add bounce effect
        currentNavItem.style.transform = 'translateY(-2px)';
        setTimeout(() => {
            currentNavItem.style.transform = '';
        }, 200);
    }
}

// Enhanced Question submission
function submitQuestion() {
    const textarea = document.getElementById('questionInput');
    const question = textarea.value.trim();
    
    if (!question) {
        showNotification('Please enter a question to get divine wisdom', 'error');
        // Add shake effect to textarea
        textarea.classList.add('shake');
        setTimeout(() => textarea.classList.remove('shake'), 500);
        return;
    }
    
    if (question.length < 10) {
        showNotification('Please provide a more detailed question', 'error');
        return;
    }
    
    const submitButton = document.getElementById('submitQuestion');
    const originalContent = submitButton.innerHTML;
    
    // Show enhanced loading state
    submitButton.innerHTML = `
        <div class="btn-bg"></div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin">
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
        </svg>
        <span>Seeking Divine Wisdom...</span>
        <div class="btn-shine"></div>
    `;
    submitButton.disabled = true;
    submitButton.style.transform = 'scale(0.95)';
    
    // Show loading overlay
    showLoadingOverlay();
    
    // Simulate enhanced AI processing
    setTimeout(() => {
        // Reset button
        submitButton.innerHTML = originalContent;
        submitButton.disabled = false;
        submitButton.style.transform = '';
        
        // Hide loading overlay
        hideLoadingOverlay();
        
        // Clear textarea with animation
        textarea.style.transform = 'scale(0.95)';
        setTimeout(() => {
            textarea.value = '';
            textarea.style.transform = '';
        }, 200);
        
        // Show enhanced success message
        showNotification('✨ Your question has been received! Divine wisdom is being prepared...', 'success');
        
        // Simulate answer delivery
        setTimeout(() => {
            showNotification('📜 Your spiritual answer is ready! Check your answers section.', 'info');
        }, 3000);
        
        console.log('Question submitted:', question);
        
        // Add question to analytics (mock)
        trackQuestionSubmission(question);
        
    }, 2500);
}

// Enhanced Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Enhanced notification structure
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                ${getNotificationIcon(type)}
            </div>
            <div class="notification-text">${message}</div>
            <button class="notification-close" onclick="closeNotification(this)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
        <div class="notification-progress"></div>
    `;
    
    // Enhanced notification styles
    notification.style.cssText = `
        position: fixed;
        top: 5rem;
        right: 1rem;
        background: ${getNotificationBackground(type)};
        color: white;
        padding: 0;
        border-radius: 1rem;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        z-index: 100;
        animation: slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 400px;
        min-width: 300px;
        font-weight: 500;
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(20px);
        overflow: hidden;
    `;
    
    document.body.appendChild(notification);
    
    // Start progress bar animation
    const progressBar = notification.querySelector('.notification-progress');
    progressBar.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: rgba(255, 255, 255, 0.8);
        width: 100%;
        transform-origin: left;
        animation: progressShrink 4s linear;
    `;
    
    // Auto remove notification after 4 seconds
    const timeoutId = setTimeout(() => {
        removeNotification(notification);
    }, 4000);
    
    // Store timeout ID for manual close
    notification.dataset.timeoutId = timeoutId;
    
    // Add click to dismiss
    notification.addEventListener('click', (e) => {
        if (!e.target.closest('.notification-close')) {
            removeNotification(notification);
        }
    });
}

function getNotificationIcon(type) {
    const icons = {
        success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"></path></svg>',
        error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
        info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>',
        warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
    };
    return icons[type] || icons.info;
}

function getNotificationBackground(type) {
    const backgrounds = {
        success: 'linear-gradient(135deg, #10b981, #059669)',
        error: 'linear-gradient(135deg, #ef4444, #dc2626)',
        info: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        warning: 'linear-gradient(135deg, #f59e0b, #d97706)'
    };
    return backgrounds[type] || backgrounds.info;
}

function closeNotification(button) {
    const notification = button.closest('.notification');
    clearTimeout(notification.dataset.timeoutId);
    removeNotification(notification);
}

function removeNotification(notification) {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => {
        if (notification.parentNode) {
            document.body.removeChild(notification);
        }
    }, 300);
}

// Enhanced Loading overlay functions
function showLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.add('show');
    overlay.style.animation = 'fadeIn 0.3s ease-out';
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
        overlay.classList.remove('show');
    }, 300);
}

// Enhanced Banner functions
function closeBanner() {
    const banner = document.getElementById('downloadBanner');
    banner.style.animation = 'slideOutBottom 0.5s ease-out';
    setTimeout(() => {
        banner.style.display = 'none';
    }, 500);
    showNotification('Download banner closed', 'info');
}

// Enhanced Search functionality
function handleSearch() {
    const searchTerm = prompt('Enter your search term:');
    if (searchTerm && searchTerm.trim()) {
        showLoadingOverlay();
        setTimeout(() => {
            hideLoadingOverlay();
            showNotification(`Searching for "${searchTerm}"...`, 'info');
            console.log('Searching for:', searchTerm);
        }, 1000);
    } else if (searchTerm !== null) {
        showNotification('Please enter a search term', 'warning');
    }
}

// Enhanced User button functionality
function handleUserAction() {
    showLoadingOverlay();
    setTimeout(() => {
        hideLoadingOverlay();
        showNotification('User authentication coming soon! 🔐', 'info');
        console.log('User button clicked');
    }, 800);
}

// Interactive card effects
function initializeCardEffects() {
    // Stat cards interaction
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const statType = card.dataset.stat;
            showNotification(`Exploring ${statType} statistics...`, 'info');
            card.style.animation = 'pulse 0.5s ease-out';
            setTimeout(() => {
                card.style.animation = '';
            }, 500);
        });
        
        // Staggered animation on load
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate-fade-in');
    });
    
    // Action cards interaction
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
        
        // Staggered animation on load
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Feature cards interaction
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const feature = card.dataset.feature;
            showNotification(`${feature} feature coming soon! ✨`, 'info');
            card.style.animation = 'bounce 0.6s ease-out';
            setTimeout(() => {
                card.style.animation = '';
            }, 600);
        });
    });
}

// Enhanced button ripple effects
function initializeRippleEffects() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = this.querySelector('.btn-ripple');
            if (ripple) {
                ripple.style.animation = 'none';
                ripple.offsetHeight; // Trigger reflow
                ripple.style.animation = 'ripple 0.6s ease-out';
            }
        });
    });
}

// Download button functionality
function initializeDownloadButtons() {
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(button => {
        button.addEventListener('click', () => {
            const store = button.dataset.store;
            showLoadingOverlay();
            setTimeout(() => {
                hideLoadingOverlay();
                showNotification(`Redirecting to ${store === 'play' ? 'Google Play' : 'App'} Store...`, 'success');
            }, 1000);
            console.log(`Download from ${store} store clicked`);
        });
    });
}

// Analytics functions (mock)
function trackQuestionSubmission(question) {
    console.log('📊 Analytics: Question submitted', {
        timestamp: new Date().toISOString(),
        question: question,
        questionLength: question.length,
        userAgent: navigator.userAgent
    });
}

function trackPageView(page) {
    console.log('📊 Analytics: Page view', {
        page: page,
        timestamp: new Date().toISOString(),
        referrer: document.referrer
    });
}

// Enhanced animations and CSS
const enhancedStyles = document.createElement('style');
enhancedStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 20px;
    }
    
    .notification-icon {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
    }
    
    .notification-text {
        flex: 1;
        font-size: 14px;
        line-height: 1.5;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        opacity: 0.8;
        transition: opacity 0.2s ease;
        flex-shrink: 0;
    }
    
    .notification-close:hover {
        opacity: 1;
        background: rgba(255, 255, 255, 0.1);
    }
    
    .animate-fade-in {
        opacity: 0;
        transform: translateY(20px);
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    .shake {
        animation: shake 0.5s ease-in-out;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes slideOutBottom {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100%);
            opacity: 0;
        }
    }
    
    @keyframes progressShrink {
        from {
            transform: scaleX(1);
        }
        to {
            transform: scaleX(0);
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    
    @keyframes shake {
        0%, 100% {
            transform: translateX(0);
        }
        10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
        }
        20%, 40%, 60%, 80% {
            transform: translateX(5px);
        }
    }
    
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0, 0, 0);
        }
        40%, 43% {
            transform: translate3d(0, -8px, 0);
        }
        70% {
            transform: translate3d(0, -4px, 0);
        }
        90% {
            transform: translate3d(0, -2px, 0);
        }
    }
    
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .animate-spin {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`;
document.head.appendChild(enhancedStyles);

// Enhanced Event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 EOTC Answers - Enhanced Interactive Experience Loading...');
    
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Search button
    document.getElementById('searchBtn').addEventListener('click', handleSearch);
    
    // User button
    document.getElementById('userBtn').addEventListener('click', handleUserAction);
    
    // Question submission
    document.getElementById('submitQuestion').addEventListener('click', submitQuestion);
    
    // Enhanced Enter key in textarea
    document.getElementById('questionInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            submitQuestion();
        }
    });
    
    // Textarea focus effects
    const textarea = document.getElementById('questionInput');
    textarea.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    textarea.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
    });
    
    // Auto-hide download banner after 12 seconds
    setTimeout(() => {
        const banner = document.getElementById('downloadBanner');
        if (banner && banner.style.display !== 'none') {
            closeBanner();
        }
    }, 12000);
    
    // Enhanced scroll effects
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.backdropFilter = 'blur(25px)';
            header.style.borderBottomColor = 'rgba(245, 158, 11, 0.3)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(20px)';
            header.style.borderBottomColor = 'rgba(245, 158, 11, 0.2)';
        }
        
        // Parallax effect for floating elements
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
    
    // Enhanced Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.card, .action-card, .stat-card, .feature-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
    
    // Initialize enhanced interactions
    initializeCardEffects();
    initializeRippleEffects();
    initializeDownloadButtons();
    
    // Welcome message
    setTimeout(() => {
        showNotification('✨ Welcome to EOTC Answers! Your spiritual journey begins here.', 'success');
    }, 1000);
    
    // Track initial page load
    trackPageView('home');
    
    console.log('🎉 EOTC Answers - Enhanced Interactive Experience Ready!');
    
    // Add some easter eggs
    let clickCount = 0;
    document.querySelector('.logo-icon').addEventListener('click', () => {
        clickCount++;
        if (clickCount === 5) {
            showNotification('🎊 You found an Easter egg! You are blessed! 🙏', 'success');
            clickCount = 0;
        }
    });
    
    // Konami code easter egg
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            showNotification('🎮 Konami Code Activated! Divine cheat mode enabled! 😄', 'success');
            document.body.style.animation = 'rainbow 2s ease-in-out';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 2000);
            konamiCode = [];
        }
    });
});

// Enhanced Utility functions for PHP integration
window.EOTCApp = {
    // Enhanced API communication
    submitToBackend: function(endpoint, data, options = {}) {
        const defaultOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        };
        
        const config = { ...defaultOptions, ...options };
        
        showLoadingOverlay();
        
        return fetch(endpoint, config)
            .then(response => {
                hideLoadingOverlay();
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                showNotification('✅ Request completed successfully!', 'success');
                return data;
            })
            .catch(error => {
                hideLoadingOverlay();
                console.error('API Error:', error);
                showNotification('❌ Connection error. Please try again.', 'error');
                throw error;
            });
    },
    
    // Enhanced authentication
    authenticate: function(credentials) {
        showNotification('🔐 Authenticating user...', 'info');
        return this.submitToBackend('/api/auth/login', credentials);
    },
    
    // Enhanced question submission
    submitQuestion: function(question) {
        showNotification('📝 Submitting your spiritual question...', 'info');
        return this.submitToBackend('/api/questions/submit', { 
            question,
            timestamp: new Date().toISOString(),
            metadata: {
                userAgent: navigator.userAgent,
                language: navigator.language,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
        });
    },
    
    // Enhanced teachings retrieval
    getTeachings: function(filters = {}) {
        showNotification('📚 Loading sacred teachings...', 'info');
        const params = new URLSearchParams(filters);
        return fetch(`/api/teachings?${params}`)
            .then(response => response.json())
            .then(data => {
                showNotification('✨ Sacred teachings loaded successfully!', 'success');
                return data;
            });
    },
    
    // Enhanced FAQ retrieval
    getFAQs: function(filters = {}) {
        showNotification('❓ Loading frequently asked questions...', 'info');
        const params = new URLSearchParams(filters);
        return fetch(`/api/faqs?${params}`)
            .then(response => response.json())
            .then(data => {
                showNotification('💡 FAQ loaded successfully!', 'success');
                return data;
            });
    },
    
    // New: Search functionality
    search: function(query, type = 'all') {
        showNotification(`🔍 Searching for "${query}"...`, 'info');
        return this.submitToBackend('/api/search', { query, type });
    },
    
    // New: User preferences
    saveUserPreferences: function(preferences) {
        showNotification('⚙️ Saving your preferences...', 'info');
        return this.submitToBackend('/api/user/preferences', preferences);
    },
    
    // New: Bookmark management
    toggleBookmark: function(itemId, itemType) {
        showNotification('🔖 Updating bookmarks...', 'info');
        return this.submitToBackend('/api/bookmarks/toggle', { itemId, itemType });
    },
    
    // New: Contact form
    submitContact: function(contactData) {
        showNotification('📧 Sending your message...', 'info');
        return this.submitToBackend('/api/contact', contactData);
    }
};

// Add rainbow animation for easter egg
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        25% { filter: hue-rotate(90deg); }
        50% { filter: hue-rotate(180deg); }
        75% { filter: hue-rotate(270deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);
