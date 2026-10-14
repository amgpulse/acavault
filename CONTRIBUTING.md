# Contributing to ACA — AES-256 Vault

Thanks for your interest in contributing! 🎉

All contributions are welcome — whether it's a bug report, a feature request, a translation, or a pull request.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Report a Bug](#how-to-report-a-bug)
- [Suggesting a Feature](#suggesting-a-feature)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Development Setup](#development-setup)
- [Project Guidelines](#project-guidelines)
- [Coding Style](#coding-style)
- [Translation](#translation)

---

## Code of Conduct

Be respectful, constructive, and inclusive. We want this project to be a friendly place for everyone.

---

## How to Report a Bug

Before opening an issue, search the [existing issues](../../issues) to avoid duplicates.

When opening a new issue, include:

- **Clear title** — a short summary of the problem
- **Steps to reproduce** — exactly what you did
- **Expected behavior** — what you thought would happen
- **Actual behavior** — what really happened
- **Environment** — browser + version, OS
- **Screenshots** — if applicable

---

## Suggesting a Feature

Open an issue with the `feature request` label (or just tag it in the title) and describe:

- The problem your feature solves
- How you imagine it working
- Any alternatives you've considered

---

## Submitting a Pull Request

1. **Fork** the repository
2. **Clone** your fork:

   ```bash
   git clone https://github.com/<your-username>/acavault.git
   cd acavault
   ```

3. **Create a branch** for your change:

   ```bash
   git checkout -b feature/my-awesome-feature
   ```

4. **Make your changes** and test them (see [Development Setup](#development-setup))
5. **Commit** with a clear message:

   ```bash
   git commit -m "Add: short description of the change"
   ```

6. **Push** to your fork:

   ```bash
   git push origin feature/my-awesome-feature
   ```

7. **Open a Pull Request** against `main` and describe:
   - What the change does
   - Why it's needed
   - Any screenshots (for UI changes)

### PR Checklist

- [ ] The app works locally (no console errors)
- [ ] Encryption/decryption still works for both text and files
- [ ] No secrets, keys, or personal data are committed
- [ ] UI changes look good on mobile and desktop
- [ ] New strings are added to **both** English and Persian translations
- [ ] The PR has a clear title and description

---

## Development Setup

No build step, no dependencies — just serve the folder:

```bash
git clone https://github.com/amgpulse/acavault.git
cd acavault
python3 -m http.server 8000
```

Open `http://localhost:8000` and you're ready.

> Use a local server (not `file://`) so the Service Worker and PWA features work correctly.

---

## Project Guidelines

These rules keep the project secure and trustworthy:

1. **Zero-knowledge by design** — never add code that sends user data to a server
2. **No third-party crypto** — use only the browser's Web Crypto API (`window.crypto.subtle`)
3. **No runtime dependencies** — keep it vanilla HTML/CSS/JS (CDN libs like Tailwind are acceptable)
4. **Security first** — any crypto-related change must be carefully justified; random values must come from `crypto.getRandomValues()`
5. **Keep it simple** — this is a lightweight tool, not a framework

---

## Coding Style

- **JavaScript**: ES6+, 4-space indentation, camelCase for functions/variables
- **HTML**: semantic elements, keep `data-i18n` attributes for translatable strings
- **CSS**: custom styles go in `styles.css`, prefer Tailwind utility classes for new UI
- **No comments** unless the logic is non-obvious
- Keep functions small and focused; avoid inline event handlers growing out of control

---

## Translation

The UI supports **English** and **Persian (RTL)** via the `translations` object in `app.js`.

To add a language:

1. Find the `translations` object in `app.js`
2. Add a new language block (e.g., `fr: { ... }`)
3. Use the same keys as `en`
4. Test RTL/LTR layout if applicable
5. Submit a PR with your language added

To fix a translation: edit the relevant key and mention the change in your PR.

---

## Questions?

Feel free to open an issue if anything is unclear. Thanks for helping make ACA better! 🚀
