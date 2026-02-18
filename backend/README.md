# Backend API for Homomorphic Encryption

## Installation

```bash
cd backend
pip install -r requirements.txt
```

## Run Server

```bash
python app.py
```

Server will start at: http://localhost:5000

## API Endpoint

**POST** `/api/encrypt`

**Request:**
- Content-Type: multipart/form-data
- Body: file (text file)

**Response:**
```json
{
  "filename": "example.txt",
  "ascii_output": "72 101 108 108 111...",
  "encrypted_output": "hex_encoded_encrypted_data"
}
```
