# ACA — AES-256 Vault

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![AES-256-GCM](https://img.shields.io/badge/AES--256--GCM-secure%20%26%20authenticated-brightgreen)](#crypto-parameters)
[![Web Crypto API](https://img.shields.io/badge/Web%20Crypto%20API-browser%20native-blue)](#tech-stack)
[![PWA](https://img.shields.io/badge/PWA-offline%20ready-orange)](#features)
[![Dependencies](https://img.shields.io/badge/dependencies-zero-red)](#tech-stack)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow?logo=javascript&logoColor=white)](#tech-stack)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-1f6feb.svg)](CONTRIBUTING.md)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blueviolet)](https://amgpulse.github.io/acavault/)

> AES-256-GCM text & file encryption — client-side, zero-knowledge

**🚀 [Live Demo](https://amgpulse.github.io/acavault/)**

Secure text and file encryption/decryption with **AES-256-GCM** — fully in your browser, with zero data ever sent to a server.

**ACA** (AES Crypto App) is a lightweight Progressive Web App that performs all cryptographic operations using the browser's Web Crypto API — no server, no third-party crypto libraries, and not a single byte leaving your machine.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [How It Works](#how-it-works)
- [Crypto Parameters](#crypto-parameters)
- [Project Structure](#project-structure)
- [Run Locally](#run-locally)
- [Usage Guide](#usage-guide)
- [Browser Support](#browser-support)
- [Security Notes](#security-notes)
- [FAQ](#faq)
- [License](#license)

---

## Features

### 🔐 Text Encryption
- Encrypt/decrypt any message with **Base64** output
- Character counter, copy button, and show/hide password toggle
- **Real-time passphrase strength meter** — entropy in bits + estimated crack time
- One-click random passphrase generator

### 📁 File Encryption
- Encrypt & decrypt **any file type** (images, videos, archives, PDFs, ...)
- Upload via **drag & drop** or click
- Custom output filename option
- Processed entirely in browser memory — nothing is ever uploaded

### 🔑 Key Generator
- Generate **high-entropy** random keys (16–128 characters)
- Custom character sets: symbols, numbers, uppercase, lowercase
- "Use in Text/File Encryption" buttons for one-click key transfer

### 🌐 PWA & Offline
- Installable on desktop and mobile (Add to Home Screen)
- **One-click Install button** appears automatically when the browser supports it
- Works fully offline via a **Service Worker**
- Bilingual UI: **Persian (RTL)** and **English**

### ⚡ Zero Runtime Dependencies
- Pure HTML / CSS / JavaScript
- Uses only `window.crypto.subtle` — no third-party crypto libraries
- Data is never sent to a server (**zero-knowledge**)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Language | Vanilla JavaScript (ES6+) |
| Cryptography | [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) |
| Styling | Tailwind CSS (CDN) + `styles.css` |
| Icons | FontAwesome 6 |
| PWA | `manifest.json` + Service Worker (`sw.js`) |

---

## How It Works

### Encryption

```
Passphraseo
    │
    ▼
PBKDF2 (SHA-256, 100,000 iterations, random 16-byte salt)
    │
    ▼
AES-256-GCM Key (256-bit)
    │
    ▼
Encrypt(plaintext, key, random 12-byte IV)
    │
    ▼
Base64(salt ‖ IV ‖ ciphertext)  →  output
```

### Decryption

```
Base64 payload  →  split into salt, IV, and ciphertext
    │
    ▼
Passphrase + salt  →  PBKDF2  →  same key
    │
    ▼
AES-GCM Decrypt  →  authentication (tamper detection)
    │
    ▼
Original text or file
```

Key point: in addition to encrypting, **GCM** mode produces an authentication **TAG** — if even a single byte of the data is tampered with, decryption fails with an error.

---

## Crypto Parameters

| Parameter | Value |
|-----------|-------|
| Cipher | AES-256-GCM |
| Key derivation | PBKDF2 (SHA-256) |
| Iterations | 100,000 |
| Key length | 256 bit |
| IV length | 12 byte (random) |
| Salt length | 16 byte (random) |
| Tag length | 128 bit (GCM default) |
| Random source | `crypto.getRandomValues()` |
| Encoding | Base64 |

---

## Project Structure

```
aes-crypto-app/
├── index.html      # UI (three tabs: Text, File, Generator)
├── app.js          # Crypto engine + app logic + i18n translations
├── styles.css      # Custom styles
├── sw.js           # Service Worker (offline support)
├── manifest.json   # PWA configuration
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Pages deployment
├── LICENSE         # MIT
└── README.md
```

---

## Deployment

The site is deployed automatically to **GitHub Pages** on every push to `main` via the workflow in `.github/workflows/deploy.yml`.

First-time setup:

1. Go to **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. Push to `main` — the workflow deploys the site to `https://amgpulse.github.io/acavault/`

---

## Run Locally

No build step or package installation required:

```bash
git clone https://github.com/amgpulse/acavault.git
cd aes-crypto-app
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

Alternatively, simply open `index.html` directly in a browser.

> To test PWA and Service Worker features, always use a local server (not `file://`).

---

## Usage Guide

### Encrypting Text
1. Go to the **Text Encryption** tab
2. Select **Encrypt** mode
3. Enter a strong passphrase or click **Generate Random**
4. Type/paste your message and click **Encrypt Message**
5. Copy the Base64 output and share it with the recipient

### Decrypting
1. Switch to **Decrypt** mode
2. Enter the same passphrase
3. Paste the payload and click **Decrypt**

### Encrypting a File
1. Go to the **File Encryption** tab
2. Drag & drop your file
3. Enter a passphrase (or generate a key)
4. Click **Process File** — a `*.enc` file will be downloaded

### Decrypting a File
1. Select **Decrypt File** mode
2. Choose the `.enc` file
3. Enter the passphrase and optionally specify a custom output filename
4. Click **Process File** — the original file will be downloaded

---

## Browser Support

| Browser | Status |
|---------|--------|
| Chrome / Edge 60+ | ✅ |
| Firefox 60+ | ✅ |
| Safari 11+ | ✅ |
| Old browsers without Web Crypto | ❌ |

> The browser must support `crypto.subtle`; on `http://` (other than localhost) `subtle` may be unavailable (use `https://` or `localhost`).

---

## Security Notes

- ✅ Uses only `window.crypto.subtle` — no third-party crypto libraries involved
- ✅ Salt and IV are generated with `crypto.getRandomValues()` (random and unique)
- ✅ GCM mode provides **authenticated** encryption (any tampering is detected)
- ✅ No data is ever sent to a server — everything runs client-side
- ⚠️ If you lose the passphrase, **there is no way to recover the data**
- ⚠️ A weak passphrase means weak security — use the built-in generator
- ⚠️ Never send the passphrase together with the encrypted data

> This app is a practical encryption tool, not a replacement for professional tools like age or GPG in high-security scenarios.

---

## FAQ

**Is my data stored anywhere?**
No. Everything is processed in browser memory and cleared when the tab is closed.

**Why is the output Base64?**
So you can transport the payload as plain text (email, chat, code).

**Does decryption work on another machine?**
Yes, as long as you enter the same passphrase — the cryptographic parameters are stored inside the payload itself.

**Does the PWA work offline?**
Yes, after the first visit the Service Worker caches all resources.

---

## License

This project is released under the [MIT](LICENSE) license.

Copyright (c) 2026 amgpulse
