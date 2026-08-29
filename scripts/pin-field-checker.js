document.addEventListener('DOMContentLoaded', () => {
    const hiddenInput = document.getElementById('dob-pin-hidden');
    const button = document.querySelector('#pin-field-block-content button');
    const errorMsg = document.getElementById('dob-pin-error');
    const pinWrapper = document.getElementById('pin-field-wrapper');

    const CORRECT_PIN_HASH = "fcbba330679e1a7561aeab1faa73482aedd5fc30d12d7842aae4936a1394f3d7";

    async function hashString(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async function checkPinMatch() {
        const enteredPin = hiddenInput ? hiddenInput.value : '';
        const enteredHash = await hashString(enteredPin);

        if (enteredHash === CORRECT_PIN_HASH) {
            // Re-hide error message if previously shown
            if (errorMsg) errorMsg.classList.add('hidden');

            navigateSections('#dob-field-block', '#success-block');
        } else {
            // Show error message on mismatch
            if (errorMsg) errorMsg.classList.remove('hidden');

            // Clear input and refocus
            if (hiddenInput) {
                hiddenInput.value = '';
                hiddenInput.dispatchEvent(new Event('input')); // Triggers box clearing
                hiddenInput.focus();
            }
        }
    }

    if (button) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            checkPinMatch();
        });
    }

    if (pinWrapper) {
        pinWrapper.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                checkPinMatch();
            }
        });
    }
});