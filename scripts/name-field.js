const ALLOWED_HASHES = [
    "25199594cefa04a47163dd996f3681f00f72090dd00280f02908fb2959416fd1",
    "b18aaa6c6b929b866051b69a785a6cdce5bdd564d41be247c7d5ef7c2e2e2271"
];

const input = document.querySelector('.input');
const button = document.querySelector('#name-check-field button');

async function hashName(str) {
    const cleanStr = str.trim().toLowerCase();
    const encoder = new TextEncoder();
    const data = encoder.encode(cleanStr);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function checkNameMatch() {
    const userEnteredName = input.value;
    if (!userEnteredName) return;

    const userHash = await hashName(userEnteredName);

    if (ALLOWED_HASHES.includes(userHash)) {
        navigateSections('#name-field-block', '#dob-field-block');
    } else {
        document.querySelector('#name-error').style.color = 'red';
    }
}

button.addEventListener('click', checkNameMatch);

input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        checkNameMatch();
    }
});


// Function to handle switching "pages" on the same screen
function showMainContent() {
    document.querySelector('#main').style.display = 'none'; // Hide login card
    document.querySelector('#secret-content').classList.remove('hidden'); // Reveal next section
}