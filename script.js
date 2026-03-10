// ===== Custom Cursor with Photo Particles =====
const customCursor = document.querySelector('.custom-cursor');
const cursorParticles = document.querySelector('.cursor-particles');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let particleCount = 0;
const maxParticles = 15;

// Photo URLs for particles
const particlePhotos = [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=100&q=80',
    'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&q=80',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=100&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=100&q=80'
];

// Update cursor position
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Smooth cursor movement
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    
    if (customCursor) {
        customCursor.style.left = cursorX + 'px';
        customCursor.style.top = cursorY + 'px';
    }
    
    // Create photo particles occasionally
    if (Math.random() > 0.7 && particleCount < maxParticles) {
        createPhotoParticle(mouseX, mouseY);
    }
});

// Create photo particle
function createPhotoParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'photo-particle';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    
    const randomPhoto = particlePhotos[Math.floor(Math.random() * particlePhotos.length)];
    particle.style.backgroundImage = `url(${randomPhoto})`;
    particle.style.width = Math.random() * 40 + 20 + 'px';
    particle.style.height = particle.style.width;
    particle.style.borderRadius = '50%';
    particle.style.position = 'fixed';
    particle.style.backgroundSize = 'cover';
    particle.style.backgroundPosition = 'center';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9997';
    particle.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
    particle.style.opacity = '0.8';
    
    const randomX = (Math.random() - 0.5) * 200;
    const randomY = (Math.random() - 0.5) * 200;
    const randomRotate = Math.random() * 360;
    const duration = Math.random() * 2 + 1;
    
    particle.style.setProperty('--random-x', randomX + 'px');
    
    if (cursorParticles) {
        cursorParticles.appendChild(particle);
        particleCount++;
    }
    
    particle.animate([
        {
            transform: `translate(0, 0) rotate(0deg) scale(1)`,
            opacity: 0.8
        },
        {
            transform: `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg) scale(0.3)`,
            opacity: 0
        }
    ], {
        duration: duration * 1000,
        easing: 'ease-out'
    }).onfinish = () => {
        particle.remove();
        particleCount--;
    };
}

// Cursor hover effects
const hoverElements = document.querySelectorAll('a, button, .gallery-item, .theme-btn');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (customCursor) customCursor.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        if (customCursor) customCursor.classList.remove('hover');
    });
});

// Hide custom cursor on mobile
if (window.innerWidth <= 768) {
    if (customCursor) customCursor.style.display = 'none';
    document.body.style.cursor = 'auto';
}

// ===== Theme Toggle =====
const themeBtn = document.getElementById('themeBtn');
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light-mode';
body.classList.add(currentTheme);

// Update theme button icon based on current theme
updateThemeIcon();

themeBtn.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    body.classList.toggle('dark-mode');
    
    const theme = body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
    localStorage.setItem('theme', theme);
    
    updateThemeIcon();
});

function updateThemeIcon() {
    const isDark = body.classList.contains('dark-mode');
    // Icon visibility is handled by CSS, but we can add additional logic here if needed
}

// ===== Load Footer =====
function loadFooter() {
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading footer:', error);
            document.getElementById('footer-container').innerHTML = '<footer><p>Footer could not be loaded.</p></footer>';
        });
}

// Load footer when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooter);
} else {
    loadFooter();
}

// ===== Smooth Scroll for Navigation Links =====
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

// ===== Animated Counter for Stats =====
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (target === 500 ? '+' : target === 200 ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (target === 500 ? '+' : target === 200 ? '+' : '');
        }
    }, 16);
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Animate counters when stats section is visible
            if (entry.target.classList.contains('stat-number')) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        }
    });
}, observerOptions);

// Observe all elements that need animation
document.addEventListener('DOMContentLoaded', () => {
    // Observe gallery items
    document.querySelectorAll('.gallery-item').forEach(item => {
        observer.observe(item);
    });
    
    // Observe stat numbers
    document.querySelectorAll('.stat-number').forEach(stat => {
        observer.observe(stat);
    });
    
    // Observe about section
    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
        observer.observe(aboutSection);
    }
});

// ===== Parallax Effect for Hero Images =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImages = document.querySelectorAll('.floating-image');
    
    heroImages.forEach((img, index) => {
        const speed = 0.5 + (index * 0.1);
        img.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===== Gallery Item Hover Effects =====
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

// ===== CTA Button Click Handler =====
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', () => {
        const gallerySection = document.getElementById('gallery');
        if (gallerySection) {
            gallerySection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

// ===== Navbar Scroll Effect =====
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// ===== Background Slideshow Animation =====
const bgSlides = document.querySelectorAll('.bg-slide');
let currentSlide = 0;

if (bgSlides.length > 0) {
    function changeBackgroundSlide() {
        bgSlides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % bgSlides.length;
        bgSlides[currentSlide].classList.add('active');
    }
    
    // Change slide every 5 seconds
    setInterval(changeBackgroundSlide, 5000);
}

// ===== Enhanced Globe Animation on Scroll =====
const globeSection = document.querySelector('.globe-section');
if (globeSection) {
    const globeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const globe = entry.target.querySelector('.globe');
                if (globe) {
                    globe.style.animationPlayState = 'running';
                }
            } else {
                const globe = entry.target.querySelector('.globe');
                if (globe) {
                    globe.style.animationPlayState = 'paused';
                }
            }
        });
    }, { threshold: 0.3 });
    
    globeObserver.observe(globeSection);
}

// ===== Gallery Slider Pause on Hover =====
const gallerySlider = document.querySelector('.gallery-slider');
if (gallerySlider) {
    gallerySlider.addEventListener('mouseenter', () => {
        gallerySlider.style.animationPlayState = 'paused';
    });
    
    gallerySlider.addEventListener('mouseleave', () => {
        gallerySlider.style.animationPlayState = 'running';
    });
}

// ===== Image Loading Animation =====
function loadImagesWithAnimation() {
    const images = document.querySelectorAll('.gallery-image, .floating-image, .globe-photo');
    
    images.forEach((img, index) => {
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
        }
    });
}

// Initialize image loading
loadImagesWithAnimation();

// ===== Add Entering/Exiting Animation for Gallery Items =====
const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
        } else {
            // Optional: Add exit animation when scrolling past
            entry.target.style.opacity = '0.5';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px'
});

document.querySelectorAll('.gallery-item').forEach(item => {
    galleryObserver.observe(item);
});

// ===== Add Mouse Move Parallax to Globe =====
const globeWrapper = document.querySelector('.globe-wrapper');
if (globeWrapper) {
    globeWrapper.addEventListener('mousemove', (e) => {
        const rect = globeWrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        const globe = globeWrapper.querySelector('.globe');
        if (globe) {
            globe.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
    });
    
    globeWrapper.addEventListener('mouseleave', () => {
        const globe = globeWrapper.querySelector('.globe');
        if (globe) {
            globe.style.transform = 'rotateY(0deg)';
        }
    });
}

// ===== Add Ripple Effect to CTA Button =====
if (ctaButton) {
    ctaButton.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

// ===== Add CSS for Ripple Effect =====
const style = document.createElement('style');
style.textContent = `
    .cta-button {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== Performance Optimization: Lazy Load Images =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.style.backgroundImage = `url(${img.dataset.src})`;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    // Observe images with data-src attribute for lazy loading
    document.querySelectorAll('[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== Responsive Gallery Slider =====
function adjustGallerySlider() {
    const gallerySlider = document.querySelector('.gallery-slider');
    if (gallerySlider && window.innerWidth <= 768) {
        // On mobile, make slider slower and adjust item sizes
        gallerySlider.style.animationDuration = '40s';
    } else if (gallerySlider) {
        gallerySlider.style.animationDuration = '30s';
    }
}

window.addEventListener('resize', adjustGallerySlider);
adjustGallerySlider();

// ===== Touch Support for Mobile =====
if ('ontouchstart' in window) {
    document.body.style.cursor = 'auto';
    if (customCursor) customCursor.style.display = 'none';
}

console.log('Luxury Photography Website - All scripts loaded successfully!');

