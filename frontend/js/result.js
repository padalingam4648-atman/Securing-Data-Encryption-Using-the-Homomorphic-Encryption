// ===================================
// ENCRYPTION RESULT DISPLAY
// ===================================

// DOM Elements
const encryptedOutput = document.getElementById('encryptedOutput');
const privateKeyOutput = document.getElementById('privateKeyOutput');
const downloadBtn = document.getElementById('downloadBtn');

let encryptionResult = null;

// ===================================
// LOAD RESULTS
// ===================================
function loadResults() {
    console.log('Loading encryption results...');
    
    const storedData = sessionStorage.getItem('encryptionResult');
    
    if (!storedData) {
        console.error('No encryption result found');
        alert('No encryption result found. Redirecting to upload page.');
        window.location.href = 'upload.html';
        return;
    }
    
    try {
        encryptionResult = JSON.parse(storedData);
        console.log('Encryption result loaded:', encryptionResult);
        
        // Display secret key
        if (encryptionResult.secretKey) {
            privateKeyOutput.textContent = encryptionResult.secretKey;
            console.log('✓ Secret key displayed');
        } else {
            privateKeyOutput.textContent = 'Error: Secret key not found';
            console.error('Secret key missing from result');
        }
        
        // Display encrypted output (preview)
        if (encryptionResult.encrypted) {
            const encryptedPreview = encryptionResult.encrypted.substring(0, 500) + '...';
            encryptedOutput.textContent = encryptedPreview;
            console.log('✓ Encrypted output displayed');
        } else {
            encryptedOutput.textContent = 'Error: Encrypted data not found';
            console.error('Encrypted data missing from result');
        }
        
    } catch (error) {
        console.error('Error loading results:', error);
        encryptedOutput.textContent = 'Error loading results: ' + error.message;
        privateKeyOutput.textContent = 'Error loading key: ' + error.message;
    }
}

// ===================================
// COPY PRIVATE KEY
// ===================================
function copyPrivateKey() {
    if (!encryptionResult || !encryptionResult.secretKey) {
        alert('No private key available');
        return;
    }
    
    navigator.clipboard.writeText(encryptionResult.secretKey).then(() => {
        showNotification('Private key copied to clipboard!');
    }).catch(err => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = encryptionResult.secretKey;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            showNotification('Private key copied!');
        } catch (err) {
            alert('Failed to copy');
        }
        
        document.body.removeChild(textarea);
    });
}

// ===================================
// DOWNLOAD PRIVATE KEY
// ===================================
function downloadPrivateKey() {
    if (!encryptionResult || !encryptionResult.secretKey) {
        alert('No private key available');
        return;
    }
    
    const blob = new Blob([encryptionResult.secretKey], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ckks_secret_key_' + (encryptionResult.fileName || 'file') + '.key';
    document.body.appendChild(a);
    a.click();
    
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    showNotification('Private key downloaded!');
}

// ===================================
// DOWNLOAD ENCRYPTED FILE
// ===================================
downloadBtn.addEventListener('click', () => {
    if (!encryptionResult || !encryptionResult.encrypted) {
        alert('No encrypted data available');
        return;
    }
    
    const blob = new Blob([encryptionResult.encrypted], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'encrypted_' + (encryptionResult.fileName || 'file.txt');
    document.body.appendChild(a);
    a.click();
    
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    showNotification('Encrypted file downloaded!');
});

// ===================================
// NOTIFICATION
// ===================================
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ===================================
// INITIALIZE
// ===================================
window.addEventListener('DOMContentLoaded', () => {
    loadResults();
});
