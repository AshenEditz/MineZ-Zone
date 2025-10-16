// Animations & Scroll Effects

// Scroll to top
window.addEventListener('scroll', () => {
    const scrollBtn = document.getElementById('scrollToTop');
    if (scrollBtn) {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    }
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Animate on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
});

// Mobile menu toggle
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const overlay = document.getElementById('mobileMenuOverlay');
    
    if (navLinks) navLinks.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
}

// Close mobile menu on link click
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const menu = document.getElementById('navLinks');
            const overlay = document.getElementById('mobileMenuOverlay');
            if (menu && menu.classList.contains('active')) {
                menu.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
            }
        });
    });
});

// NEW: Toggle chat window
function toggleChatWindow() {
    const chatWindow = document.getElementById('chatWindow');
    const chatToggleBtn = document.getElementById('chatToggleBtn');
    const notification = document.getElementById('chatNotification');
    
    if (chatWindow && chatToggleBtn) {
        if (chatWindow.classList.contains('active')) {
            chatWindow.classList.remove('active');
            chatToggleBtn.innerHTML = '<i class="fas fa-comments"></i>';
        } else {
            chatWindow.classList.add('active');
            chatToggleBtn.innerHTML = '<i class="fas fa-times"></i>';
            if (notification) notification.style.display = 'none';
        }
    }
}

// Legacy support
function toggleChat() {
    toggleChatWindow();
}

console.log('✨ Animations loaded!');