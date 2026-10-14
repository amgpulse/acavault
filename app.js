// AES-256-GCM Cryptographic Engine using Web Crypto API

let currentMode = 'encrypt'; // 'encrypt' or 'decrypt'
let currentFileMode = 'encrypt';
let selectedFile = null;

// Switch between Text, File, and Generator tabs
function switchTab(tab) {
    const textTab = document.getElementById('tab-text');
    const fileTab = document.getElementById('tab-file');
    const genTab = document.getElementById('tab-generator');
    const textContent = document.getElementById('content-text');
    const fileContent = document.getElementById('content-file');
    const genContent = document.getElementById('content-generator');

    // Reset all tabs
    [textTab, fileTab, genTab].forEach(t => {
        t.className = "pb-3 font-medium text-sm border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-2 transition-colors whitespace-nowrap";
        t.setAttribute('aria-selected', 'false');
    });
    [textContent, fileContent, genContent].forEach(c => c.classList.add('hidden'));
    if (tab === 'text') {
        textTab.className = "pb-3 font-medium text-sm border-b-2 border-emerald-500 text-emerald-400 flex items-center gap-2 transition-colors whitespace-nowrap";
        textTab.setAttribute('aria-selected', 'true');
        textContent.classList.remove('hidden');
    } else if (tab === 'file') {
        fileTab.className = "pb-3 font-medium text-sm border-b-2 border-emerald-500 text-emerald-400 flex items-center gap-2 transition-colors whitespace-nowrap";
        fileTab.setAttribute('aria-selected', 'true');
        fileContent.classList.remove('hidden');
    } else if (tab === 'generator') {
        genTab.className = "pb-3 font-medium text-sm border-b-2 border-emerald-500 text-emerald-400 flex items-center gap-2 transition-colors whitespace-nowrap";
        genTab.setAttribute('aria-selected', 'true');
        genContent.classList.remove('hidden');
    }
}

// Clear all inputs, outputs, and states across the app
function clearAllApp() {
    const textPass = document.getElementById('text-passphrase');
    if (textPass) textPass.value = '';
    const textInput = document.getElementById('text-input');
    if (textInput) textInput.value = '';
    const textOutput = document.getElementById('text-output');
    if (textOutput) textOutput.value = '';
    updateCounter();

    const filePass = document.getElementById('file-passphrase');
    if (filePass) filePass.value = '';
    const fileOutputName = document.getElementById('file-output-name');
    if (fileOutputName) fileOutputName.value = '';
    resetFileSelection();

    const genOutput = document.getElementById('gen-output');
    if (genOutput) genOutput.value = '';
    const genActions = document.getElementById('gen-action-buttons');
    if (genActions) genActions.classList.add('hidden');

    updateStrength('text');
    updateStrength('file');

    showStatus(t('msg_cleared'), "info");
    showFileStatus(t('file_status_default'), "info");
}

// Reset file selection state
function resetFileSelection() {
    selectedFile = null;
    const fileInput = document.getElementById('file-input');
    if (fileInput) fileInput.value = '';
    const nameDisplay = document.getElementById('file-name-display');
    if (nameDisplay) nameDisplay.textContent = t('upload_prompt');
    const dropzoneIcon = document.getElementById('dropzone-icon');
    if (dropzoneIcon) dropzoneIcon.className = "fa-solid fa-cloud-arrow-up";
}

// Switch Text Mode (Encrypt vs Decrypt)
function setMode(mode) {
    currentMode = mode;
    updateTextModeUI();
    const textInput = document.getElementById('text-input');
    if (textInput) textInput.value = '';
    const textOutput = document.getElementById('text-output');
    if (textOutput) textOutput.value = '';
    updateCounter();
}

// Update Text tab UI labels/styles for the current mode (used on mode switch & language change)
function updateTextModeUI() {
    const btnEnc = document.getElementById('mode-encrypt');
    const btnDec = document.getElementById('mode-decrypt');
    const inputLabel = document.getElementById('input-label');
    const outputLabel = document.getElementById('output-label');
    const actionBtnText = document.getElementById('action-btn-text');
    const actionBtnIcon = document.getElementById('action-btn-icon');
    const statusText = document.getElementById('status-text');
    const genRandomBtn = document.getElementById('generate-random-btn');
    const textInput = document.getElementById('text-input');

    if (currentMode === 'encrypt') {
        btnEnc.className = "px-3 py-1 text-xs font-medium rounded-md bg-emerald-600 text-white shadow transition-all";
        btnDec.className = "px-3 py-1 text-xs font-medium rounded-md text-slate-400 hover:text-white transition-all";
        inputLabel.textContent = t('plaintext_input');
        outputLabel.textContent = t('encrypted_payload_b64');
        actionBtnText.textContent = t('action_btn_encrypt');
        actionBtnIcon.innerHTML = '<i class="fa-solid fa-lock"></i>';
        statusText.textContent = t('status_ready_encrypt');
        if (genRandomBtn) genRandomBtn.classList.remove('hidden');
        if (textInput) textInput.placeholder = t('input_placeholder_encrypt');
    } else {
        btnDec.className = "px-3 py-1 text-xs font-medium rounded-md bg-emerald-600 text-white shadow transition-all";
        btnEnc.className = "px-3 py-1 text-xs font-medium rounded-md text-slate-400 hover:text-white transition-all";
        inputLabel.textContent = t('encrypted_payload_b64');
        outputLabel.textContent = t('decrypted_plaintext_output');
        actionBtnText.textContent = t('action_btn_decrypt');
        actionBtnIcon.innerHTML = '<i class="fa-solid fa-unlock"></i>';
        statusText.textContent = t('status_ready_decrypt');
        if (genRandomBtn) genRandomBtn.classList.add('hidden');
        if (textInput) textInput.placeholder = t('input_placeholder_decrypt');
    }
}

// Switch File Mode
function setFileMode(mode) {
    currentFileMode = mode;
    updateFileModeUI();
}

// Update File tab UI labels/styles for the current mode (used on mode switch & language change)
function updateFileModeUI() {
    const btnEnc = document.getElementById('file-mode-encrypt');
    const btnDec = document.getElementById('file-mode-decrypt');
    const actionText = document.getElementById('file-action-text');
    const actionIcon = document.getElementById('file-action-icon');
    const statusText = document.getElementById('file-status-text');
    const genRandomFileBtn = document.getElementById('generate-random-file-btn');

    if (currentFileMode === 'encrypt') {
        btnEnc.className = "flex-1 py-2 text-xs font-medium rounded-lg bg-emerald-600 text-white shadow transition-all";
        btnDec.className = "flex-1 py-2 text-xs font-medium rounded-lg text-slate-400 hover:text-white transition-all";
        actionText.textContent = t('encrypt_file');
        actionIcon.className = "fa-solid fa-lock";
        statusText.textContent = t('file_status_select_encrypt');
        if (genRandomFileBtn) genRandomFileBtn.classList.remove('hidden');
    } else {
        btnDec.className = "flex-1 py-2 text-xs font-medium rounded-lg bg-emerald-600 text-white shadow transition-all";
        btnEnc.className = "flex-1 py-2 text-xs font-medium rounded-lg text-slate-400 hover:text-white transition-all";
        actionText.textContent = t('decrypt_file');
        actionIcon.className = "fa-solid fa-unlock";
        statusText.textContent = t('file_status_select_decrypt');
        if (genRandomFileBtn) genRandomFileBtn.classList.add('hidden');
    }
}

// Toggle Password visibility
function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = "fa-solid fa-eye-slash text-sm";
    } else {
        input.type = 'password';
        icon.className = "fa-solid fa-eye text-sm";
    }
}

// Update character counter
function updateCounter() {
    const val = document.getElementById('text-input').value;
    document.getElementById('text-counter').textContent = `${val.length} ${t('chars')}`;
}

// Generate random secure passphrase for Text tab
function generateRandomPassphrase() {
    const array = new Uint8Array(24);
    window.crypto.getRandomValues(array);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    let result = "";
    for (let i = 0; i < array.length; i++) {
        result += chars.charAt(array[i] % chars.length);
    }
    document.getElementById('text-passphrase').value = result;
    updateStrength('text');
    showStatus(t('msg_generated_passphrase'), "success");
}

// Generate random secure passphrase for File tab
function generateRandomFilePassphrase() {
    const array = new Uint8Array(24);
    window.crypto.getRandomValues(array);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    let result = "";
    for (let i = 0; i < array.length; i++) {
        result += chars.charAt(array[i] % chars.length);
    }
    document.getElementById('file-passphrase').value = result;
    updateStrength('file');
    showFileStatus(t('msg_generated_file_passphrase'), "success");
}

// ---------- Passphrase strength meter ----------
const CRACK_RATE = 1e10; // guesses/sec (offline fast attack)

function estimateCharsetPool(pass) {
    let pool = 0;
    if (/[a-z]/.test(pass)) pool += 26;
    if (/[A-Z]/.test(pass)) pool += 26;
    if (/[0-9]/.test(pass)) pool += 10;
    if (/[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/.test(pass)) pool += 33;
    if (/[^\x20-\x7E]/.test(pass)) pool += 300;
    return Math.max(pool, 1);
}

function crackSeconds(bits) {
    if (bits <= 0) return 0;
    return Math.pow(2, bits - 1) / CRACK_RATE;
}

function formatCrackTime(seconds) {
    if (seconds < 1) return t('time_instant');
    if (seconds < 60) return t('time_sec', { n: Math.max(1, Math.round(seconds)) });
    if (seconds < 3600) return t('time_min', { n: Math.round(seconds / 60) });
    if (seconds < 86400) return t('time_hr', { n: Math.round(seconds / 3600) });
    const days = seconds / 86400;
    if (days < 365.25) return t('time_day', { n: Math.round(days) });
    const years = seconds / 31557600;
    if (!isFinite(years) || years >= 1e15) return t('time_eternal');
    if (years < 1000) return t('time_year', { n: Math.round(years) });
    let y;
    if (years >= 1e12) y = (years / 1e12).toFixed(1) + 'T';
    else if (years >= 1e9) y = (years / 1e9).toFixed(1) + 'B';
    else if (years >= 1e6) y = (years / 1e6).toFixed(1) + 'M';
    else y = Math.round(years).toLocaleString('en-US');
    return t('time_year_big', { n: y });
}

function strengthLevel(bits) {
    if (bits < 40) return { key: 'strength_weak', pct: 25, bar: 'bg-red-500', text: 'text-red-400' };
    if (bits < 60) return { key: 'strength_fair', pct: 50, bar: 'bg-amber-500', text: 'text-amber-400' };
    if (bits < 80) return { key: 'strength_strong', pct: 75, bar: 'bg-emerald-500', text: 'text-emerald-400' };
    return { key: 'strength_excellent', pct: 100, bar: 'bg-emerald-400', text: 'text-emerald-400' };
}

function updateStrength(which) {
    const input = document.getElementById(which + '-passphrase');
    const bar = document.getElementById(which + '-strength-bar');
    const label = document.getElementById(which + '-strength-label');
    const timeEl = document.getElementById(which + '-strength-time');
    if (!input || !bar || !label || !timeEl) return;

    const pass = input.value;
    if (!pass) {
        bar.style.width = '0%';
        bar.className = 'h-full w-0 bg-red-500 transition-all duration-300 rounded-full';
        label.textContent = t('strength_none');
        label.className = 'text-slate-500';
        timeEl.textContent = '';
        timeEl.title = '';
        return;
    }

    const bits = Math.round(pass.length * Math.log2(estimateCharsetPool(pass)));
    const lvl = strengthLevel(bits);
    bar.style.width = lvl.pct + '%';
    bar.className = 'h-full transition-all duration-300 rounded-full ' + lvl.bar;
    label.textContent = t(lvl.key) + ' • ' + t('strength_bits', { n: bits });
    label.className = lvl.text;
    const crack = formatCrackTime(crackSeconds(bits));
    timeEl.textContent = '⏱ ' + crack;
    timeEl.title = t('crack_est', { t: crack });
}

// ---------- PWA install button ----------
let deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    const btn = document.getElementById('install-btn');
    if (btn) {
        btn.classList.remove('hidden');
        btn.classList.add('flex');
    }
});

window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    const btn = document.getElementById('install-btn');
    if (btn) {
        btn.classList.add('hidden');
        btn.classList.remove('flex');
    }
});

function promptInstall() {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.then((choice) => {
        if (choice.outcome === 'accepted') {
            showStatus(t('msg_installed'), 'success');
        }
        deferredInstallPrompt = null;
        const btn = document.getElementById('install-btn');
        if (btn) {
            btn.classList.add('hidden');
            btn.classList.remove('flex');
        }
    });
}

// Copy Animation Helper (Green checkmark + "Copy Success" for 2 seconds)
function triggerCopyAnimation(buttonEl) {
    if (!buttonEl) return;
    const icon = buttonEl.querySelector('i');
    const span = buttonEl.querySelector('span');
    const originalIconClass = icon ? icon.className : 'fa-regular fa-copy';
    const originalText = span ? span.textContent : buttonEl.textContent.trim();

    if (icon) icon.className = "fa-solid fa-check text-emerald-400";
    if (span) span.textContent = t('copy_success');
    else {
        buttonEl.innerHTML = '<i class="fa-solid fa-check text-emerald-400"></i> ' + t('copy_success');
    }

    buttonEl.classList.add('text-emerald-400');

    setTimeout(() => {
        if (icon) icon.className = originalIconClass;
        if (span) span.textContent = originalText;
        else buttonEl.innerHTML = `<i class="${originalIconClass}"></i> ${originalText}`;
        buttonEl.classList.remove('text-emerald-400');
    }, 2000);
}

// Copy Passphrase helper
function copyPassphrase(inputId, btnEl) {
    const inputField = document.getElementById(inputId);
    if (!inputField || !inputField.value) {
        if (inputId === 'text-passphrase') showStatus(t('msg_no_key_copy'), "error");
        else showFileStatus(t('msg_no_key_copy'), "error");
        return;
    }
    navigator.clipboard.writeText(inputField.value).then(() => {
        triggerCopyAnimation(btnEl);
        if (inputId === 'text-passphrase') showStatus(t('msg_copied'), "success");
        else showFileStatus(t('msg_copied'), "success");
    });
}

// Copy output to clipboard
function copyOutput(btnEl) {
    const outputField = document.getElementById('text-output');
    if (!outputField || !outputField.value) {
        showStatus(t('msg_no_output_copy'), "error");
        return;
    }
    navigator.clipboard.writeText(outputField.value).then(() => {
        triggerCopyAnimation(btnEl);
        showStatus(t('msg_output_copied'), "success");
    });
}



// Key Generator functions
function generateCustomKey() {
    const length = parseInt(document.getElementById('gen-length').value, 10) || 32;
    const useSymbols = document.getElementById('gen-symbols').checked;
    const useNumbers = document.getElementById('gen-numbers').checked;
    const useUpper = document.getElementById('gen-upper').checked;
    const useLower = document.getElementById('gen-lower').checked;

    let chars = "";
    if (useSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (useNumbers) chars += "0123456789";
    if (useUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (useLower) chars += "abcdefghijklmnopqrstuvwxyz";

    if (!chars) {
        document.getElementById('gen-output').value = "";
        document.getElementById('gen-action-buttons').classList.add('hidden');
        const box = document.getElementById('gen-status-box');
        box.className = "p-3 rounded-xl bg-red-950/40 border border-red-900/60 text-xs text-red-300 flex items-center gap-2";
        box.querySelector('i').className = "fa-solid fa-triangle-exclamation text-red-400";
        document.getElementById('gen-status-text').textContent = t('msg_select_charset');
        return;
    }

    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    let result = "";
    for (let i = 0; i < array.length; i++) {
        result += chars.charAt(array[i] % chars.length);
    }

    const genOutput = document.getElementById('gen-output');
    genOutput.value = result;
    genOutput.type = 'password';
    document.getElementById('eye-icon-gen').className = "fa-solid fa-eye text-sm";

    document.getElementById('gen-action-buttons').classList.remove('hidden');

    const box = document.getElementById('gen-status-box');
    box.className = "p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/60 text-xs text-emerald-300 flex items-center gap-2";
    box.querySelector('i').className = "fa-solid fa-circle-check text-emerald-400";
    document.getElementById('gen-status-text').textContent = t('msg_gen_key', { n: length });
}

function copyGeneratorOutput(btnEl) {
    const val = document.getElementById('gen-output').value;
    if (!val) return;
    navigator.clipboard.writeText(val).then(() => {
        triggerCopyAnimation(btnEl);
        const box = document.getElementById('gen-status-box');
        box.className = "p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/60 text-xs text-emerald-300 flex items-center gap-2";
        box.querySelector('i').className = "fa-solid fa-circle-check text-emerald-400";
        document.getElementById('gen-status-text').textContent = t('msg_gen_copied');
    });
}

function useKeyInText() {
    const key = document.getElementById('gen-output').value;
    if (!key) return;
    document.getElementById('text-passphrase').value = key;
    updateStrength('text');
    switchTab('text');
    showStatus(t('msg_key_applied_text'), "success");
}

function useKeyInFile() {
    const key = document.getElementById('gen-output').value;
    if (!key) return;
    document.getElementById('file-passphrase').value = key;
    updateStrength('file');
    switchTab('file');
    showFileStatus(t('msg_key_applied_file'), "success");
}

// Helper: Derive AES-256 Key from passphrase using PBKDF2
async function deriveKey(passphrase, salt, usage) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(passphrase),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );

    return await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        [usage]
    );
}

// ArrayBuffer to Base64
function bufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}   

// Base64 to ArrayBuffer
function base64ToBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

// Process Text Encryption / Decryption
async function processText() {
    const passphrase = document.getElementById('text-passphrase').value;
    const input = document.getElementById('text-input').value;
    const outputField = document.getElementById('text-output');

    if (!passphrase) {
        showStatus(t('msg_no_passphrase'), "error");
        return;
    }
    if (!input) {
        showStatus(t('msg_enter_input'), "error");
        return;
    }

    try {
        if (currentMode === 'encrypt') {
            const salt = window.crypto.getRandomValues(new Uint8Array(16));
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            const key = await deriveKey(passphrase, salt, "encrypt");

            const enc = new TextEncoder();
            const encryptedContent = await window.crypto.subtle.encrypt(
                { name: "AES-GCM", iv: iv },
                key,
                enc.encode(input)
            );

            const packageObj = {
                s: bufferToBase64(salt),
                i: bufferToBase64(iv),
                c: bufferToBase64(encryptedContent)
            };

            const finalPayload = btoa(JSON.stringify(packageObj));
            outputField.value = finalPayload;
            showStatus(t('msg_encrypted_ok'), "success");
        } else {
            // Decrypt
            let packageObj;
            try {
                packageObj = JSON.parse(atob(input.trim()));
            } catch (e) {
                throw new Error("Invalid encrypted payload format (Base64/JSON error).");
            }

            if (!packageObj.s || !packageObj.i || !packageObj.c) {
                throw new Error("Missing cryptographic parameters (salt, iv, or ciphertext).");
            }

            const salt = base64ToBuffer(packageObj.s);
            const iv = base64ToBuffer(packageObj.i);
            const ciphertext = base64ToBuffer(packageObj.c);

            const key = await deriveKey(passphrase, new Uint8Array(salt), "decrypt");

            const decryptedContent = await window.crypto.subtle.decrypt(
                { name: "AES-GCM", iv: new Uint8Array(iv) },
                key,
                ciphertext
            );

            const dec = new TextDecoder();
            outputField.value = dec.decode(decryptedContent);
            showStatus(t('msg_decrypted_ok'), "success");
        }
    } catch (err) {
        console.error(err);
        showStatus(t('msg_op_failed') + (err.message || t('msg_bad_pass')), "error");
    }
}

// Status feedback helper
function showStatus(msg, type = "info") {
    const box = document.getElementById('status-box');
    const text = document.getElementById('status-text');
    text.textContent = msg;
    if (type === 'error') {
        box.className = "mt-6 p-3 rounded-xl bg-red-950/40 border border-red-900/60 text-xs text-red-300 flex items-center gap-2";
        box.querySelector('i').className = "fa-solid fa-triangle-exclamation text-red-400";
    } else if (type === 'success') {
        box.className = "mt-6 p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/60 text-xs text-emerald-300 flex items-center gap-2";
        box.querySelector('i').className = "fa-solid fa-circle-check text-emerald-400";
    } else {
        box.className = "mt-6 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2";
        box.querySelector('i').className = "fa-solid fa-circle-info text-emerald-400";
    }
}

// File handling
function handleFileSelect(input) {
    if (input.files && input.files[0]) {
        selectedFile = input.files[0];
        document.getElementById('file-name-display').textContent = selectedFile.name;
        document.getElementById('dropzone-icon').className = "fa-solid fa-file-circle-check text-emerald-400";
        showFileStatus(t('msg_loaded_file', { name: selectedFile.name, size: (selectedFile.size / 1024).toFixed(1) }), "success");
    }
}

function handleFileDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('border-emerald-500');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        selectedFile = e.dataTransfer.files[0];
        document.getElementById('file-name-display').textContent = selectedFile.name;
        document.getElementById('dropzone-icon').className = "fa-solid fa-file-circle-check text-emerald-400";
        showFileStatus(t('msg_loaded_file', { name: selectedFile.name, size: (selectedFile.size / 1024).toFixed(1) }), "success");
    }
}

function showFileStatus(msg, type = "info") {
    const box = document.getElementById('file-status-box');
    const text = document.getElementById('file-status-text');
    text.textContent = msg;
    if (type === 'error') {
        box.className = "p-3 rounded-xl bg-red-950/40 border border-red-900/60 text-xs text-red-300 flex items-center gap-2";
        box.querySelector('i').className = "fa-solid fa-triangle-exclamation text-red-400";
    } else if (type === 'success') {
        box.className = "p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/60 text-xs text-emerald-300 flex items-center gap-2";
        box.querySelector('i').className = "fa-solid fa-circle-check text-emerald-400";
    } else {
        box.className = "p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2";
        box.querySelector('i').className = "fa-solid fa-circle-info text-emerald-400";
    }
}

async function processFile() {
    const passphrase = document.getElementById('file-passphrase').value;
    const customName = document.getElementById('file-output-name').value.trim();

    if (!passphrase) {
        showFileStatus(t('msg_file_pass_required'), "error");
        return;
    }
    if (!selectedFile) {
        showFileStatus(t('msg_select_file'), "error");
        return;
    }

    try {
        const fileBuffer = await selectedFile.arrayBuffer();

        if (currentFileMode === 'encrypt') {
            const salt = window.crypto.getRandomValues(new Uint8Array(16));
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            const key = await deriveKey(passphrase, salt, "encrypt");

            const ciphertext = await window.crypto.subtle.encrypt(
                { name: "AES-GCM", iv: iv },
                key,
                fileBuffer
            );

            const combined = new Uint8Array(salt.byteLength + iv.byteLength + ciphertext.byteLength);
            combined.set(salt, 0);
            combined.set(iv, salt.byteLength);
            combined.set(new Uint8Array(ciphertext), salt.byteLength + iv.byteLength);

            const blob = new Blob([combined], { type: "application/octet-stream" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            let downloadName = customName ? (customName.endsWith('.enc') ? customName : customName + '.enc') : (selectedFile.name + ".enc");
            a.download = downloadName;

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showFileStatus(t('msg_file_encrypted_ok'), "success");
            resetFileSelection();
            document.getElementById('file-passphrase').value = '';
            document.getElementById('file-output-name').value = '';
        } else {
            // Decrypt
            if (fileBuffer.byteLength < 28) {
                throw new Error("Invalid encrypted file structure.");
            }

            const salt = fileBuffer.slice(0, 16);
            const iv = fileBuffer.slice(16, 28);
            const ciphertext = fileBuffer.slice(28);

            const key = await deriveKey(passphrase, new Uint8Array(salt), "decrypt");

            const decryptedContent = await window.crypto.subtle.decrypt(
                { name: "AES-GCM", iv: new Uint8Array(iv) },
                key,
                ciphertext
            );

            let originalName = customName ? customName : (selectedFile.name.endsWith('.enc') ? selectedFile.name.slice(0, -4) : "decrypted_" + selectedFile.name);

            const blob = new Blob([decryptedContent], { type: "application/octet-stream" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = originalName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showFileStatus(t('msg_file_decrypted_ok'), "success");
            resetFileSelection();
            document.getElementById('file-passphrase').value = '';
            document.getElementById('file-output-name').value = '';
        }
    } catch (err) {
        console.error(err);
        showFileStatus(t('msg_file_failed') + (err.message || t('msg_weak_pass')), "error");
    }
}

// Initialize slider wheel support
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('gen-length');
    if (slider) {
        slider.addEventListener('wheel', (e) => {
            e.preventDefault();
            const step = parseInt(slider.step, 10) || 4;
            let val = parseInt(slider.value, 10);
            if (e.deltaY < 0) {
                val = Math.min(parseInt(slider.max, 10) || 128, val + step);
            } else {
                val = Math.max(parseInt(slider.min, 10) || 16, val - step);
            }
            slider.value = val;
            slider.dispatchEvent(new Event('input'));
        }, { passive: false });
    }
});
// ---------- i18n / Language support (Persian default, English toggle) ----------
let currentLang = localStorage.getItem('aesLang') || 'fa'; // 'fa' or 'en'

const translations = {
  en: {
    app_title: "\uD83D\uDEE1\uFE0F AES-256 Vault - Secure Cryptographic Suite",
    app_name: "AES-256 Vault",
    gcm_secure: "GCM Secure",
    header_subtitle: "Client-side zero-knowledge encryption & decryption",
    clear_all: "Clear All",
    browser_crypto: "Browser SubtleCrypto",
    tab_text: "Text Encryption",
    tab_file: "File Encryption",
    tab_generator: "Key Generator",
    op_key: "Operation & Key",
    encrypt: "Encrypt",
    decrypt: "Decrypt",
    secret_passphrase: "Secret Passphrase / Key",
    copy_key: "Copy Key",
    passphrase_placeholder: "Enter secure secret key or passphrase...",
    pbkdf2_hint: "PBKDF2 derives a 256-bit AES key.",
    generate_random: "Generate Random",
    plaintext_input: "Plaintext Input",
    input_placeholder_encrypt: "Type or paste your secret message here...",
    input_placeholder_decrypt: "Paste your encrypted Base64 payload here...",
    chars: "chars",
    action_btn_encrypt: "Encrypt Message",
    action_btn_decrypt: "Decrypt Message",
    result_output: "Result Output",
    copy_output: "Copy Output",
    encrypted_payload_b64: "Encrypted Payload (Base64)",
    decrypted_plaintext_output: "Decrypted Plaintext Output",
    output_placeholder: "Secure output will appear here...",
    status_ready_encrypt: "Ready for encryption. AES-256-GCM is active.",
    status_ready_decrypt: "Ready for decryption. Paste your payload.",
    file_processor: "File Cryptographic Processor",
    file_subtitle: "Securely encrypt or decrypt any file using AES-256-GCM directly in your browser.",
    operation_mode: "Operation Mode",
    encrypt_file: "Encrypt File",
    decrypt_file: "Decrypt File",
    file_passphrase: "File Encryption Passphrase",
    secret_key_placeholder: "Secret key...",
    generate_random_key: "Generate Random Key",
    custom_filename: "Custom Output Filename (Optional)",
    custom_filename_placeholder: "e.g. package.deb, song.mp3, archive.zip",
    custom_filename_hint: "Specify filename with extension when decrypting if your encrypted file lacks the extension.",
    upload_prompt: "Click to upload or drag & drop file here",
    any_format_hint: "Any file format supported (processed locally)",
    process_file: "Process File",
    file_status_default: "Select a file and enter a passphrase to begin.",
    file_status_select_encrypt: "Select a file to encrypt.",
    file_status_select_decrypt: "Select an encrypted (.enc) file to decrypt.",
    gen_heading: "Cryptographic Key Generator",
    gen_subtitle: "Generate high-entropy random keys and passphrases for AES-256 encryption.",
    key_length: "Key Length:",
    key_length_chars: "chars",
    char_set: "Character Set",
    symbols: "Symbols (!@#$)",
    numbers: "Numbers (0-9)",
    uppercase: "Uppercase (A-Z)",
    lowercase: "Lowercase (a-z)",
    gen_secure_key: "Generated Secure Key",
    gen_placeholder: "Click generate...",
    gen_button: "Generate Secure Key",
    gen_use_in_text: "Use in Text Encryption",
    gen_use_in_file: "Use in File Encryption",
    gen_status_default: "Configure options and click generate.",
    footer_text: "AES-256 Vault \u2022 Zero server transmission \u2022 Powered by Web Crypto API",
    msg_no_passphrase: "Please enter a passphrase/key.",
    msg_enter_input: "Please enter input text.",
    msg_encrypted_ok: "Message successfully encrypted with AES-256-GCM.",
    msg_invalid_payload: "Invalid encrypted payload format (Base64/JSON error).",
    msg_missing_params: "Missing cryptographic parameters (salt, iv, or ciphertext).",
    msg_decrypted_ok: "Message successfully decrypted.",
    msg_op_failed: "Operation failed: ",
    msg_bad_pass: "Incorrect passphrase or corrupted data.",
    msg_file_pass_required: "Please enter a passphrase for the file.",
    msg_select_file: "Please select a file first.",
    msg_file_encrypted_ok: "File encrypted and downloaded successfully! File removed from selection.",
    msg_invalid_file_struct: "Invalid encrypted file structure.",
    msg_file_decrypted_ok: "File decrypted and downloaded successfully! File removed from selection.",
    msg_file_failed: "File processing failed: ",
    msg_weak_pass: "Incorrect passphrase or invalid file.",
    msg_generated_passphrase: "Generated strong random passphrase.",
    msg_generated_file_passphrase: "Generated strong random passphrase for file.",
    copy_success: "Copy Success",
    msg_no_key_copy: "No key/passphrase to copy.",
    msg_copied: "Passphrase copied to clipboard!",
    msg_no_output_copy: "No output to copy.",
    msg_output_copied: "Output copied to clipboard!",
    msg_select_charset: "Please select at least one character set.",
    msg_gen_key: "Generated secure {n}-character key with high entropy.",
    msg_gen_copied: "Key copied to clipboard successfully!",
    msg_key_applied_text: "Generated key applied to Text Encryption passphrase.",
    msg_key_applied_file: "Generated key applied to File Encryption passphrase.",
    msg_cleared: "All inputs and outputs cleared.",
    msg_loaded_file: "Loaded file: {name} ({size} KB)",
    strength_none: "Passphrase strength",
    strength_weak: "Weak",
    strength_fair: "Fair",
    strength_strong: "Strong",
    strength_excellent: "Excellent",
    strength_bits: "{n} bits",
    crack_est: "Estimated time to crack: {t}",
    time_instant: "instantly",
    time_sec: "{n} sec",
    time_min: "{n} min",
    time_hr: "{n} hr",
    time_day: "{n} days",
    time_year: "{n} years",
    time_year_big: "{n} years",
    time_eternal: "practically forever",
    install_app: "Install",
    msg_installed: "App installed successfully!"
  },
  fa: {
    app_title: "🛡️ رمزنگاری و رمزگشایی امن",
    app_name: "رمزنگاری و رمزگشایی امن",
    gcm_secure: "امن GCM",
    header_subtitle: "رمزنگاری و رمزگشایی امن سمت کلاینت",
    clear_all: "پاک کردن همه",
    browser_crypto: "رمزنگاری مرورگر",
    tab_text: "رمزنگاری متن",
    tab_file: "رمزنگاری فایل",
    tab_generator: "تولید کلید",
    op_key: "عملیات و کلید",
    encrypt: "رمزنگاری",
    decrypt: "رمزگشایی",
    secret_passphrase: "رمز عبور / کلید",
    copy_key: "کپی کلید",
    passphrase_placeholder: "کلید یا رمز عبور امن را وارد کنید...",
    pbkdf2_hint: "PBKDF2 یک کلید AES ۲۵۶ بیتی تولید می‌کند.",
    generate_random: "تولید تصادفی",
    plaintext_input: "ورودی متن ساده",
    input_placeholder_encrypt: "پیام محرمانه خود را اینجا تایپ یا جای‌گذاری کنید...",
    input_placeholder_decrypt: "محتوای رمزنگاری‌شده Base64 را اینجا جای‌گذاری کنید...",
    chars: "نویسه",
    action_btn_encrypt: "رمزنگاری پیام",
    action_btn_decrypt: "رمزگشایی پیام",
    result_output: "خروجی نتیجه",
    copy_output: "کپی خروجی",
    encrypted_payload_b64: "محتوای رمزنگاری‌شده (Base64)",
    decrypted_plaintext_output: "خروجی متن رمزگشایی‌شده",
    output_placeholder: "خروجی امن اینجا نمایش داده می‌شود...",
    status_ready_encrypt: "آماده رمزنگاری. AES-256-GCM فعال است.",
    status_ready_decrypt: "آماده رمزگشایی. محتوای خود را جای‌گذاری کنید.",
    file_processor: "پردازش رمزنگاری فایل",
    file_subtitle: "هر فایلی را با AES-256-GCM مستقیماً در مرورگر خود به‌صورت امن رمزنگاری یا رمزگشایی کنید.",
    operation_mode: "حالت عملیات",
    encrypt_file: "رمزنگاری فایل",
    decrypt_file: "رمزگشایی فایل",
    file_passphrase: "رمز عبور رمزنگاری فایل",
    secret_key_placeholder: "کلید محرمانه...",
    generate_random_key: "تولید کلید تصادفی",
    custom_filename: "نام خروجی فایل (اختیاری)",
    custom_filename_placeholder: "مثلاً package.deb, song.mp3, archive.zip",
    custom_filename_hint: "اگر فایل رمزنگاری‌شده پسوند ندارد، هنگام رمزگشایی نام فایل را با پسوند مشخص کنید.",
    upload_prompt: "برای بارگذاری کلیک کنید یا فایل را اینجا رها کنید",
    any_format_hint: "همه انواع فایل پشتیبانی می‌شود (پردازش محلی)",
    process_file: "پردازش فایل",
    file_status_default: "برای شروع یک فایل انتخاب کنید و رمز عبور وارد کنید.",
    file_status_select_encrypt: "فایلی را برای رمزنگاری انتخاب کنید.",
    file_status_select_decrypt: "فایل رمزنگاری‌شده (.enc) را برای رمزگشایی انتخاب کنید.",
    gen_heading: "تولیدکننده کلید رمزنگاری",
    gen_subtitle: "کلیدها و رمزهای تصادفی با آنتروپی بالا برای رمزنگاری AES-256 تولید کنید.",
    key_length: "طول کلید:",
    key_length_chars: "نویسه",
    char_set: "مجموعه نویسه‌ها",
    symbols: "نمادها (!@#$)",
    numbers: "اعداد (0-9)",
    uppercase: "حروف بزرگ (A-Z)",
    lowercase: "حروف کوچک (a-z)",
    gen_secure_key: "کلید امن تولیدشده",
    gen_placeholder: "برای تولید کلیک کنید...",
    gen_button: "تولید کلید امن",
    gen_use_in_text: "استفاده در رمزنگاری متن",
    gen_use_in_file: "استفاده در رمزنگاری فایل",
    gen_status_default: "تنظیمات را پیکربندی کرده و تولید را کلیک کنید.",
    footer_text: "AES-256 Vault • بدون ارسال به سرور • مبتنی بر Web Crypto API",
    msg_no_passphrase: "لطفاً یک رمز عبور/کلید وارد کنید.",
    msg_enter_input: "لطفاً متن ورودی را وارد کنید.",
    msg_encrypted_ok: "پیام با AES-256-GCM با موفقیت رمزنگاری شد.",
    msg_invalid_payload: "قالب محتوای رمزنگاری‌شده نامعتبر است (خطای Base64/JSON).",
    msg_missing_params: "پارامترهای رمزنگاری ناقص است (نمک، بردار یا متن رمز).",
    msg_decrypted_ok: "پیام با موفقیت رمزگشایی شد.",
    msg_op_failed: "عملیات ناموفق: ",
    msg_bad_pass: "رمز عبور اشتباه یا داده خراب است.",
    msg_file_pass_required: "لطفاً رمز عبور فایل را وارد کنید.",
    msg_select_file: "لطفاً ابتدا یک فایل انتخاب کنید.",
    msg_file_encrypted_ok: "فایل با موفقیت رمزنگاری و دانلود شد! فایل از انتخاب حذف شد.",
    msg_invalid_file_struct: "ساختار فایل رمزنگاری‌شده نامعتبر است.",
    msg_file_decrypted_ok: "فایل با موفقیت رمزگشایی و دانلود شد! فایل از انتخاب حذف شد.",
    msg_file_failed: "پردازش فایل ناموفق: ",
    msg_weak_pass: "رمز عبور اشتباه یا فایل نامعتبر است.",
    msg_generated_passphrase: "رمز عبور تصادفی قوی تولید شد.",
    msg_generated_file_passphrase: "رمز عبور تصادفی قوی برای فایل تولید شد.",
    copy_success: "کپی شد",
    msg_no_key_copy: "هیچ کلید/رمزی برای کپی وجود ندارد.",
    msg_copied: "رمز عبور در کلیپ‌بورد کپی شد!",
    msg_no_output_copy: "هیچ خروجی برای کپی وجود ندارد.",
    msg_output_copied: "خروجی در کلیپ‌بورد کپی شد!",
    msg_select_charset: "لطفاً حداقل یک مجموعه نویسه انتخاب کنید.",
    msg_gen_key: "کلید امن {n} نویسه با آنتروپی بالا تولید شد.",
    msg_gen_copied: "کلید با موفقیت در کلیپ‌بورد کپی شد!",
    msg_key_applied_text: "کلید تولیدشده در رمز عبور رمزنگاری متن اعمال شد.",
    msg_key_applied_file: "کلید تولیدشده در رمز عبور رمزنگاری فایل اعمال شد.",
    msg_cleared: "همه ورودی‌ها و خروجی‌ها پاک شدند.",
    msg_loaded_file: "فایل بارگذاری شد: {name} ({size} KB)",
    strength_none: "قدرت رمز عبور",
    strength_weak: "ضعیف",
    strength_fair: "متوسط",
    strength_strong: "قوی",
    strength_excellent: "عالی",
    strength_bits: "{n} بیت",
    crack_est: "زمان تخمینی برای شکستن: {t}",
    time_instant: "آنی",
    time_sec: "{n} ثانیه",
    time_min: "{n} دقیقه",
    time_hr: "{n} ساعت",
    time_day: "{n} روز",
    time_year: "{n} سال",
    time_year_big: "{n} سال",
    time_eternal: "تقریباً ابدی",
    install_app: "نصب",
    msg_installed: "اپلیکیشن با موفقیت نصب شد!"
  }
};

function t(key, params) {
    const table = translations[currentLang] || translations.en;
    let s = (table && table[key]) || translations.en[key] || key;
    if (params) for (const k in params) s = s.split('{' + k + '}').join(params[k]);
    return s;
}

function applyLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        el.title = t(el.getAttribute('data-i18n-title'));
    });
    document.title = t('app_title');
    // Refresh JS-driven text controls to current language
    if (typeof updateTextModeUI === 'function') updateTextModeUI();
    if (typeof updateFileModeUI === 'function') updateFileModeUI();
    updateCounter();
    updateStrength('text');
    updateStrength('file');
    const box = document.getElementById('status-box');
    if (box) {
        document.getElementById('status-text').textContent = t(currentMode === 'encrypt' ? 'status_ready_encrypt' : 'status_ready_decrypt');
        box.className = "mt-6 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2";
        box.querySelector('i').className = "fa-solid fa-circle-info text-emerald-400";
    }
    const fbox = document.getElementById('file-status-box');
    if (fbox) {
        document.getElementById('file-status-text').textContent = t('file_status_default');
        fbox.className = "p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2";
        fbox.querySelector('i').className = "fa-solid fa-circle-info text-emerald-400";
    }
    const gbox = document.getElementById('gen-status-box');
    if (gbox) {
        document.getElementById('gen-status-text').textContent = t('gen_status_default');
        gbox.className = "p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2";
        gbox.querySelector('i').className = "fa-solid fa-circle-info text-emerald-400";
    }
    const langLbl = document.getElementById('lang-toggle-label');
    if (langLbl) langLbl.textContent = currentLang === 'fa' ? 'English' : 'فارسی';
}

function setLang(lang) {
    currentLang = lang === 'en' ? 'en' : 'fa';
    localStorage.setItem('aesLang', currentLang);
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'fa' ? 'rtl' : 'ltr';
    applyLanguage();
}

function toggleLang() {
    setLang(currentLang === 'fa' ? 'en' : 'fa');
}

// Initialize language on load (Persian by default)
document.addEventListener('DOMContentLoaded', () => {
    setLang(currentLang);
});
