# 🎂 Interactive Encrypted Birthday & Gift Web App

An interactive, client-side web application designed for multi-step gift reveals and personalized birthday experiences. The application combines mobile-first interactive UI elements with end-to-end zero-server payload encryption using the native Web Crypto API (`AES-GCM-256`).

---

## ✨ Key Features & Design Choices

* **🔒 Zero-Server Client-Side Encryption**: All sensitive messages, wishes, and gift descriptions are stored inside the client codebase as AES-GCM encrypted JSON strings. No unencrypted text exists in HTML/JS source code.
  
* **📱 Mobile-Optimized 6-Digit/7-Digit PIN Entry**: Custom pin input UI featuring active box elevations, numerical keyboard forcing (`inputmode="numeric"`), focus trapping, and enter-key submission.
  
* **🕯 Interactive Fun Mechanic**: Fun little challenges such as made-up recaptcha site that makes the bday person choose their own picture, adding candles until it reaches your new age, interactive birthday cake with balloons and confetti, and a whole section to share your thoughts, and reasons for your gifts to them.

* **🔄 On-the-Fly Dynamic Decryption**: Automatically decrypts and populates registered elements inside a target section immediately before running `navigateSections(from, to)`.
  
* **🎨 Full HTML & Multi-line Support**: Renders decrypted content using `innerHTML` instead of plain text, allowing rich formatting like `<p>`, `<strong>`, `<br>`, links, and emojis.

* **🧠 Ephemeral Memory Storage**: The raw PIN is never saved to local storage or source files. It is kept temporarily in volatile JavaScript memory (`userSecretKey`) for the duration of the browser session.

---

## 🏗 Security Architecture & Execution Logic

```text
[ User Enters PIN ] ──► [ SHA-256 Hash Check ] ──(Match)──► [ Store PIN in userSecretKey ]
                                                                      │
                                                                      ▼
[ DOM Element innerHTML ] ◄── [ AES-GCM Decrypt ] ◄── [ window.decryptSection(selector) ]
```

1. **Authentication**: User submits a 6-digit code in `#entry-pin-section`. The system checks `hashString(enteredPin)` against `ENTRY_PIN_HASH`.
2. **Key Storage**: Upon matching, `userSecretKey = enteredPin` stores the raw string temporarily in browser RAM.
3. **Automated Decryption**: During navigation transitions (e.g., from `#cake` to `#message-section`), `window.decryptSection('#message-section')` fetches matching encrypted items in `ENCRYPTED_MESSAGES`, unscrambles them using `userSecretKey`, and injects formatted HTML into target DOM IDs.

---

## 📂 Project Structure

```text
├── scripts/
├── src/
├── styles/
└── index.html

```

---

## 🛠 Developer Console Payload Generators

Run these utility functions directly in DevTools Console (`F12` → **Console**) to prepare project data:

### 1. PIN Hash Generator
Use this to create your initial `ENTRY_PIN_HASH` value:

```javascript
async function generatePinHash(pin) {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin.toString());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashHex = Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0')).join('');
    
    console.log(`%c PIN: ${pin}`, 'color: #3b82f6; font-weight: bold;');
    console.log(`%c HASH: ${hashHex}`, 'color: #10b981; font-weight: bold;');
    return hashHex;
}

// Example usage:
generatePinHash("123456");
```

### 2. Multi-Line & HTML Message Encrypter
Use backticks (```) to wrap formatted HTML content and generate ciphertext strings for `ENCRYPTED_MESSAGES`:

```javascript
async function encryptPayload(plainText, secretPin) {
    const enc = new TextEncoder();
    const keyBuffer = await crypto.subtle.digest('SHA-256', enc.encode(secretPin.toString()));
    const key = await crypto.subtle.importKey('raw', keyBuffer, 'AES-GCM', false, ['encrypt']);
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        enc.encode(plainText)
    );
    
    const bufferToBase64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf)));
    const payload = JSON.stringify({
        iv: bufferToBase64(iv),
        data: bufferToBase64(encrypted)
    });

    console.log("%c Encrypted Payload:", "color: #10b981; font-weight: bold;");
    console.log(`'${payload}'`);
    return payload;
}

// Example usage with multi-line HTML:
encryptPayload(`
    <p>Happy Birthday!</p>
    <p>This is a <strong>special message</strong> on line 2.</p>
`, "123456");
```
