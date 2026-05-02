/* ================================================
   NEXTRIP - JavaScript
   Form Validation ONLY
   ================================================ */

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileButtons = document.querySelectorAll('.mobile-btn');

menuToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

// Close mobile menu when link clicked
mobileButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const isClickInMenu = mobileMenu.contains(event.target);
    const isClickOnToggle = menuToggle.contains(event.target);
    
    if (!isClickInMenu && !isClickOnToggle && mobileMenu.classList.contains('active')) {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
    }
});

// ================================================
// FORM VALIDATION
// ================================================

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form inputs
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    // Get error message displays
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const successMsg = document.getElementById('successMsg');
    
    // Reset all errors
    nameError.textContent = '';
    emailError.textContent = '';
    messageError.textContent = '';
    successMsg.textContent = '';
    
    nameInput.classList.remove('error');
    emailInput.classList.remove('error');
    messageInput.classList.remove('error');
    
    // Validation flags
    let isValid = true;
    
    // Name validation
    const name = nameInput.value.trim();
    if (name === '') {
        nameError.textContent = 'Please enter your name';
        nameInput.classList.add('error');
        isValid = false;
    } else if (name.length < 3) {
        nameError.textContent = 'Name must be at least 3 characters';
        nameInput.classList.add('error');
        isValid = false;
    }
    
    // Email validation
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        emailError.textContent = 'Please enter your email';
        emailInput.classList.add('error');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        emailError.textContent = 'Please enter a valid email address';
        emailInput.classList.add('error');
        isValid = false;
    }
    
    // Message validation
    const message = messageInput.value.trim();
    if (message === '') {
        messageError.textContent = 'Please enter your message';
        messageInput.classList.add('error');
        isValid = false;
    } else if (message.length < 10) {
        messageError.textContent = 'Message must be at least 10 characters';
        messageInput.classList.add('error');
        isValid = false;
    }
    
    // If all valid, show success
    if (isValid) {
        successMsg.textContent = '✓ Message sent successfully! We will contact you soon.';
        contactForm.reset();
        
        // Clear success message after 5 seconds
        setTimeout(() => {
            successMsg.textContent = '';
        }, 5000);
    }
});

// Smooth scroll links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                // Close mobile menu if open
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

console.log('NEXTRIP - Adventure Awaits You');
