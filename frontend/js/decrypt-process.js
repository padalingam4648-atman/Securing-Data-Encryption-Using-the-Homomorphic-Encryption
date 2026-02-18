/**
 * CKKS DECRYPTION PROCESSING
 * Client-side decryption only
 */

// Retrieve decryption data
const encryptedData = sessionStorage.getItem('encryptedData');
const secretKeyString = sessionStorage.getItem('secretKey');
const originalFileName = sessionStorage.getItem('originalFileName');

// Check data
if (!encryptedData || !secretKeyString) {
    alert('Missing decryption data');
    window.location.href = 'decrypt.html';
}

// ============================================================================
// DECRYPTION PROCESS
// ============================================================================

async function startDecryption() {
    try {
        // Step 1: Validate Secret Key
        await updateStep(1, 'Validating secret key...', 1500);
        
        const secretKey = CKKSDecryption.parseSecretKey(secretKeyString);
        if (!secretKey.valid) {
            throw new Error('Invalid secret key format');
        }
        
        // Step 2: Load Encryption Context
        await updateStep(2, 'Loading CKKS context...', 1500);
        
        // Step 3: Decrypt Data
        await updateStep(3, 'Decrypting with CKKS...', 2000);
        
        const decryption = new CKKSDecryption(secretKey);
        const plaintext = await decryption.decrypt(encryptedData);
        
        // Step 4: Complete
        await updateStep(4, 'Decryption complete...', 1000);
        
        // Store result
        sessionStorage.setItem('decryptedData', plaintext);
        sessionStorage.setItem('decryptionSuccess', 'true');
        
        // Clear secret key
        sessionStorage.removeItem('secretKey');
        
        // Navigate to result
        setTimeout(() => {
            window.location.href = 'decrypt-result.html';
        }, 500);
        
    } catch (error) {
        console.error('Decryption failed:', error);
        sessionStorage.setItem('decryptionError', error.message);
        sessionStorage.setItem('decryptionSuccess', 'false');
        
        setTimeout(() => {
            window.location.href = 'decrypt-result.html';
        }, 1000);
    }
}

// ============================================================================
// UI UPDATE
// ============================================================================

async function updateStep(step, status, delay) {
    document.getElementById('statusText').textContent = status;
    
    const progress = (step / 4) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('progressText').textContent = Math.round(progress) + '%';
    
    for (let i = 1; i <= 4; i++) {
        const stepEl = document.getElementById('step' + i);
        stepEl.classList.remove('active', 'completed');
        
        if (i < step) {
            stepEl.classList.add('completed');
        } else if (i === step) {
            stepEl.classList.add('active');
        }
    }
    
    await new Promise(resolve => setTimeout(resolve, delay));
}

// ============================================================================
// START
// ============================================================================

window.addEventListener('DOMContentLoaded', () => {
    startDecryption();
});

// Clear sensitive data
window.addEventListener('beforeunload', () => {
    sessionStorage.removeItem('secretKey');
});
