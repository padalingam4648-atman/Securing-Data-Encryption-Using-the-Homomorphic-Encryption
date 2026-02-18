/**
 * CLIENT-SIDE DECRYPTION MODULE - CKKS ONLY
 */

// State management
let encryptedFile = null;
let secretKey = null;

// DOM Elements
const encryptedFileInput = document.getElementById('encryptedFileInput');
const encryptedDropZone = document.getElementById('encryptedDropZone');
const encryptedFileInfo = document.getElementById('encryptedFileInfo');
const encryptedFileName = document.getElementById('encryptedFileName');
const encryptedFileSize = document.getElementById('encryptedFileSize');
const removeEncryptedBtn = document.getElementById('removeEncryptedBtn');

const keyFileInput = document.getElementById('keyFileInput');
const keyDropZone = document.getElementById('keyDropZone');
const keyFileInfo = document.getElementById('keyFileInfo');
const keyFileName = document.getElementById('keyFileName');
const keyFileSize = document.getElementById('keyFileSize');
const removeKeyBtn = document.getElementById('removeKeyBtn');
const keyTextArea = document.getElementById('keyTextArea');

const tabBtns = document.querySelectorAll('.tab-btn');
const decryptBtn = document.getElementById('decryptBtn');
const errorMessage = document.getElementById('errorMessage');

// ============================================================================
// ENCRYPTED FILE HANDLING
// ============================================================================

encryptedDropZone.addEventListener('click', () => encryptedFileInput.click());

encryptedDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    encryptedDropZone.classList.add('drag-over');
});

encryptedDropZone.addEventListener('dragleave', () => {
    encryptedDropZone.classList.remove('drag-over');
});

encryptedDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    encryptedDropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) handleEncryptedFile(file);
});

encryptedFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleEncryptedFile(file);
});

function handleEncryptedFile(file) {
    encryptedFile = file;
    encryptedFileName.textContent = file.name;
    encryptedFileSize.textContent = formatFileSize(file.size);
    encryptedFileInfo.style.display = 'flex';
    checkDecryptReady();
}

removeEncryptedBtn.addEventListener('click', () => {
    encryptedFile = null;
    encryptedFileInput.value = '';
    encryptedFileInfo.style.display = 'none';
    checkDecryptReady();
});

// ============================================================================
// SECRET KEY HANDLING
// ============================================================================

// Tab switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tab}-tab`).classList.add('active');
        
        secretKey = null;
        checkDecryptReady();
    });
});

// Key file upload
keyDropZone.addEventListener('click', () => keyFileInput.click());

keyDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    keyDropZone.classList.add('drag-over');
});

keyDropZone.addEventListener('dragleave', () => {
    keyDropZone.classList.remove('drag-over');
});

keyDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    keyDropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) handleKeyFile(file);
});

keyFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleKeyFile(file);
});

async function handleKeyFile(file) {
    try {
        const keyContent = await file.text();
        secretKey = keyContent;
        keyFileName.textContent = file.name;
        keyFileSize.textContent = formatFileSize(file.size);
        keyFileInfo.style.display = 'flex';
        checkDecryptReady();
        showSuccess('Secret key loaded successfully');
    } catch (error) {
        showError('Failed to read key file');
    }
}

removeKeyBtn.addEventListener('click', () => {
    secretKey = null;
    keyFileInput.value = '';
    keyFileInfo.style.display = 'none';
    checkDecryptReady();
});

// Key text area
keyTextArea.addEventListener('input', () => {
    const keyText = keyTextArea.value.trim();
    if (keyText.length > 0) {
        secretKey = keyText;
        checkDecryptReady();
    } else {
        secretKey = null;
        checkDecryptReady();
    }
});

// ============================================================================
// DECRYPTION LOGIC
// ============================================================================

function checkDecryptReady() {
    const ready = encryptedFile && secretKey;
    decryptBtn.disabled = !ready;
}

decryptBtn.addEventListener('click', async () => {
    if (!encryptedFile || !secretKey) {
        showError('Please provide encrypted file and secret key');
        return;
    }
    
    await performDecryption();
});

async function performDecryption() {
    try {
        const encryptedData = await encryptedFile.text();
        
        sessionStorage.setItem('encryptedData', encryptedData);
        sessionStorage.setItem('secretKey', secretKey);
        sessionStorage.setItem('originalFileName', encryptedFile.name);
        
        window.location.href = 'decrypt-processing.html';
        
    } catch (error) {
        console.error('Decryption error:', error);
        showError('Failed to read encrypted file');
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid #10b981;
        color: #059669;
        padding: 12px;
        border-radius: 8px;
        margin: 15px 0;
        text-align: center;
    `;
    
    errorMessage.parentNode.insertBefore(successDiv, errorMessage);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// ============================================================================
// SECURITY: Clear sensitive data
// ============================================================================

window.addEventListener('beforeunload', () => {
    secretKey = null;
    encryptedFile = null;
    
    if (keyTextArea) keyTextArea.value = '';
    if (keyFileInput) keyFileInput.value = '';
    if (encryptedFileInput) encryptedFileInput.value = '';
});
