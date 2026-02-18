/**
 * DECRYPTION RESULT DISPLAY
 * Shows decrypted plaintext to authorized user
 * 
 * SECURITY: No logging of plaintext data
 */

// Retrieve result data
const decryptionSuccess = sessionStorage.getItem('decryptionSuccess') === 'true';
const decryptedData = sessionStorage.getItem('decryptedData');
const decryptionError = sessionStorage.getItem('decryptionError');
const originalFileName = sessionStorage.getItem('originalFileName');
const decryptionMethod = sessionStorage.getItem('decryptionMethod');

// DOM Elements
const resultIcon = document.getElementById('resultIcon');
const resultTitle = document.getElementById('resultTitle');
const resultDescription = document.getElementById('resultDescription');
const securityNotice = document.getElementById('securityNotice');
const outputSection = document.getElementById('outputSection');
const decryptedOutput = document.getElementById('decryptedOutput');
const errorSection = document.getElementById('errorSection');
const errorText = document.getElementById('errorText');
const downloadBtn = document.getElementById('downloadBtn');

// ============================================================================
// DISPLAY RESULT
// ============================================================================

function displayResult() {
    if (decryptionSuccess && decryptedData) {
        displaySuccess();
    } else {
        displayError();
    }
}

function displaySuccess() {
    // Success icon
    resultIcon.innerHTML = `
        <svg class="checkmark" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle class="checkmark-circle" cx="50" cy="50" r="45" fill="none" stroke="url(#successGradient)" stroke-width="4"/>
            <path class="checkmark-check" d="M 30 50 L 45 65 L 70 35" fill="none" stroke="#10b981" stroke-width="5" stroke-linecap="round"/>
            <defs>
                <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:1" />
                </linearGradient>
            </defs>
        </svg>
    `;
    
    // Update title and description
    resultTitle.textContent = 'Decryption Successful!';
    resultDescription.textContent = `Your file has been decrypted using ${decryptionMethod.toUpperCase()} encryption`;
    
    // Show decrypted output
    decryptedOutput.textContent = decryptedData;
    outputSection.style.display = 'block';
    errorSection.style.display = 'none';
    downloadBtn.style.display = 'inline-flex';
    
    // Update security notice
    securityNotice.innerHTML = `
        <div class="notice-icon">✅</div>
        <div class="notice-content">
            <strong>Zero-Knowledge Decryption Complete</strong>
            <p>Your data was decrypted entirely in your browser. No server had access to your plaintext or secret key.</p>
        </div>
    `;
}

function displayError() {
    // Error icon
    resultIcon.innerHTML = `
        <svg class="error-icon-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#EF4444" stroke-width="4"/>
            <path d="M 35 35 L 65 65 M 65 35 L 35 65" stroke="#EF4444" stroke-width="5" stroke-linecap="round"/>
        </svg>
    `;
    
    // Update title and description
    resultTitle.textContent = 'Decryption Failed';
    resultDescription.textContent = 'Unable to decrypt the file with provided key';
    
    // Show error details
    errorText.textContent = decryptionError || 'Unknown error occurred during decryption';
    errorSection.style.display = 'block';
    outputSection.style.display = 'none';
    downloadBtn.style.display = 'none';
    
    // Update security notice
    securityNotice.innerHTML = `
        <div class="notice-icon">⚠️</div>
        <div class="notice-content">
            <strong>Decryption Failed</strong>
            <p>Please verify your secret key and encryption method, then try again.</p>
        </div>
    `;
    securityNotice.style.background = 'rgba(239, 68, 68, 0.1)';
    securityNotice.style.borderColor = '#EF4444';
}

// ============================================================================
// DOWNLOAD FUNCTIONALITY
// ============================================================================

function downloadPlaintext() {
    if (!decryptedData) {
        alert('No decrypted data available');
        return;
    }
    
    // Create blob with decrypted data
    const blob = new Blob([decryptedData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    
    // Generate filename
    let filename = 'decrypted.txt';
    if (originalFileName) {
        filename = originalFileName.replace('.enc', '').replace('.encrypted', '') + '_decrypted.txt';
    }
    a.download = filename;
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Clean up
    URL.revokeObjectURL(url);
    
    // Show success message
    showNotification('File downloaded successfully!');
}

// ============================================================================
// COPY TO CLIPBOARD
// ============================================================================

function copyToClipboard() {
    if (!decryptedData) {
        alert('No data to copy');
        return;
    }
    
    // Copy to clipboard
    navigator.clipboard.writeText(decryptedData).then(() => {
        showNotification('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
        
        // Fallback method
        const textarea = document.createElement('textarea');
        textarea.value = decryptedData;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            showNotification('Copied to clipboard!');
        } catch (err) {
            alert('Failed to copy to clipboard');
        }
        
        document.body.removeChild(textarea);
    });
}

// ============================================================================
// NOTIFICATION
// ============================================================================

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

// ============================================================================
// INITIALIZE
// ============================================================================

window.addEventListener('DOMContentLoaded', () => {
    displayResult();
});

// ============================================================================
// SECURITY: Clear sensitive data
// ============================================================================

window.addEventListener('beforeunload', () => {
    // Clear all decryption data from sessionStorage
    sessionStorage.removeItem('decryptedData');
    sessionStorage.removeItem('encryptedData');
    sessionStorage.removeItem('secretKey');
    sessionStorage.removeItem('decryptionMethod');
    sessionStorage.removeItem('decryptionSuccess');
    sessionStorage.removeItem('decryptionError');
    sessionStorage.removeItem('originalFileName');
});

// Prevent right-click on decrypted output (optional security measure)
decryptedOutput.addEventListener('contextmenu', (e) => {
    // Allow context menu but warn user
    // e.preventDefault();
    // alert('Please be careful when copying sensitive decrypted data');
});
