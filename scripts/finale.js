document.addEventListener('DOMContentLoaded', () => {
    const doneButton = document.getElementById('done-gifts-btn');

    if (doneButton) {
        doneButton.addEventListener('click', (e) => {
            e.preventDefault();

            setTimeout(async () => {
                await window.decryptSection('#thank-you-block');

                navigateSections('#view-gifts-content', '#thank-you-block', false);
                document.body.style.padding = '0';
                document.documentElement.style.padding = '0';
            }, 800);

            // Ensure view scrolls to top for final card
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});