// Navigation Toggle for Mobile
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar Background on Scroll
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Form Handling
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            company: formData.get('company'),
            name: formData.get('name'),
            email: formData.get('email'),
            issues: formData.getAll('issues')
        };

        // Validate form
        if (!data.company || !data.name || !data.email) {
            alert('必須項目を入力してください。');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('正しいメールアドレスを入力してください。');
            return;
        }

        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = '送信中...';
        submitButton.disabled = true;

        try {
            // Simulate API call (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // In production, replace this with actual API call:
            // const response = await fetch('/api/contact', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(data)
            // });
            
            // Show success message
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';
            
            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Reset form
            contactForm.reset();
            
            // Log form data (in production, this would be sent to server)
            console.log('Form submitted:', data);
            
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('送信に失敗しました。しばらくしてから再度お試しください。');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
}

// Lazy Loading for Images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Number Counter Animation
const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = Math.round(target);
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, 16);
};

// Animate on Scroll (Intersection Observer)
const animateOnScroll = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animate counters in risk cards
                if (entry.target.classList.contains('risk-card')) {
                    const counterElement = entry.target.querySelector('.risk-number-value[data-target]');
                    if (counterElement && !counterElement.classList.contains('animated')) {
                        const target = parseInt(counterElement.getAttribute('data-target'));
                        counterElement.classList.add('animated');
                        animateCounter(counterElement, target);
                    }
                }
                
                // Animate counters in stats section
                if (entry.target.classList.contains('stat-item')) {
                    const counterElement = entry.target.querySelector('.stat-number[data-target]');
                    if (counterElement && !counterElement.classList.contains('animated')) {
                        const target = parseInt(counterElement.getAttribute('data-target'));
                        counterElement.classList.add('animated');
                        animateCounter(counterElement, target);
                    }
                }
            }
        });
    }, observerOptions);

    // Observe cards and sections
    document.querySelectorAll('.issue-card, .risk-card, .solution-card, .trust-card, .stat-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
};

// Initialize animations when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateOnScroll);
} else {
    animateOnScroll();
}

// Performance: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Arrow positioning to point at "無料診断を受ける" button
const positionArrow = () => {
    const arrow = document.querySelector('.hero-arrow');
    const ctaButton = document.getElementById('ctaButton'); // 無料診断を受けるボタン
    const secondaryButton = document.querySelector('.btn-secondary'); // サービスを見るボタン
    const heroCtaWrapper = document.querySelector('.hero-cta-wrapper');
    
    if (!arrow) {
        console.warn('Arrow element not found');
        return;
    }
    
    // Hide arrow on mobile devices (768px and below)
    if (window.innerWidth <= 768) {
        arrow.style.display = 'none';
        arrow.style.visibility = 'hidden';
        return;
    }
    
    if (!ctaButton || !secondaryButton || !heroCtaWrapper) {
        console.warn('CTA elements not found, hiding arrow');
        arrow.style.display = 'none';
        return;
    }
    
    if (arrow && ctaButton && secondaryButton && heroCtaWrapper) {
        const wrapperRect = heroCtaWrapper.getBoundingClientRect();
        const ctaButtonRect = ctaButton.getBoundingClientRect();
        const secondaryButtonRect = secondaryButton.getBoundingClientRect();
        
        // Calculate positions relative to wrapper
        const ctaButtonCenterX = ctaButtonRect.left + ctaButtonRect.width / 2 - wrapperRect.left;
        const ctaButtonCenterY = ctaButtonRect.top + ctaButtonRect.height / 2 - wrapperRect.top;
        const secondaryButtonCenterX = secondaryButtonRect.left + secondaryButtonRect.width / 2 - wrapperRect.left;
        const secondaryButtonTop = secondaryButtonRect.top - wrapperRect.top;
        
        // Position arrow to the left of "無料診断を受ける" button, pointing right towards it
        // 矢印は「無料診断を受ける」ボタンの左側に配置
        const arrowX = ctaButtonRect.left - wrapperRect.left - 150; // ボタンの左150px
        const arrowY = ctaButtonCenterY + 10; // ボタンの中心より10px下
        
        arrow.style.right = 'auto';
        arrow.style.left = `${arrowX}px`;
        arrow.style.top = `${arrowY}px`;
        arrow.style.transform = 'translateY(-50%)';
        arrow.style.display = 'block';
        arrow.style.visibility = 'visible';
        arrow.style.opacity = '0.9';
        
        // Calculate angle to point at "無料診断を受ける" button center (pointing right)
        const deltaX = ctaButtonCenterX - arrowX;
        const deltaY = ctaButtonCenterY - arrowY;
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        
        // Apply rotation to point at button (pointing right towards button)
        const arrowSvg = arrow.querySelector('.arrow-svg');
        if (arrowSvg) {
            // 右を指すように角度を調整（SVGは反転しているので調整が必要）
            arrowSvg.style.transform = `scaleX(-1) rotate(${angle + 90}deg)`;
        }
    }
};

// Position arrow on load and resize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(positionArrow, 200);
    });
} else {
    setTimeout(positionArrow, 200);
}
window.addEventListener('resize', debounce(positionArrow, 100));

// Optimized scroll handler with smooth hero decoration animations
const handleScroll = debounce(() => {
    const scrollY = window.pageYOffset;
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    const heroRect = heroSection.getBoundingClientRect();
    const heroHeight = heroSection.offsetHeight;
    const windowHeight = window.innerHeight;
    
    // Calculate scroll progress (0 to 1) based on hero section visibility
    let scrollProgress = 0;
    if (heroRect.top < windowHeight && heroRect.bottom > 0) {
        scrollProgress = Math.max(0, Math.min(1, (windowHeight - heroRect.top) / (windowHeight + heroHeight)));
    }
    
    const leftDecoration = document.querySelector('.hero-decoration-left');
    const rightDecoration = document.querySelector('.hero-decoration-right');
    const leftGrid = document.querySelector('.hero-decoration-left .decoration-grid');
    const rightGrid = document.querySelector('.hero-decoration-right .decoration-grid');
    
    // Left decoration: moves down and rotates slightly
    if (leftDecoration && leftGrid) {
        const leftTranslateY = scrollY * 0.5; // Slower movement
        const leftTranslateX = scrollY * 0.2;
        const leftRotate = -15 + scrollY * 0.05; // Slight rotation on scroll
        const leftScale = 1 + scrollProgress * 0.1; // Slight scale increase
        
        leftDecoration.style.transform = `translateY(${leftTranslateY}px)`;
        leftGrid.style.transform = `rotate(${leftRotate}deg) translate(${leftTranslateX}px, ${leftTranslateY * 0.3}px) scale(${leftScale})`;
        
        // Animate the pattern itself
        const patternOffset = scrollY * 0.3;
        leftGrid.style.backgroundPosition = `${patternOffset}px ${patternOffset}px, ${patternOffset + 20}px ${patternOffset + 20}px`;
    }
    
    // Right decoration: moves up and rotates slightly
    if (rightDecoration && rightGrid) {
        const rightTranslateY = -scrollY * 0.5; // Moves up
        const rightTranslateX = -scrollY * 0.2;
        const rightRotate = -15 - scrollY * 0.05; // Rotates opposite direction
        const rightScale = 1 + scrollProgress * 0.1;
        
        rightDecoration.style.transform = `translateY(${rightTranslateY}px)`;
        rightGrid.style.transform = `rotate(${rightRotate}deg) translate(${rightTranslateX}px, ${rightTranslateY * 0.3}px) scale(${rightScale})`;
        
        // Animate the pattern itself
        const patternOffset = -scrollY * 0.3;
        rightGrid.style.backgroundPosition = `${patternOffset}px ${patternOffset}px, ${patternOffset + 20}px ${patternOffset + 20}px`;
    }
}, 5); // Reduced debounce for smoother animation

window.addEventListener('scroll', handleScroll, { passive: true });

// Error Handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// Console log for debugging (remove in production)
console.log('KIBAN website loaded successfully');

