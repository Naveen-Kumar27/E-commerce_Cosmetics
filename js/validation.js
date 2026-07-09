/**
 * Ziva Cosmetics - Central Form Validation Script
 * Implements real-time and submission-time validation with rich visual feedback.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Validation Rules & RegEx
    const REGEX = {
        name: /^[A-Za-z\s]{3,50}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        mobile: /^[6-9]\d{9}$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/
    };

    const ERROR_MESSAGES = {
        fullName: 'Please enter a valid name (3-50 letters/spaces only).',
        email: 'Please enter a valid email address (e.g., name@example.com).',
        mobile: 'Please enter a valid 10-digit mobile number (starts with 6-9).',
        phone: 'Please enter a valid 10-digit phone number.',
        dob: 'You must be at least 13 years old to register.',
        gender: 'Please select your gender.',
        password: 'Password must be at least 8 characters, containing 1 uppercase, 1 lowercase, 1 number, and 1 special character.',
        confirmPassword: 'Passwords do not match.',
        address: 'Please enter a complete address (minimum 10 characters).',
        subject: 'Subject must be at least 5 characters long.',
        message: 'Message must be at least 15 characters long.',
        terms: 'You must agree to the Terms & Conditions.',
        payment: 'Please select a payment method.'
    };

    // Helper: Show error below an input element
    const showFieldError = (inputElement, message) => {
        if (!inputElement) return;

        // Visual outline highlights
        inputElement.classList.add('border-red-500', 'focus:ring-red-500');
        inputElement.classList.remove('border-green-500', 'focus:ring-green-500', 'border-gray-300');

        // Check if error element already exists
        let errorId = `${inputElement.id || inputElement.name}-error`;
        let errorElement = document.getElementById(errorId);

        if (!errorElement) {
            errorElement = document.createElement('p');
            errorElement.id = errorId;
            errorElement.className = 'error-msg text-red-500 text-xs mt-1 transition-all duration-300 opacity-0 -translate-y-2';
            
            // Insert it after the input element or its parent wrapper (e.g. for custom checkboxes/radios)
            if (inputElement.type === 'checkbox' || inputElement.type === 'radio') {
                const parent = inputElement.closest('div') || inputElement.parentElement;
                parent.appendChild(errorElement);
            } else {
                inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
            }
        }

        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        
        // Trigger micro-animation
        setTimeout(() => {
            errorElement.classList.remove('opacity-0', '-translate-y-2');
            errorElement.classList.add('opacity-100', 'translate-y-0');
        }, 10);
    };

    // Helper: Clear error from an input element
    const clearFieldError = (inputElement) => {
        if (!inputElement) return;

        inputElement.classList.remove('border-red-500', 'focus:ring-red-500', 'border-gray-300');
        inputElement.classList.add('border-green-500', 'focus:ring-green-500');

        let errorId = `${inputElement.id || inputElement.name}-error`;
        let errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.classList.remove('opacity-100', 'translate-y-0');
            errorElement.classList.add('opacity-0', '-translate-y-2');
            setTimeout(() => {
                errorElement.remove();
            }, 300);
        }
    };

    // Helper: Reset field styling to neutral
    const resetFieldStyle = (inputElement) => {
        if (!inputElement) return;
        inputElement.classList.remove('border-red-500', 'focus:ring-red-500', 'border-green-500', 'focus:ring-green-500');
        inputElement.classList.add('border-gray-300');
        
        let errorId = `${inputElement.id || inputElement.name}-error`;
        let errorElement = document.getElementById(errorId);
        if (errorElement) errorElement.remove();
    };

    // Generic Validator Function
    const validateField = (field) => {
        const id = field.id || field.name;
        const val = field.value.trim();

        if (field.required && !val && field.type !== 'checkbox' && field.type !== 'radio') {
            showFieldError(field, 'This field is required.');
            return false;
        }

        switch (id) {
            case 'fullName':
                if (!REGEX.name.test(val)) {
                    showFieldError(field, ERROR_MESSAGES.fullName);
                    return false;
                }
                break;
            case 'email':
                if (!REGEX.email.test(val)) {
                    showFieldError(field, ERROR_MESSAGES.email);
                    return false;
                }
                break;
            case 'mobile':
            case 'phone':
                // In forgot password, mobile is optional
                if (id === 'mobile' && field.closest('#forgotPasswordForm') && !val) {
                    clearFieldError(field);
                    return true;
                }
                if (!REGEX.mobile.test(val)) {
                    showFieldError(field, id === 'phone' ? ERROR_MESSAGES.phone : ERROR_MESSAGES.mobile);
                    return false;
                }
                break;
            case 'dob':
                if (val) {
                    const dobDate = new Date(val);
                    const today = new Date();
                    let age = today.getFullYear() - dobDate.getFullYear();
                    const m = today.getMonth() - dobDate.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
                        age--;
                    }
                    if (age < 13 || dobDate > today) {
                        showFieldError(field, ERROR_MESSAGES.dob);
                        return false;
                    }
                } else if (field.required) {
                    showFieldError(field, 'Date of birth is required.');
                    return false;
                }
                break;
            case 'password':
                if (field.closest('#signupForm')) {
                    if (!REGEX.password.test(val)) {
                        showFieldError(field, ERROR_MESSAGES.password);
                        return false;
                    }
                } else {
                    if (!val) {
                        showFieldError(field, 'Password is required.');
                        return false;
                    }
                }
                break;
            case 'confirmPassword':
                const pwField = document.getElementById('password');
                if (pwField && val !== pwField.value.trim()) {
                    showFieldError(field, ERROR_MESSAGES.confirmPassword);
                    return false;
                }
                break;
            case 'address':
            case 'deliveryAddress':
                if (val && val.length < 10) {
                    showFieldError(field, ERROR_MESSAGES.address);
                    return false;
                }
                break;
            case 'subject':
                if (val.length < 5) {
                    showFieldError(field, ERROR_MESSAGES.subject);
                    return false;
                }
                break;
            case 'message':
                if (val.length < 15) {
                    showFieldError(field, ERROR_MESSAGES.message);
                    return false;
                }
                break;
            case 'terms':
                if (!field.checked) {
                    showFieldError(field, ERROR_MESSAGES.terms);
                    return false;
                }
                break;
        }

        clearFieldError(field);
        return true;
    };

    // Create a beautiful premium success modal/banner
    const showSuccessToast = (title, message, callback) => {
        const modalContainer = document.createElement('div');
        modalContainer.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 opacity-0';
        
        const modal = document.createElement('div');
        modal.className = 'bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center transform scale-90 transition-transform duration-300';
        
        modal.innerHTML = `
            <div class="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
            <h4 class="text-2xl font-bold text-gray-800 mb-2">${title}</h4>
            <p class="text-gray-600 mb-6">${message}</p>
            <button class="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 shadow-md">
                OK
            </button>
        `;

        modalContainer.appendChild(modal);
        document.body.appendChild(modalContainer);

        // Trigger animations
        setTimeout(() => {
            modalContainer.classList.remove('opacity-0');
            modalContainer.classList.add('opacity-100');
            modal.classList.remove('scale-90');
            modal.classList.add('scale-100');
        }, 10);

        const closeModal = () => {
            modalContainer.classList.remove('opacity-100');
            modalContainer.classList.add('opacity-0');
            modal.classList.remove('scale-100');
            modal.classList.add('scale-90');
            setTimeout(() => {
                modalContainer.remove();
                if (callback) callback();
            }, 300);
        };

        modal.querySelector('button').addEventListener('click', closeModal);
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) closeModal();
        });
    };

    // Initialize listeners for a specific form
    const attachFormValidation = (form, onSubmitHandler) => {
        if (!form) return;

        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Real-time validation on blur
            input.addEventListener('blur', () => {
                if (input.type !== 'submit' && input.type !== 'reset' && input.type !== 'button') {
                    validateField(input);
                }
            });

            // Input correction visual response
            input.addEventListener('input', () => {
                if (input.classList.contains('border-red-500')) {
                    validateField(input);
                }
            });

            if (input.type === 'checkbox' || input.type === 'radio') {
                input.addEventListener('change', () => {
                    validateField(input);
                });
            }
        });

        // Form Submit Handler
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            // Validate all text & standard inputs
            inputs.forEach(input => {
                if (input.type !== 'submit' && input.type !== 'reset' && input.type !== 'button') {
                    if (!validateField(input)) {
                        isValid = false;
                    }
                }
            });

            // Custom validation for gender radio buttons
            if (form.id === 'signupForm') {
                const genders = form.querySelectorAll('input[name="gender"]');
                const checkedGender = Array.from(genders).some(g => g.checked);
                if (!checkedGender && genders.length > 0) {
                    showFieldError(genders[0], ERROR_MESSAGES.gender);
                    isValid = false;
                } else if (genders.length > 0) {
                    clearFieldError(genders[0]);
                }
            }

            // Custom validation for payment method radio buttons
            if (form.id === 'checkoutForm') {
                const payments = form.querySelectorAll('input[name="payment"]');
                const checkedPayment = Array.from(payments).some(p => p.checked);
                if (!checkedPayment && payments.length > 0) {
                    showFieldError(payments[0], ERROR_MESSAGES.payment);
                    isValid = false;
                } else if (payments.length > 0) {
                    clearFieldError(payments[0]);
                }
            }

            if (isValid) {
                onSubmitHandler(form);
            } else {
                // Scroll to the first error field
                const firstError = form.querySelector('.border-red-500');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
            }
        });

        // Reset Handler
        form.addEventListener('reset', () => {
            setTimeout(() => {
                inputs.forEach(input => resetFieldStyle(input));
            }, 10);
        });
    };

    // 2. Wiring Up Individual Forms

    // A. Sign Up Form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        attachFormValidation(signupForm, (form) => {
            const name = document.getElementById('fullName').value.trim();
            showSuccessToast(
                'Success!',
                `Welcome to Ziva Cosmetics, ${name}! Your account has been created successfully. Redirecting you to login...`,
                () => {
                    window.location.href = 'login.html';
                }
            );
        });
    }

    // B. Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        attachFormValidation(loginForm, (form) => {
            const email = document.getElementById('email').value.trim();
            showSuccessToast(
                'Welcome Back!',
                `You have logged in successfully as ${email}. redirecting to home...`,
                () => {
                    window.location.href = 'index.html';
                }
            );
        });
    }

    // C. Forgot Password Form
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        attachFormValidation(forgotPasswordForm, (form) => {
            const email = document.getElementById('email').value.trim();
            showSuccessToast(
                'Link Sent!',
                `A password reset link has been sent to ${email} if it is registered in our database.`,
                () => {
                    window.location.href = 'login.html';
                }
            );
        });
    }

    // D. Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        attachFormValidation(contactForm, (form) => {
            const name = document.getElementById('fullName').value.trim();
            showSuccessToast(
                'Message Sent!',
                `Thank you for contacting us, ${name}! We have received your query and will get back to you within 24 hours.`,
                () => {
                    form.reset();
                }
            );
        });
    }

    // E. Checkout Form (Cart Checkout)
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        attachFormValidation(checkoutForm, (form) => {
            // Success redirect to order success page
            // Generate a random order ID and save checkout details to sessionStorage for the success page
            const name = document.getElementById('fullName').value.trim();
            const orderId = 'ZIVA-' + Date.now().toString().slice(-6) + '-' + Math.floor(Math.random() * 1000);
            
            sessionStorage.setItem('lastOrderId', orderId);
            sessionStorage.setItem('lastOrderName', name);
            
            // Redirect
            window.location.href = 'order-success.html';
        });
    }
});
