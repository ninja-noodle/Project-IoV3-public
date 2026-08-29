const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// document.addEventListener('DOMContentLoaded', () => {
//     const initialSection = document.querySelector('#name-field-block');

//     if (initialSection) {
//         initialSection.classList.remove('hidden');

//         requestAnimationFrame(() => {
//             requestAnimationFrame(() => {
//                 initialSection.classList.add('page', 'animate-scale-in');

//                 const nameInput = initialSection.querySelector('input');
//                 if (nameInput) nameInput.focus();
//             });
//         });
//     }
// });

/**
 * Universal section navigator supporting optional message sequences
 * @param {string|HTMLElement} currentSection - Selector or DOM Element to exit
 * @param {string|HTMLElement} nextSection - Selector or DOM Element to enter
 * @param {boolean} showLoader - Display loader phase (default: true)
 * @param {string|null} messagesSelector - CSS selector for messages container (optional)
 * @param {number} messageDelay - Duration in ms for each message display (default: 1200ms)
 */
async function navigateSections(
    currentSection,
    nextSection,
    showLoader = true,
    messagesSelector = null,
    messageDelay = 1800
) {
    const currentEl = typeof currentSection === 'string' ? document.querySelector(currentSection) : currentSection;
    const nextEl = typeof nextSection === 'string' ? document.querySelector(nextSection) : nextSection;
    const loaderContainer = document.querySelector('#loading-container') || document.querySelector('.loader');
    const messageContainer = messagesSelector ? document.querySelector(messagesSelector) : null;

    if (!currentEl || !nextEl) return;

    const revealNextSection = () => {
        nextEl.classList.remove('hidden');
        nextEl.classList.add('page', 'animate-scale-in');

        const firstInput = nextEl.querySelector('input');
        if (firstInput) firstInput.focus();
    };

    // 1. Scale-out exit animation
    currentEl.classList.remove('animate-scale-in');
    currentEl.classList.add('page');
    void currentEl.offsetWidth; // Force CSS reflow
    currentEl.classList.add('animate-scale-out');

    await delay(350); // Wait for scale-out to complete

    currentEl.classList.add('hidden');
    currentEl.classList.remove('animate-scale-out', 'page');

    // 2. Loader and message sequence phase
    if (showLoader && loaderContainer) {
        loaderContainer.classList.remove('hidden');

        if (messageContainer) {
            messageContainer.classList.remove('hidden');
            const messages = messageContainer.querySelectorAll('.status-msg');

            for (let i = 0; i < messages.length; i++) {
                messages[i].classList.remove('hidden');
                await delay(messageDelay);
                messages[i].classList.add('hidden');
            }

            messageContainer.classList.add('hidden');
        } else {
            await delay(1000); // Default loader wait time when no text is provided
        }

        loaderContainer.classList.add('hidden');
    }

    // 3. Reveal next section
    revealNextSection();
}

// Button Click Event: Trigger gradient + transition with sequential text
document.querySelector('#success-block-content button').addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.add('has-gradient');

    // Pass '#loading-messages' selector as the 4th argument
    navigateSections('#success-block', '#age-counter-block', true, '#loading-messages');
});