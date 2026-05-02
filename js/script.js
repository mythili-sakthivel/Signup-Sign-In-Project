/* ================================================
   NEXTRIP - index.js
   Handles: SignUp, SignIn, Contact Form, Mobile Menu
   Uses localStorage to persist registered users
   ================================================ */

'use strict';

// ================================================
// UTILITY HELPERS
// ================================================

/** Get registered users from localStorage */
function getUsers() {
    return JSON.parse(localStorage.getItem('nextrip_users') || '[]');
}

/** Save users array to localStorage */
function saveUsers(users) {
    localStorage.setItem('nextrip_users', JSON.stringify(users));
}

/** Show error on a field */
function showError(input, errorEl, message) {
    input.classList.remove('success-field');
    input.classList.add('error');
    errorEl.textContent = message;
}

/** Show success on a field */
function showSuccess(input, errorEl) {
    input.classList.remove('error');
    input.classList.add('success-field');
    errorEl.textContent = '';
}

/** Clear field state */
function clearField(input, errorEl) {
    input.classList.remove('error', 'success-field');
    if (errorEl) errorEl.textContent = '';
}

// ================================================
// SHOW / HIDE PASSWORD TOGGLE
// ================================================

document.querySelectorAll('.toggle-password').forEach(function(btn) {
    btn.addEventListener('click', function() {
        var targetId = this.getAttribute('data-target');
        var inputEl  = document.getElementById(targetId);
        var eyeEl    = document.getElementById('eye' + targetId.charAt(0).toUpperCase() + targetId.slice(1));

        if (!inputEl) return;

        if (inputEl.type === 'password') {
            inputEl.type = 'text';
            if (eyeEl) eyeEl.textContent = '🙈';
        } else {
            inputEl.type = 'password';
            if (eyeEl) eyeEl.textContent = '👁';
        }
    });
});

// ================================================
// SIGNUP FORM VALIDATION
// ================================================

var signupForm = document.getElementById('signupForm');

if (signupForm) {

    var fields = {
        fullName:        document.getElementById('fullName'),
        signupEmail:     document.getElementById('signupEmail'),
        phone:           document.getElementById('phone'),
        city:            document.getElementById('city'),
        signupPassword:  document.getElementById('signupPassword'),
        confirmPassword: document.getElementById('confirmPassword')
    };

    var errors = {
        fullName:        document.getElementById('fullNameError'),
        signupEmail:     document.getElementById('signupEmailError'),
        phone:           document.getElementById('phoneError'),
        city:            document.getElementById('cityError'),
        signupPassword:  document.getElementById('signupPasswordError'),
        confirmPassword: document.getElementById('confirmPasswordError')
    };

    var signupSuccess = document.getElementById('signupSuccess');

    // --- Inline / real-time validation ---

    fields.fullName.addEventListener('input', function() {
        validateFullName(this.value.trim());
    });

    fields.signupEmail.addEventListener('input', function() {
        validateEmail(this.value.trim(), fields.signupEmail, errors.signupEmail);
    });

    fields.phone.addEventListener('input', function() {
        // Allow only digits while typing
        this.value = this.value.replace(/\D/g, '');
        validatePhone(this.value.trim());
    });

    fields.city.addEventListener('input', function() {
        validateCity(this.value.trim());
    });

    fields.signupPassword.addEventListener('input', function() {
        validatePassword(this.value.trim());
        // Re-validate confirm if already typed
        if (fields.confirmPassword.value) {
            validateConfirmPassword(fields.confirmPassword.value.trim(), this.value.trim());
        }
    });

    fields.confirmPassword.addEventListener('input', function() {
        validateConfirmPassword(this.value.trim(), fields.signupPassword.value.trim());
    });

    // --- Validation Functions ---

    function validateFullName(value) {
        if (value === '') {
            showError(fields.fullName, errors.fullName, '⚠ Full name is required.');
            return false;
        }
        if (value.length < 3) {
            showError(fields.fullName, errors.fullName, '⚠ Name must be at least 3 characters.');
            return false;
        }
        if (!/^[a-zA-Z\s]+$/.test(value)) {
            showError(fields.fullName, errors.fullName, '⚠ Name can only contain letters and spaces.');
            return false;
        }
        showSuccess(fields.fullName, errors.fullName);
        return true;
    }

    function validateEmail(value, inputEl, errorEl) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value === '') {
            showError(inputEl, errorEl, '⚠ Email address is required.');
            return false;
        }
        if (!emailRegex.test(value)) {
            showError(inputEl, errorEl, '⚠ Enter a valid email (e.g. example@mail.com).');
            return false;
        }
        showSuccess(inputEl, errorEl);
        return true;
    }

    function validatePhone(value) {
        if (value === '') {
            showError(fields.phone, errors.phone, '⚠ Phone number is required.');
            return false;
        }
        if (!/^\d{10}$/.test(value)) {
            showError(fields.phone, errors.phone, '⚠ Phone number must be exactly 10 digits.');
            return false;
        }
        showSuccess(fields.phone, errors.phone);
        return true;
    }

    function validateCity(value) {
        if (value === '') {
            showError(fields.city, errors.city, '⚠ City / Location is required.');
            return false;
        }
        if (!/^[a-zA-Z\s]+$/.test(value)) {
            showError(fields.city, errors.city, '⚠ City must contain only alphabets.');
            return false;
        }
        showSuccess(fields.city, errors.city);
        return true;
    }

    function validatePassword(value) {
        if (value === '') {
            showError(fields.signupPassword, errors.signupPassword, '⚠ Password is required.');
            return false;
        }
        if (value.length < 8) {
            showError(fields.signupPassword, errors.signupPassword, '⚠ Password must be at least 8 characters.');
            return false;
        }
        if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
            showError(fields.signupPassword, errors.signupPassword, '⚠ Password must contain letters and numbers.');
            return false;
        }
        showSuccess(fields.signupPassword, errors.signupPassword);
        return true;
    }

    function validateConfirmPassword(value, passwordValue) {
        if (value === '') {
            showError(fields.confirmPassword, errors.confirmPassword, '⚠ Please confirm your password.');
            return false;
        }
        if (value !== passwordValue) {
            showError(fields.confirmPassword, errors.confirmPassword, '⚠ Passwords do not match.');
            return false;
        }
        showSuccess(fields.confirmPassword, errors.confirmPassword);
        return true;
    }

    // --- Form Submit ---

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        signupSuccess.textContent = '';

        var name     = fields.fullName.value.trim();
        var email    = fields.signupEmail.value.trim();
        var phone    = fields.phone.value.trim();
        var city     = fields.city.value.trim();
        var password = fields.signupPassword.value.trim();
        var confirm  = fields.confirmPassword.value.trim();

        // Run all validations
        var v1 = validateFullName(name);
        var v2 = validateEmail(email, fields.signupEmail, errors.signupEmail);
        var v3 = validatePhone(phone);
        var v4 = validateCity(city);
        var v5 = validatePassword(password);
        var v6 = validateConfirmPassword(confirm, password);

        if (!v1 || !v2 || !v3 || !v4 || !v5 || !v6) return;

        // Check if email already registered
        var users = getUsers();
        var alreadyExists = users.some(function(u) {
            return u.email.toLowerCase() === email.toLowerCase();
        });

        if (alreadyExists) {
            showError(fields.signupEmail, errors.signupEmail, '⚠ This email is already registered. Please Sign In.');
            return;
        }

        // Save user
        users.push({
            fullName: name,
            email: email.toLowerCase(),
            phone: phone,
            city: city,
            password: password   // Note: In production, passwords must be hashed server-side
        });
        saveUsers(users);

        // Success feedback
        signupSuccess.textContent = '✓ Account created successfully! Redirecting to Sign In…';
        signupForm.reset();

        // Clear success-field highlights
        Object.values(fields).forEach(function(f) { f.classList.remove('success-field', 'error'); });

        // Redirect after short delay
        setTimeout(function() {
            window.location.href = 'SignIn.html';
        }, 1800);
    });
}

// ================================================
// SIGNIN FORM VALIDATION
// ================================================

var signinForm = document.getElementById('signinForm');

if (signinForm) {

    var signinEmailEl    = document.getElementById('signinEmail');
    var signinPasswordEl = document.getElementById('signinPassword');
    var signinEmailErr   = document.getElementById('signinEmailError');
    var signinPassErr    = document.getElementById('signinPasswordError');
    var signinGenErr     = document.getElementById('signinGeneralError');
    var signinSuccessEl  = document.getElementById('signinSuccess');

    // Real-time inline validation
    signinEmailEl.addEventListener('input', function() {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var v = this.value.trim();
        if (v === '') {
            showError(signinEmailEl, signinEmailErr, '⚠ Email is required.');
        } else if (!emailRegex.test(v)) {
            showError(signinEmailEl, signinEmailErr, '⚠ Enter a valid email address.');
        } else {
            showSuccess(signinEmailEl, signinEmailErr);
        }
    });

    signinPasswordEl.addEventListener('input', function() {
        var v = this.value.trim();
        if (v === '') {
            showError(signinPasswordEl, signinPassErr, '⚠ Password is required.');
        } else {
            showSuccess(signinPasswordEl, signinPassErr);
        }
    });

    signinForm.addEventListener('submit', function(e) {
        e.preventDefault();
        signinGenErr.textContent = '';
        signinSuccessEl.textContent = '';

        var email    = signinEmailEl.value.trim();
        var password = signinPasswordEl.value.trim();

        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var hasError   = false;

        // Validate email
        if (email === '') {
            showError(signinEmailEl, signinEmailErr, '⚠ Email is required.');
            hasError = true;
        } else if (!emailRegex.test(email)) {
            showError(signinEmailEl, signinEmailErr, '⚠ Enter a valid email address.');
            hasError = true;
        } else {
            showSuccess(signinEmailEl, signinEmailErr);
        }

        // Validate password
        if (password === '') {
            showError(signinPasswordEl, signinPassErr, '⚠ Password is required.');
            hasError = true;
        } else {
            showSuccess(signinPasswordEl, signinPassErr);
        }

        if (hasError) return;

        // Check credentials against stored users
        var users = getUsers();
        var matchedUser = users.find(function(u) {
            return u.email === email.toLowerCase() && u.password === password;
        });

        if (!matchedUser) {
            // Check if email exists at all
            var emailExists = users.some(function(u) { return u.email === email.toLowerCase(); });
            if (!emailExists) {
                signinGenErr.textContent = '⚠ No account found with this email. Please Sign Up first.';
            } else {
                signinGenErr.textContent = '⚠ Incorrect password. Please try again.';
                showError(signinPasswordEl, signinPassErr, '');
                signinPasswordEl.classList.add('error');
            }
            return;
        }

        // Store current session
        localStorage.setItem('nextrip_current_user', JSON.stringify(matchedUser));

        signinSuccessEl.textContent = '✓ Welcome back, ' + matchedUser.fullName + '! Redirecting…';

        setTimeout(function() {
            window.location.href = 'travelapp.html';
        }, 1500);
    });
}

// ================================================
// CONTACT FORM VALIDATION (travelapp.html)
// ================================================

var contactForm = document.getElementById('contactForm');

if (contactForm) {

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var nameInput    = document.getElementById('contactName');
        var emailInput   = document.getElementById('contactEmail');
        var messageInput = document.getElementById('contactMessage');
        var nameErr      = document.getElementById('nameError');
        var emailErr     = document.getElementById('emailError');
        var messageErr   = document.getElementById('messageError');
        var successMsg   = document.getElementById('successMsg');

        // Reset
        [nameInput, emailInput, messageInput].forEach(function(el) {
            clearField(el, null);
        });
        nameErr.textContent = emailErr.textContent = messageErr.textContent = '';
        successMsg.textContent = '';

        var isValid = true;

        // Name
        var name = nameInput.value.trim();
        if (name === '') {
            showError(nameInput, nameErr, '⚠ Please enter your name.');
            isValid = false;
        } else if (name.length < 3) {
            showError(nameInput, nameErr, '⚠ Name must be at least 3 characters.');
            isValid = false;
        } else {
            showSuccess(nameInput, nameErr);
        }

        // Email
        var email = emailInput.value.trim();
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '') {
            showError(emailInput, emailErr, '⚠ Please enter your email.');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            showError(emailInput, emailErr, '⚠ Enter a valid email address.');
            isValid = false;
        } else {
            showSuccess(emailInput, emailErr);
        }

        // Message
        var message = messageInput.value.trim();
        if (message === '') {
            showError(messageInput, messageErr, '⚠ Please enter your message.');
            isValid = false;
        } else if (message.length < 10) {
            showError(messageInput, messageErr, '⚠ Message must be at least 10 characters.');
            isValid = false;
        } else {
            showSuccess(messageInput, messageErr);
        }

        if (isValid) {
            successMsg.textContent = '✓ Message sent! We will contact you soon.';
            contactForm.reset();
            [nameInput, emailInput, messageInput].forEach(function(el) {
                el.classList.remove('success-field');
            });
            setTimeout(function() { successMsg.textContent = ''; }, 5000);
        }
    });
}

// ================================================
// MOBILE MENU TOGGLE (travelapp.html)
// ================================================

var menuToggle = document.getElementById('menuToggle');
var mobileMenu = document.getElementById('mobileMenu');

if (menuToggle && mobileMenu) {

    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    document.querySelectorAll('.mobile-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    document.addEventListener('click', function(event) {
        var inMenu   = mobileMenu.contains(event.target);
        var onToggle = menuToggle.contains(event.target);
        if (!inMenu && !onToggle && mobileMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    });
}

// ================================================
// SMOOTH SCROLL
// ================================================

document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href && href !== '#') {
            e.preventDefault();
            var target = document.querySelector(href);
            if (target) {
                if (menuToggle) menuToggle.classList.remove('active');
                if (mobileMenu) mobileMenu.classList.remove('active');
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

console.log('NEXTRIP ✈ - Adventure Awaits You');
