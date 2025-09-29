/**
 * Validates the profile form data.
 * @param {object} formData - The current state of the form data.
 * @param {string} formData.firstName - The user's first name.
 * @param {string} formData.lastName - The user's last name.
 * @param {string} formData.photoUrl - URL to the user's profile picture.
 * @param {number|string} formData.age - The user's age.
 * @param {string} formData.gender - The user's selected gender.
 * @param {string} formData.bio - A short user biography.
 * @param {string[]} formData.skills - An array of the user's skills.
 * @returns {object} An errors object. If the object is empty, the form is valid.
 */
export const validateProfile = (formData) => {
    const errors = {};

    // --- Personal Information ---

    // First Name Validation
    if (!formData.firstName?.trim()) {
        errors.firstName = 'First name is required';
    }

    // Last Name Validation
    if (!formData.lastName?.trim()) {
        errors.lastName = 'Last name is required';
    }

    // Photo URL Validation (IMPROVED REGEX)
    // This regex is more robust and covers more valid URL cases.
    const urlPattern = new RegExp(/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'i');
    if (!formData.photoUrl) {
        errors.photoUrl = 'Photo URL is required';
    } else if (!urlPattern.test(formData.photoUrl)) {
        errors.photoUrl = 'Please enter a valid URL';
    }

    // Age Validation
    if (!formData.age) {
        errors.age = 'Age is required';
    } else if (isNaN(formData.age) || formData.age < 18 || formData.age > 120) {
        errors.age = 'Please enter a valid age (18-120)';
    }

    // Gender Validation
    if (!formData.gender) {
        errors.gender = 'Please select a gender';
    }
    
    // --- Profile Information ---

    // Bio Validation (IMPROVED: Checks length of trimmed value)
    // if (!formData.bio?.trim()) {
    //     // errors.bio = 'Bio is required';
    // } else if (formData.bio.trim().length > 280) {
    //     errors.bio = 'Bio cannot exceed 280 characters';
    // }

    // Skills Validation (CORRECTED: Now handles an array of strings)
    if (Array.isArray(formData.skills)) {
        const invalidSkill = formData.skills.find(
            (skill) => skill.trim() && !/^[a-zA-Z0-9\s./-]+$/.test(skill)
        );
        if (invalidSkill) {
            errors.skills = 'Skills can only contain letters, numbers, and symbols like "-", ".", "/".';
        }
    }

    return errors;
};