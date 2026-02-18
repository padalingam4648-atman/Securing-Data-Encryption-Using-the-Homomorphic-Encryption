// ===================================
// CKKS ENCRYPTION PROCESSING
// ===================================

// DOM Elements
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

let ckksContext = null;
let ckksEncryption = null;

// ===================================
// PROCESS ENCRYPTION
// ===================================
async function processEncryption() {
    try {
        console.log('Starting encryption process...');
        
        // Get plaintext data
        const plaintextData = sessionStorage.getItem('plaintextData');
        const fileName = sessionStorage.getItem('fileName');
        
        console.log('Plaintext data:', plaintextData ? 'Found' : 'Missing');
        console.log('File name:', fileName);
        
        if (!plaintextData) {
            console.error('No plaintext data found');
            alert('No file data found. Please upload a file first.');
            window.location.href = 'upload.html';
            return;
        }
        
        // Step 1: Initialize CKKS Context (33%)
        step1.classList.add('active');
        updateProgress(10);
        updateStepText(1, 'Initializing CKKS Context', 
            'Setting up 8192 polynomial degree with 128-bit security...');
        
        console.log('Creating CKKS context...');
        ckksContext = new CKKSContext();
        await ckksContext.initialize();
        console.log('✓ Context initialized');
        await delay(1000);
        
        updateProgress(33);
        step1.classList.remove('active');
        step1.classList.add('completed');
        
        // Step 2: Generate Cryptographic Keys (66%)
        step2.classList.add('active');
        updateStepText(2, 'Generating Cryptographic Keys', 
            'Creating public key, secret key, relinearization and Galois keys...');
        
        console.log('Generating keys...');
        await ckksContext.generateKeys();
        console.log('✓ Keys generated');
        await delay(1500);
        
        updateProgress(66);
        step2.classList.remove('active');
        step2.classList.add('completed');
        
        // Step 3: Encrypting Data (100%)
        step3.classList.add('active');
        updateStepText(3, 'Encrypting Data', 
            'Encoding plaintext and applying CKKS encryption...');
        
        console.log('Encrypting data...');
        ckksEncryption = new CKKSEncryption(ckksContext);
        const encrypted = await ckksEncryption.encrypt(plaintextData);
        console.log('✓ Encryption complete');
        
        await delay(1500);
        updateProgress(100);
        step3.classList.remove('active');
        step3.classList.add('completed');
        
        // Store results
        const result = {
            encrypted: ckksEncryption.formatCiphertext(encrypted),
            secretKey: ckksContext.formatSecretKey(),
            publicKey: ckksContext.getPublicKey(),
            fileName: fileName,
            timestamp: new Date().toISOString()
        };
        
        console.log('Storing results...');
        sessionStorage.setItem('encryptionResult', JSON.stringify(result));
        
        // Clear plaintext from session
        sessionStorage.removeItem('plaintextData');
        console.log('✓ Results stored, redirecting...');
        
        // Redirect to result page
        await delay(500);
        window.location.href = 'result.html';
        
    } catch (error) {
        console.error('Encryption error:', error);
        alert('Encryption failed: ' + error.message + '\n\nPlease check the browser console for details.');
        window.location.href = 'upload.html';
    }
}

// ===================================
// UPDATE STEP TEXT
// ===================================
function updateStepText(stepNum, title, description) {
    const step = document.getElementById('step' + stepNum);
    const titleEl = step.querySelector('.step-title');
    const descEl = step.querySelector('.step-description');
    
    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = description;
}

// ===================================
// UPDATE PROGRESS BAR
// ===================================
function updateProgress(percent) {
    progressBar.style.width = percent + '%';
    progressText.textContent = percent + '%';
}

// ===================================
// DELAY HELPER
// ===================================
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ===================================
// INITIALIZE
// ===================================
window.addEventListener('DOMContentLoaded', () => {
    console.log('Processing page loaded');
    
    const plaintextData = sessionStorage.getItem('plaintextData');
    
    if (!plaintextData) {
        console.error('No plaintext data in session');
        alert('No file data found. Redirecting to upload page.');
        window.location.href = 'upload.html';
        return;
    }
    
    console.log('Starting encryption process...');
    // Start encryption process
    processEncryption();
});
