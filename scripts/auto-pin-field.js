document.addEventListener('DOMContentLoaded', () => {
    const dobBlock = document.getElementById('dob-field-block');
    const hiddenInput = document.getElementById('dob-pin-hidden');
    const boxes = document.querySelectorAll('#pin-field .pin-box');
    const button = document.querySelector('#pin-field-block-content button');
    const errorMsg = document.getElementById('dob-pin-error');

    const CORRECT_PIN_HASH = "fcbba330679e1a7561aeab1faa73482aedd5fc30d12d7842aae4936a1394f3d7";

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

    const resetInputs = () => {
        hiddenInput.value = '';
        updateBoxes();
        hiddenInput.focus();
    };

    async function checkPinMatch() {
        const enteredPin = hiddenInput.value;
        const enteredHash = await hashString(enteredPin);

        if (enteredHash === CORRECT_PIN_HASH) {
            if (errorMsg) errorMsg.classList.add('hidden');
            navigateSections('#dob-field-block', '#success-block');
        } else {
            if (errorMsg) errorMsg.classList.remove('hidden');
            resetInputs();
        }
    }

    hiddenInput.addEventListener('input', updateBoxes);
    hiddenInput.addEventListener('focus', updateBoxes);
    hiddenInput.addEventListener('blur', () => {
        boxes.forEach(box => box.classList.remove('active'));
    });

    if (button) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            checkPinMatch();
        });
    }

    hiddenInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            checkPinMatch();
        }
    });

    const focusInput = () => {
        if (dobBlock && !dobBlock.classList.contains('hidden')) {
            setTimeout(() => hiddenInput.focus(), 100);
        }
    };

    focusInput();

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
            if (m.attributeName === 'class') focusInput();
        });
    });

    if (dobBlock) {
        observer.observe(dobBlock, { attributes: true });
    }
});

const pinWrapper = document.getElementById('pin-field-wrapper');

if (pinWrapper && hiddenInput) {
    pinWrapper.addEventListener('click', () => {
        hiddenInput.focus();
    });
}