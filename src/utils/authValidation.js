/**
 * Validates the sign-in or sign-up form data.
 * @param {object} formData - The current state of the form fields.
 * @param {boolean} isSignInForm - True if the form is for sign-in, false for sign-up.
 * @returns {object} An object containing any validation errors.
 */
export const validateAuthForm = (formData, isSignInForm) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // --- Email Validation ---
    if (!formData.email.trim()) {
        errors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
        errors.email = "Please enter a valid email address.";
    }

    // --- Password Validation ---
    if (!formData.password) {
        errors.password = "Password is required.";
    } else if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters long.";
    }

    // --- Sign-Up Specific Validation ---
    if (!isSignInForm) {
        if (!formData.firstName.trim()) {
            errors.firstName = "First name is required.";
        }
        if (!formData.lastName.trim()) {
            errors.lastName = "Last name is required.";
        }
    }

    return errors;
};
