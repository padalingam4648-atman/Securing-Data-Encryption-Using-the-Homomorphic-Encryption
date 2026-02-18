// ===================================
// FILE UPLOAD HANDLER - CKKS ONLY
// ===================================

// DOM Elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const removeBtn = document.getElementById('removeBtn');
const uploadBtn = document.getElementById('uploadBtn');
const errorMessage = document.getElementById('errorMessage');

let selectedFile = null;

// ===================================
// FILE VALIDATION
// ===================================
function validateFile(file) {
    // Check if file is .txt
    if (!file.name.endsWith('.txt')) {
        showError('Please select a .txt file only');
        return false;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showError('File size must be less than 10MB');
        return false;
    }
    
    return true;
}

// ===================================
// DISPLAY FILE INFO
// ===================================
function displayFileInfo(file) {
    selectedFile = file;
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    fileInfo.style.display = 'flex';
    dropZone.style.display = 'none';
    uploadBtn.disabled = false;
    hideError();
}

// ===================================
// FORMAT FILE SIZE
// ===================================
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ===================================
// ERROR HANDLING
// ===================================
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

// ===================================
// DRAG AND DROP HANDLERS
// ===================================
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (validateFile(file)) {
            displayFileInfo(file);
        }
    }
});

// ===================================
// FILE INPUT HANDLER
// ===================================
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
        displayFileInfo(file);
    }
});

// ===================================
// REMOVE FILE HANDLER
// ===================================
removeBtn.addEventListener('click', () => {
    selectedFile = null;
    fileInput.value = '';
    fileInfo.style.display = 'none';
    dropZone.style.display = 'block';
    uploadBtn.disabled = true;
    hideError();
});

// ===================================
// ENCRYPT FILE (CLIENT-SIDE)
// ===================================
uploadBtn.addEventListener('click', async () => {
    if (!selectedFile) {
        showError('Please select a file first');
        return;
    }
    
    // Disable button during encryption
    uploadBtn.disabled = true;
    uploadBtn.textContent = 'Encrypting...';
    
    try {
        // Read file content
        const fileContent = await selectedFile.text();
        
        // Store for processing
        sessionStorage.setItem('plaintextData', fileContent);
        sessionStorage.setItem('fileName', selectedFile.name);
        
        // Redirect to processing page
        window.location.href = 'processing.html';
        
    } catch (error) {
        console.error('File read error:', error);
        showError('Failed to read file');
        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Encrypt File';
    }
});
