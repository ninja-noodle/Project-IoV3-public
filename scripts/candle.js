let currentCandles = 1;
let isAdding = false; // Prevent double-clicks / rapid tap spam
const TARGET_AGE = 25;
const addCandleBtn = document.querySelector('#add-candle-btn');
const candleContainer = document.querySelector('#candle-container');
const candleCountSpan = document.querySelector('#candle-count');
const candleTemplate = document.querySelector('#candle-template');

// Helper function to insert a candle clone
function appendCandle() {
    if (candleTemplate && candleContainer) {
        const clone = candleTemplate.content.cloneNode(true);
        candleContainer.appendChild(clone);
    }
}

// Instantiate the initial 1st candle on section load
appendCandle();

// Button click listener with debounce lock
if (addCandleBtn) {
    addCandleBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Guard clause: ignore clicks during the 200ms cooldown window
        if (isAdding) return;
        isAdding = true;

        currentCandles++;

        // 1. Add SVG candle element
        appendCandle();

        // 2. Update numerical counter text
        if (candleCountSpan) {
            candleCountSpan.textContent = currentCandles;
        }

        // Release the lock after 200ms
        setTimeout(() => {
            isAdding = false;
        }, 200);

        if (currentCandles === TARGET_AGE) {
            addCandleBtn.disabled = true;
            navigateSections('#age-counter-block', '#image-selection-block');
        };
    });
}