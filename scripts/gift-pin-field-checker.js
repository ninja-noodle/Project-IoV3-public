document.addEventListener('DOMContentLoaded', () => {
    const giftSection = document.getElementById('view-gifts');
    const hiddenInput = document.getElementById('gift-pin-hidden');
    const boxes = document.querySelectorAll('#gift-pin-field .gift-pin-box');
    const button = document.querySelector('#gift-pin-field-block-content button');
    const errorMsg = document.getElementById('gift-pin-error');
    const giftWrapper = document.getElementById('gift-pin-wrapper');

    const CORRECT_PIN_HASH = "63cf52215b7514d8dcdc9bfabd47aef052acce6dbc732367e4e0d97c8c2ad01a";
    let isChecking = false;

    async function hashString(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    const updateBoxes = () => {
        if (!hiddenInput) return;
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

    const resetInputs = () => {
        if (!hiddenInput) return;
        hiddenInput.value = '';
        updateBoxes();
        hiddenInput.focus();
    };

    async function checkGiftPinMatch(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (isChecking) return;
        isChecking = true;

        const enteredPin = hiddenInput ? hiddenInput.value.replace(/\D/g, '') : '';

        // Corrected to 6 digits for the Gift field
        if (enteredPin.length < 6) {
            if (errorMsg) errorMsg.classList.remove('hidden');
            resetInputs();
            isChecking = false;
            return;
        }

        const enteredHash = await hashString(enteredPin);

        if (enteredHash === CORRECT_PIN_HASH) {
            if (errorMsg) errorMsg.classList.add('hidden');
            setTimeout(async () => {
                await window.decryptSection('#view-gifts-content');
                navigateSections('#view-gifts', '#view-gifts-content', false);
                document.body.style.padding = '0';
                document.documentElement.style.padding = '0';
            }, 500);
        } else {
            if (errorMsg) errorMsg.classList.remove('hidden');
            resetInputs();
            isChecking = false;
        }
    }

    if (hiddenInput) {
        hiddenInput.addEventListener('input', updateBoxes);
        hiddenInput.addEventListener('focus', updateBoxes);
        hiddenInput.addEventListener('blur', () => {
            boxes.forEach(box => box.classList.remove('active'));
        });

        hiddenInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                checkGiftPinMatch(e);
            }
        });
    }

    if (giftWrapper && hiddenInput) {
        giftWrapper.addEventListener('click', () => {
            hiddenInput.focus();
        });
    }

    if (button) {
        button.setAttribute('type', 'button');
        button.addEventListener('click', (e) => {
            checkGiftPinMatch(e);
        });
    }

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