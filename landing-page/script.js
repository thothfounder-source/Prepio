// Stripe Configuration
const stripePublicKey = 'pk_test_51TnOg4PhyVChUrUDvzFBC3Kx52Z4Y12WB1oQWHj0ii5CqwEslm1jXIHoVyromPyMq2rkRkuD7QogxnL7IXaGN59D00sTGlKjK2';
const priceId = 'price_1TnUJqPhyVChUrUDu0KytN3z';
const productName = 'Prepio - Lifetime Access';

// Initialize Stripe
const stripe = Stripe(stripePublicKey);

// Track events for analytics
function trackEvent(eventName, properties = {}) {
    console.log('Event:', eventName, properties);
    
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            'event_category': 'engagement',
            'event_label': properties.label || eventName,
            'value': properties.value || 1
        });
    }
}

// Handle pre-order button click
async function handlePreOrder(button) {
    // Show loading state
    const originalText = button.innerHTML;
    button.innerHTML = `<span style="display: flex; align-items: center; gap: 0.5rem;">
        <div class="spinner"></div>Processing...</span>`;
    button.classList.add('loading');
    button.disabled = true;
    
    try {
        // Track the pre-order attempt
        trackEvent('preorder_initiated');
        
        // Create checkout session
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                priceId: priceId,
                quantity: 1
            })
        });
        
        const session = await response.json();
        
        if (response.ok) {
            // Redirect to Stripe Checkout
            trackEvent('checkout_redirect');
            const result = await stripe.redirectToCheckout({ sessionId: session.id });
            
            if (result.error) {
                throw result.error;
            }
        } else {
            throw new Error(session.error || 'Unable to create payment session');
        }
    } catch (error) {
        console.error('Pre-order error:', error);
        trackEvent('preorder_error', { error: error.message });
        
        // Show error notification
        showErrorNotification(error.message);
        
        // Reset button
        button.innerHTML = originalText;
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// Show error notification
function showErrorNotification(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
        <div class="error-content">
            <span class="error-icon">⚠️</span>
            <div class="error-text">
                <strong>Error</strong>
                <p>${message}</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="error-close">×</button>
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
            .error-icon {
                font-size: 1.5rem;
            }
            .error-text {
                flex: 1;
            }
            .error-text strong {
                display: block;
                margin-bottom: 0.25rem;
            }
            .error-text p {
                margin: 0;
                font-size: 0.875rem;
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
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        errorDiv.style.opacity = '0';
        errorDiv.style.transform = 'translateX(100%)';
        errorDiv.style.transition = 'all 0.3s ease-out';
        setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
}

// Show success notification
function showSuccessNotification() {
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
                font-size: 1.125rem;
            }
            .success-content p {
                margin: 0;
                font-size: 0.875rem;
                opacity: 0.9;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(successDiv);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        successDiv.style.opacity = '0';
        successDiv.style.transform = 'translateX(100%)';
        successDiv.style.transition = 'all 0.3s ease-out';
        setTimeout(() => successDiv.remove(), 300);
    }, 8000);
}

// Add loading spinner styles
if (!document.querySelector('#spinner-styles')) {
    const style = document.createElement('style');
    style.id = 'spinner-styles';
    style.textContent = `
        .spinner {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .cta-button.loading {
            opacity: 0.8;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);
}

// Attach event listeners to all CTA buttons when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Hero CTA button
    const heroCta = document.getElementById('hero-cta');
    if (heroCta) {
        heroCta.addEventListener('click', function(e) {
            e.preventDefault();
            handlePreOrder(this);
        });
    }
    
    // Nav CTA button
    const navCta = document.getElementById('nav-cta');
    if (navCta) {
        navCta.addEventListener('click', function(e) {
            e.preventDefault();
            handlePreOrder(this);
        });
    }
    
    // Pricing CTA button
    const pricingCta = document.getElementById('pricing-cta');
    if (pricingCta) {
        pricingCta.addEventListener('click', function(e) {
            e.preventDefault();
            handlePreOrder(this);
        });
    }
    
    // Final CTA button
    const finalCta = document.getElementById('final-cta');
    if (finalCta) {
        finalCta.addEventListener('click', function(e) {
            e.preventDefault();
            handlePreOrder(this);
        });
    }
    
    // Also handle buttons with class 'cta-button'
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            handlePreOrder(this);
        });
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const isOpen = answer.style.maxHeight;
        
        // Close all other FAQs
        document.querySelectorAll('.faq-answer').forEach(a => {
            a.style.maxHeight = null;
        });
        
        // Toggle current FAQ
        if (!isOpen) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
});

// Header scroll effect
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for animations
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

// Observe all feature cards and testimonials
document.querySelectorAll('.feature-card, .testimonial-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(card);
});

// Track URL parameters for analytics
const urlParams = new URLSearchParams(window.location.search);
const utmSource = urlParams.get('utm_source');
const utmMedium = urlParams.get('utm_medium');
const utmCampaign = urlParams.get('utm_campaign');

if (utmSource || utmMedium || utmCampaign) {
    trackEvent('landing_page_visit', {
        source: utmSource,
        medium: utmMedium,
        campaign: utmCampaign
    });
}

// Performance tracking
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            trackEvent('performance', {
                page_load_time: Math.round(perfData.loadEventEnd - perfData.fetchStart),
                dom_ready_time: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
                first_paint: Math.round(performance.getEntriesByType('paint')[0]?.startTime || 0)
            });
        }, 1000);
    });
}

// Keyboard accessibility for FAQ
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.classList.contains('faq-question')) {
            e.preventDefault();
            e.target.click();
        }
    }
});

// Service Worker for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed:', registrationError);
            });
    });
}

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handlePreOrder
    };
}