
// Theme toggle functionality
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
}

// Navigation functions
function navigateToHome() {
    setActiveNavItem('home');
    // Add your navigation logic here
    console.log('Navigating to Home');
}

function navigateToTeachings() {
    setActiveNavItem('teachings');
    // Add your navigation logic here
    console.log('Navigating to Teachings');
}

function navigateToFAQ() {
    setActiveNavItem('faq');
    // Add your navigation logic here
    console.log('Navigating to FAQ');
}

function navigateToBookmarks() {
    setActiveNavItem('bookmarks');
    // Add your navigation logic here
    console.log('Navigating to Bookmarks');
}

function setActiveNavItem(page) {
    // Remove active class from all nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    // Add active class to current page nav item
    const currentNavItem = document.querySelector(`[onclick="navigateTo${page.charAt(0).toUpperCase() + page.slice(1)}()"]`);
    if (currentNavItem) {
        currentNavItem.classList.add('active');
    }
}

// Question submission
function submitQuestion() {
    const textarea = document.getElementById('questionInput');
    const question = textarea.value.trim();
    
    if (!question) {
        showNotification('Please enter a question', 'error');
        return;
    }
    
    const submitButton = document.getElementById('submitQuestion');
    const originalContent = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin">
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
        </svg>
        <span>Getting Divine Wisdom...</span>
    `;
    submitButton.disabled = true;
    
    // Simulate API call (replace with your actual API endpoint)
    setTimeout(() => {
        // Reset button
        submitButton.innerHTML = originalContent;
        submitButton.disabled = false;
        
        // Clear textarea
        textarea.value = '';
        
        // Show success message
        showNotification('Question submitted successfully!', 'success');
        
        // Here you would typically handle the API response
        console.log('Question submitted:', question);
    }, 2000);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 5rem;
        right: 1rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        z-index: 100;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Close download banner
function closeBanner() {
    const banner = document.getElementById('downloadBanner');
    banner.style.animation = 'slideOutBottom 0.3s ease-out';
    setTimeout(() => {
        banner.style.display = 'none';
    }, 300);
}

// Search functionality
function handleSearch() {
    console.log('Search button clicked');
    showNotification('Search functionality coming soon!', 'info');
}

// User button functionality
function handleUserAction() {
    console.log('User button clicked');
    showNotification('User authentication coming soon!', 'info');
}

// Add animation styles for notifications
const style = document.createElement('style');
style.textContent = `
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
document.head.appendChild(style);

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Search button
    document.getElementById('searchBtn').addEventListener('click', handleSearch);
    
    // User button
    document.getElementById('userBtn').addEventListener('click', handleUserAction);
    
    // Question submission
    document.getElementById('submitQuestion').addEventListener('click', submitQuestion);
    
    // Enter key in textarea
    document.getElementById('questionInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            submitQuestion();
        }
    });
    
    // Auto-hide download banner after 10 seconds
    setTimeout(() => {
        const banner = document.getElementById('downloadBanner');
        if (banner && banner.style.display !== 'none') {
            closeBanner();
        }
    }, 10000);
    
    // Add scroll effects
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.9)';
        }
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.card, .action-card, .stat-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    console.log('EOTC Answers app initialized successfully!');
});

// Utility functions for PHP integration
window.EOTCApp = {
    // Function to handle form submissions to PHP backend
    submitToBackend: function(endpoint, data) {
        return fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            showNotification('An error occurred. Please try again.', 'error');
        });
    },
    
    // Function to handle user authentication
    authenticate: function(credentials) {
        return this.submitToBackend('/api/auth/login', credentials);
    },
    
    // Function to submit questions
    submitQuestion: function(question) {
        return this.submitToBackend('/api/questions/submit', { question });
    },
    
    // Function to get teachings
    getTeachings: function(filters = {}) {
        const params = new URLSearchParams(filters);
        return fetch(`/api/teachings?${params}`)
            .then(response => response.json());
    },
    
    // Function to get FAQs
    getFAQs: function(filters = {}) {
        const params = new URLSearchParams(filters);
        return fetch(`/api/faqs?${params}`)
            .then(response => response.json());
    }
};
