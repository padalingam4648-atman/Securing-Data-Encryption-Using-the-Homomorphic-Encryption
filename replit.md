# Securing Cloud Storage Using Homomorphic Encryption

## Overview
This is a Python CLI application that demonstrates secure cloud storage using homomorphic encryption. The application takes a text file, encrypts it using TenSEAL's CKKS homomorphic encryption scheme, compresses it, and uploads it to Dropbox.

## Purpose
The project showcases how to:
- Convert text files to ASCII format
- Apply homomorphic encryption to protect data privacy
- Compress encrypted files to reduce storage size
- Upload encrypted data to cloud storage (Dropbox)

## Project Architecture

### Main Components
- **ASCII Conversion**: Converts input text to ASCII values for processing
- **Homomorphic Encryption**: Uses TenSEAL library with CKKS scheme for encryption
- **Compression**: GZIP compression to reduce file size
- **Cloud Upload**: Dropbox integration with retry logic for reliable uploads

### Technology Stack
- **Language**: Python 3.11
- **Package Manager**: UV (modern Python package manager)
- **Key Dependencies**:
  - `tenseal`: Homomorphic encryption library
  - `dropbox`: Dropbox SDK for file uploads
  - `retrying`: Retry decorator for network operations
  - `numpy`: Required by TenSEAL

## How to Use

### Method 1: Using the Workflow (Recommended)
1. Click the "Run" button in Replit - it will process the included `sample.txt` file
2. To process your own file, update the workflow command in the Replit interface
3. (Optional) Set the `DROPBOX_ACCESS_TOKEN` environment variable to enable Dropbox upload

### Method 2: Using the Shell
1. Open the Shell tab in Replit
2. Run: `python "Securing Cloud Storage Using Homomorphic Encryption.py" your_file.txt`
3. (Optional) Set the `DROPBOX_ACCESS_TOKEN` environment variable to enable Dropbox upload

The application will:
- Convert the file to ASCII
- Encrypt it using homomorphic encryption
- Compress the encrypted file
- Upload to Dropbox (if access token is configured) or save locally

## File Structure
```
.
├── Securing Cloud Storage Using Homomorphic Encryption.py  # Main application
├── sample.txt                                              # Sample input file
├── .gitignore                                              # Git ignore patterns
├── pyproject.toml                                          # Python dependencies
└── replit.md                                               # This documentation
```

## Generated Files
The application creates temporary files during execution:
- `output_ascii.txt`: ASCII representation of input file
- `encrypted_output.txt`: Encrypted data
- `encrypted_output.txt.gz`: Compressed encrypted file (uploaded to Dropbox)

These files are gitignored to prevent committing sensitive data.

## Recent Changes
- **2025-11-27**: Initial import and setup in Replit environment
  - Installed Python 3.11 and all dependencies (tenseal, dropbox, retrying, numpy)
  - Modified application to use command-line arguments instead of interactive input
  - Changed Dropbox token to use environment variable (DROPBOX_ACCESS_TOKEN)
  - Created sample.txt for testing
  - Created .gitignore for Python project
  - Configured workflow to run the application with sample file
  - Created project documentation

## Notes
- The application requires a valid Dropbox access token
- Encrypted files use CKKS homomorphic encryption scheme (allows operations on encrypted data)
- Network operations include retry logic for reliability
