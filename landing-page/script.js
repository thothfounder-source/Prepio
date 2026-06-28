// Initialize Stripe (replace with your actual public key in .env)
const stripe = Stripe('pk_test_51TnOg4PhyVChUrUDvzFBC3Kx52Z4Y12WB1oQWHj0ii5CqwEslm1jXIHoVyromPyMq2rkRkuD7QogxnL7IXaGN59D00sTGlKjK2');

// Configuration
const CONFIG = {
    stripePublicKey: 'pk_test_51TnOg4PhyVChUrUDvzFBC3Kx52Z4Y12WB1oQWHj0ii5CqwEslm1jXIHoVyromPyMq2rkRkuD7QogxnL7IXaGN59D00sTGlKjK2', // Will be replaced by environment variable
    productPrice: 2900, // $29.00 in cents
    productName: 'Prepio - Early Bird Pre-Order',
    successUrl: window.location.origin + '/success.html',
    cancelUrl: window.location.origin + '/index.html'
};

// DOM Elements
const ctaButtons = document.querySelectorAll('#hero-cta, #nav-cta, #pricing-cta, #final-cta');
const faqItems = document.querySelectorAll('.faq-item');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCTAButtons();
    initializeFAQ();
    initializeScrollEffects();
    trackPageView();
});

// CTA Button Initialization
function initializeCTAButtons() {
    ctaButtons.forEach(button => {
        button.addEventListener('click', handlePreOrder);
    });
}

// Handle Pre-Order Process
async function handlePreOrder(event) {
    event.preventDefault();
    
    const button = event.target;
    const originalText = button.innerHTML;
    
    // Show loading state
    button.innerHTML = '<span style="display: flex; align-items: center; gap: 0.5rem;"><div class="spinner"></div>Processing...</span>';
    button.classList.add('loading');
    button.disabled = true;
    
    try {
        // Track the pre-order attempt
        trackEvent('preorder_initiated');
        
        // Create checkout session
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                product: 'interviewready-preorder',
                amount: CONFIG.productPrice,
                name: CONFIG.productName,
                successUrl: CONFIG.successUrl,
                cancelUrl: CONFIG.cancelUrl
            }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const session = await response.json();
        
        // Redirect to Stripe Checkout
        const { error } = await stripe.redirectToCheckout({
            sessionId: session.id
        });
        
        if (error) {
            throw error;
        }
        
    } catch (error) {
        console.error('Pre-order error:', error);
        
        // Track the error
        trackEvent('preorder_error', { error: error.message });
        
        // Show user-friendly error message
        showErrorMessage(getErrorMessage(error));
        
        // Reset button
        button.innerHTML = originalText;
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// Error message handling
function getErrorMessage(error) {
    if (error.message.includes('network') || error.message.includes('fetch')) {
        return 'Network error. Please check your connection and try again.';
    } else if (error.message.includes('session')) {
        return 'Unable to create payment session. Please try again in a moment.';
    } else {
        return 'Something went wrong. Please try again or contact support if the problem persists.';
    }
}

function showErrorMessage(message) {
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
        <div class="error-content">
            <span class="error-icon">⚠️</span>
            <span class="error-text">${message}</span>
            <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add error styles if not already present
    if (!document.querySelector('#error-styles')) {
        const style = document.createElement('style');
        style.id = 'error-styles';
        style.textContent = `
            .error-notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: #fee2e2;
                border: 1px solid #fca5a5;
                border-radius: 8px;
                padding: 1rem;
                max-width: 400px;
                z-index: 1001;
                animation: slideIn 0.3s ease-out;
            }
            .error-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                color: #991b1b;
            }
            .error-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #991b1b;
                padding: 0;
                margin-left: auto;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .spinner {
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255,255,255,0.3);
                border-top: 2px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}

// FAQ Functionality
function initializeFAQ() {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faq => faq.classList.remove('active'));
            
            // Open clicked item if it wasn't already open
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Scroll Effects
function initializeScrollEffects() {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header background on scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .testimonial-card, .price-card').forEach(el => {
        observer.observe(el);
    });
}

// Analytics and Tracking
function trackPageView() {
    // Google Analytics (if available)
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: 'InterviewReady AI Landing Page',
            page_location: window.location.href,
            send_page_view: true
        });
    }
    
    // Custom analytics
    trackEvent('page_view', {
        page: 'landing',
        timestamp: new Date().toISOString(),
        referrer: document.referrer,
        user_agent: navigator.userAgent
    });
}

function trackEvent(eventName, properties = {}) {
    console.log('Event:', eventName, properties);
    
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: 'engagement',
            event_label: properties.label || eventName,
            value: properties.value || 1
        });
    }
    
    // You can add other analytics providers here
    // Example: Mixpanel, Amplitude, etc.
    
    // Send to your backend for custom analytics
    if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/track', JSON.stringify({
            event: eventName,
            properties: {
                ...properties,
                timestamp: new Date().toISOString(),
                page_url: window.location.href
            }
        }));
    }
}

// Utility Functions
function formatPrice(cents) {
    return `$${(cents / 100).toFixed(2)}`;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Performance monitoring
function measurePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                trackEvent('performance', {
                    page_load_time: Math.round(perfData.loadEventEnd - perfData.fetchStart),
                    dom_ready_time: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
                    first_paint: Math.round(performance.getEntriesByType('paint')[0]?.startTime || 0)
                });
            }, 0);
        });
    }
}

measurePerformance();

// Keyboard accessibility
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.classList.contains('faq-question')) {
            e.preventDefault();
            e.target.click();
        }
    }
});

// Handle URL parameters for tracking
function handleURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Track referral source
    const utm_source = urlParams.get('utm_source');
    const utm_medium = urlParams.get('utm_medium');
    const utm_campaign = urlParams.get('utm_campaign');
    
    if (utm_source || utm_medium || utm_campaign) {
        trackEvent('referral_source', {
            source: utm_source,
            medium: utm_medium,
            campaign: utm_campaign
        });
    }
    
    // Handle success/cancel redirects from Stripe
    if (urlParams.get('success') === 'true') {
        showSuccessMessage();
    } else if (urlParams.get('canceled') === 'true') {
        showCancelMessage();
    }
}

function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-notification';
    successDiv.innerHTML = `
        <div class="success-content">
            <span class="success-icon">🎉</span>
            <div>
                <h3>Pre-order successful!</h3>
                <p>Check your email for confirmation. You'll get early access when we launch!</p>
            </div>
        </div>
    `;
    
    // Add success styles
    if (!document.querySelector('#success-styles')) {
        const style = document.createElement('style');
        style.id = 'success-styles';
        style.textContent = `
            .success-notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: #ecfdf5;
                border: 1px solid #6ee7b7;
                border-radius: 12px;
                padding: 1.5rem;
                max-width: 400px;
                z-index: 1001;
                animation: slideIn 0.3s ease-out;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            }
            .success-content {
                display: flex;
                align-items: flex-start;
                gap: 1rem;
                color: #065f46;
            }
            .success-icon {
                font-size: 2rem;
            }
            .success-content h3 {
                margin: 0 0 0.5rem 0;
                font-size: 1.1rem;
                font-weight: 600;
            }
            .success-content p {
                margin: 0;
                font-size: 0.9rem;
                opacity: 0.8;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(successDiv);
    
    // Track successful conversion
    trackEvent('preorder_completed');
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (successDiv.parentElement) {
            successDiv.remove();
        }
    }, 10000);
}

function showCancelMessage() {
    trackEvent('preorder_cancelled');
    
    // Optionally show a message encouraging to try again
    setTimeout(() => {
        if (confirm('Ready to secure your early bird pricing? Click OK to try again.')) {
            document.querySelector('#hero-cta').scrollIntoView({ behavior: 'smooth' });
        }
    }, 1000);
}

// Initialize URL parameter handling
handleURLParameters();

// Error boundary for unhandled errors
window.addEventListener('error', function(e) {
    trackEvent('javascript_error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno
    });
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handlePreOrder,
        trackEvent,
        validateEmail,
        formatPrice
    };
}