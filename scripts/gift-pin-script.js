document.addEventListener('DOMContentLoaded', () => {
    const giftSection = document.getElementById('view-gifts');
    const hiddenInput = document.getElementById('gift-pin-hidden');
    const boxes = document.querySelectorAll('#gift-pin-field .gift-pin-box');
    const button = document.querySelector('#gift-pin-field-block-content button');
    const errorMsg = document.getElementById('gift-pin-error');
    const giftWrapper = document.getElementById('gift-pin-wrapper');

    const GIFT_PIN_HASH = "fcbba330679e1a7561aeab1faa73482aedd5fc30d12d7842aae4936a1394f3d7";

    async function hashString(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    const updateBoxes = () => {
        const val = hiddenInput.value.replace(/\D/g, '');
        hiddenInput.value = val;

        boxes.forEach((box, index) => {
            box.textContent = val[index] || '';
            if (index === val.length && document.activeElement === hiddenInput) {
                box.classList.add('active');
            } else {
                box.classList.remove('active');
            }
        });
    };

    async function checkGiftPinMatch() {
        const enteredPin = hiddenInput ? hiddenInput.value : '';
        const enteredHash = await hashString(enteredPin);

        if (enteredHash === GIFT_PIN_HASH) {
            if (errorMsg) errorMsg.classList.add('hidden'); // Clear error on success
            navigateSections('#view-gifts', '#gift-reveal-block');
        } else {
            if (errorMsg) errorMsg.classList.remove('hidden'); // Show error on failure
            if (hiddenInput) {
                hiddenInput.value = '';
                updateBoxes();
                hiddenInput.focus();
            }
        }
    }

    // Input & Focus Listeners
    if (hiddenInput) {
        hiddenInput.addEventListener('input', updateBoxes);
        hiddenInput.addEventListener('focus', updateBoxes);
        hiddenInput.addEventListener('blur', () => {
            boxes.forEach(box => box.classList.remove('active'));
        });
    }

    // Tap/Click forwarder
    if (giftWrapper && hiddenInput) {
        giftWrapper.addEventListener('click', () => {
            hiddenInput.focus();
        });
    }

    // Submission Listeners
    if (button) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            checkGiftPinMatch();
        });
    }

    if (giftWrapper) {
        giftWrapper.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                checkGiftPinMatch();
            }
        });
    }

    // Auto-focus when section opens
    const focusInput = () => {
        if (giftSection && !giftSection.classList.contains('hidden') && hiddenInput) {
            setTimeout(() => hiddenInput.focus(), 100);
        }
    };

    focusInput();

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
            if (m.attributeName === 'class') focusInput();
        });
    });

    if (giftSection) {
        observer.observe(giftSection, { attributes: true });
    }
});