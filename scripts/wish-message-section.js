const viewGiftsBtn = document.getElementById('view-gifts-btn');

viewGiftsBtn.addEventListener('click', () => {
    navigateSections('#message-section', '#view-gifts', true);
});