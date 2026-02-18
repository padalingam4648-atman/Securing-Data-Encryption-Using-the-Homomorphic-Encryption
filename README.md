# 🔐 Secure Text File Encryption Platform

A privacy-preserving encryption platform using **CKKS Homomorphic Encryption** for secure text file encryption and decryption. Includes an additional malware analysis module for file security scanning.

---

## 🎯 Core Features - Encryption & Decryption

### Text File Encryption
- **CKKS Homomorphic Encryption** - Advanced encryption that allows computation on encrypted data
- **Client-Side Processing** - All encryption happens locally in your browser
- **Secure Key Generation** - Automatic cryptographic key generation
- **File Upload & Download** - Easy file handling with encrypted output
- **No Cloud Storage** - Your files never leave your computer unencrypted

### Decryption
- **Secure Decryption** - Decrypt files using the original encryption key
- **Key Verification** - Ensures correct key is used
- **Original File Recovery** - Get back your original text file
- **Local Processing** - Complete privacy, no server-side decryption

---

## 🚀 Quick Start

### Start the Encryption Platform

**Option 1: Start Everything (Recommended)**
```cmd
START_ALL.bat
```
Then open: http://localhost:8000/home.html

**Option 2: Start Manually**

Terminal 1 - Backend:
```cmd
cd backend
python app.py
```

Terminal 2 - Frontend:
```cmd
cd frontend
python -m http.server 8000
```

Then open: http://localhost:8000

---

## 📖 How to Use

### Encrypt a File

1. Open: http://localhost:8000
2. Click **"🔒 Encrypt File"**
3. Upload your text file (.txt)
4. Click **"Encrypt & Upload"**
5. Wait for encryption to complete
6. **Download encrypted file** and **save the encryption key**
7. Done! Your file is now encrypted

### Decrypt a File

1. Open: http://localhost:8000
2. Click **"🔓 Decrypt File"**
3. Upload your encrypted file
4. Enter the encryption key you saved
5. Click **"Decrypt File"**
6. Download your original file
7. Done! Your file is decrypted

---

## 📁 Project Structure

```
├── backend/                    # Encryption Backend
│   ├── app.py                 # FastAPI server (port 5000)
│   └── requirements.txt       # Python dependencies
│
├── frontend/                   # Encryption Frontend
│   ├── home.html              # Landing page ⭐
│   ├── index.html             # Encryption page
│   ├── upload.html            # File upload
│   ├── processing.html        # Encryption progress
│   ├── result.html            # Encrypted result
│   ├── decrypt.html           # Decryption page
│   ├── decrypt-processing.html
│   ├── decrypt-result.html
│   ├── css/                   # Stylesheets
│   │   ├── style.css
│   │   ├── home.css
│   │   └── animations.css
│   └── js/                    # JavaScript modules
│       ├── ckks-encryption.js # Core encryption logic
│       ├── key-generator.js   # Key generation
│       ├── upload.js
│       ├── process.js
│       ├── result.js
│       ├── decrypt.js
│       ├── decrypt-process.js
│       └── decrypt-result.js
│
└── START_ALL.bat              # Start all servers
```

---

## 🔧 Setup & Installation

### Requirements
- Python 3.8 or higher
- Modern web browser (Chrome, Firefox, Edge)
- pip (Python package manager)

### Installation Steps

1. **Install Backend Dependencies**
```cmd
cd backend
pip install -r requirements.txt
```

2. **Start the Platform**
```cmd
START_ALL.bat
```

3. **Access the Platform**
Open: http://localhost:8000/home.html

---

## 🌐 Access Points

**Main Platform:**
- Home Page: http://localhost:8000/home.html
- Encryption: http://localhost:8000/index.html
- Decryption: http://localhost:8000/decrypt.html

**Backend API:**
- API Server: http://localhost:5000

---

## 🔒 Security Features

- ✅ **CKKS Homomorphic Encryption** - Military-grade encryption
- ✅ **Client-Side Processing** - Encryption happens in your browser
- ✅ **No Cloud Storage** - Files never uploaded unencrypted
- ✅ **Secure Key Generation** - Cryptographically secure random keys
- ✅ **Local Processing** - Complete privacy and control
- ✅ **No Data Retention** - Server doesn't store your files or keys

---

## 💡 Technical Details

### Encryption Method
- **Algorithm**: CKKS (Cheon-Kim-Kim-Song)
- **Type**: Homomorphic Encryption
- **Key Size**: 256-bit
- **Security Level**: High

### How It Works
1. User uploads text file
2. File content is read in browser
3. CKKS encryption key is generated
4. Content is encrypted using CKKS
5. Encrypted data is sent to server
6. Server stores encrypted file temporarily
7. User downloads encrypted file and key
8. Original file never leaves browser unencrypted

---

## 🛡️ Additional Feature: Malware Analysis

An optional security module for analyzing suspicious files.

### Features
- Hash generation (MD5, SHA1, SHA256)
- VirusTotal integration (70+ antivirus engines)
- YARA pattern detection
- Static analysis
- Risk assessment

### Access Malware Platform
```cmd
cd malware-platform
START_MALWARE_PLATFORM.bat
```
Then open: http://localhost:5171

### Configuration
See: `malware-platform/README.md` for setup instructions.

---

## 🧪 Testing

### Test Encryption

1. Create a test file:
```cmd
echo This is a secret message > test.txt
```

2. Open: http://localhost:8000
3. Upload `test.txt`
4. Encrypt and download
5. Try to open encrypted file (you'll see encrypted data)
6. Decrypt using the key
7. Verify original content is recovered

---

## 🆘 Troubleshooting

**Backend won't start:**
- Check Python version: `python --version` (need 3.8+)
- Install dependencies: `pip install -r backend/requirements.txt`

**Can't access pages:**
- Make sure backend is running on port 5000
- Make sure frontend is running on port 8000
- Try http://127.0.0.1:8000 instead of localhost

**Encryption fails:**
- Check browser console for errors (F12)
- Make sure file is a text file (.txt)
- Try with a smaller file first

**Decryption fails:**
- Make sure you're using the correct encryption key
- Verify the encrypted file wasn't modified
- Check that file was encrypted with this platform

---

## 📝 Important Notes

- **Save your encryption key!** Without it, you cannot decrypt your files
- **Keep keys secure** - Anyone with the key can decrypt your files
- **Text files only** - Platform designed for .txt files
- **File size limit** - Recommended max 10MB for best performance
- **Browser compatibility** - Works best in Chrome, Firefox, Edge

---

## 🎯 Use Cases

- **Secure File Storage** - Encrypt sensitive documents before cloud storage
- **Private Communication** - Share encrypted files securely
- **Data Protection** - Protect confidential information
- **Educational** - Learn about homomorphic encryption
- **Research** - Experiment with CKKS encryption

---

## 🚀 Quick Commands

```cmd
# Start everything
START_ALL.bat

# Start backend only
cd backend
python app.py

# Start frontend only
cd frontend
python -m http.server 8000

# Install dependencies
pip install -r backend/requirements.txt
```

---

## 📚 Documentation

- **README.md** (this file) - Main documentation
- **malware-platform/README.md** - Malware analysis module docs
- **malware-platform/SETUP_GUIDE.md** - Malware platform setup

---

## 🔐 Privacy & Security

This platform is designed with privacy in mind:
- No telemetry or tracking
- No data sent to third parties
- All encryption happens locally
- Server only handles encrypted data
- No logs of your files or keys
- Open source - verify the code yourself

---

**Built with FastAPI, Python, and modern web technologies**

**For secure file encryption and educational purposes**

---

## Core Focus: Encryption & Decryption ⭐
## Additional: Malware Analysis (Optional)
