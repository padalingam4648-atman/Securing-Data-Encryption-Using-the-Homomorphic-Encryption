from flask import Flask, request, jsonify
from flask_cors import CORS
from phe import paillier
import tenseal as ts
import json
import os
import base64
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Generate Paillier keypair (Optimized for speed)
print("🔐 Generating Paillier keypair...")
public_key_paillier, private_key_paillier = paillier.generate_paillier_keypair(n_length=1024)  # Reduced from 2048 for speed
print("✅ Paillier keypair generated!")

# Generate TenSEAL CKKS context (Optimized)
print("🔐 Generating CKKS context...")
context_ckks = ts.context(
    ts.SCHEME_TYPE.CKKS,
    poly_modulus_degree=4096,  # Reduced from 8192 for speed
    coeff_mod_bit_sizes=[40, 20, 40]
)
context_ckks.global_scale = 2**20
context_ckks.generate_galois_keys()
print("✅ CKKS context generated!")

# Generate TenSEAL BFV context (Optimized)
print("🔐 Generating BFV context...")
context_bfv = ts.context(
    ts.SCHEME_TYPE.BFV,
    poly_modulus_degree=4096,
    plain_modulus=786433
)
# Don't generate galois keys for BFV to avoid keyswitching error
print("✅ BFV context generated!")

@app.route('/api/encrypt', methods=['POST'])
def encrypt_file():
    try:
        # Get uploaded file
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Get encryption method (default: all three)
        method = request.form.get('method', 'all')
        
        # Read file content
        content = file.read().decode('utf-8')
        
        # Step 1: Convert to ASCII
        ascii_values = [ord(char) for char in content]
        ascii_output = ' '.join(str(val) for val in ascii_values)
        
        results = {
            'filename': file.filename,
            'ascii_output': ascii_output,
            'original_size': len(content),
            'methods': {}
        }
        
        # Method 1: Paillier Encryption (Optimized - only store ciphertext)
        if method in ['all', 'paillier']:
            start_time = time.time()
            paillier_output = []
            for ascii_val in ascii_values:
                encrypted_number = public_key_paillier.encrypt(ascii_val)
                paillier_output.append(str(encrypted_number.ciphertext()))
            paillier_time = time.time() - start_time
            paillier_encrypted_text = ''.join(paillier_output)
            
            results['methods']['paillier'] = {
                'encrypted_data': paillier_encrypted_text,
                'encryption_time': f"{paillier_time:.4f}s",
                'size': f"{len(paillier_encrypted_text)} bytes"
            }
        
        # Method 2: CKKS Encryption (Optimized)
        if method in ['all', 'ckks']:
            start_time = time.time()
            ascii_floats = [float(val) for val in ascii_values]
            ckks_encrypted = ts.ckks_vector(context_ckks, ascii_floats)
            ckks_serialized = base64.b64encode(ckks_encrypted.serialize()).decode('utf-8')
            ckks_time = time.time() - start_time
            
            results['methods']['ckks'] = {
                'encrypted_data': ckks_serialized,
                'encryption_time': f"{ckks_time:.4f}s",
                'size': f"{len(ckks_serialized)} bytes"
            }
        
        # Method 3: BFV Encryption (Optimized)
        if method in ['all', 'bfv']:
            start_time = time.time()
            bfv_encrypted = ts.bfv_vector(context_bfv, ascii_values)
            bfv_serialized = base64.b64encode(bfv_encrypted.serialize()).decode('utf-8')
            bfv_time = time.time() - start_time
            
            results['methods']['bfv'] = {
                'encrypted_data': bfv_serialized,
                'encryption_time': f"{bfv_time:.4f}s",
                'size': f"{len(bfv_serialized)} bytes"
            }
        
        return jsonify(results)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/decrypt', methods=['POST'])
def decrypt_file():
    """
    Decrypt endpoint - demonstrates that decryption requires private key
    """
    try:
        data = request.get_json()
        method = data.get('method', 'paillier')
        
        if method == 'paillier':
            encrypted_data = json.loads(data['encrypted_output'])
            decrypted_chars = []
            for enc_val in encrypted_data:
                encrypted_number = paillier.EncryptedNumber(
                    public_key_paillier,
                    int(enc_val['ciphertext']),
                    enc_val['exponent']
                )
                decrypted_value = private_key_paillier.decrypt(encrypted_number)
                decrypted_chars.append(chr(int(decrypted_value)))
            
            decrypted_content = ''.join(decrypted_chars)
            
        elif method == 'ckks':
            encrypted_data = base64.b64decode(data['encrypted_output'])
            ckks_vector = ts.ckks_vector_from(context_ckks, encrypted_data)
            decrypted_values = ckks_vector.decrypt()
            decrypted_chars = [chr(int(round(val))) for val in decrypted_values]
            decrypted_content = ''.join(decrypted_chars)
            
        elif method == 'bfv':
            encrypted_data = base64.b64decode(data['encrypted_output'])
            bfv_vector = ts.bfv_vector_from(context_bfv, encrypted_data)
            decrypted_values = bfv_vector.decrypt()
            decrypted_chars = [chr(val) for val in decrypted_values]
            decrypted_content = ''.join(decrypted_chars)
        
        return jsonify({
            'decrypted_content': decrypted_content,
            'method': method,
            'message': f'Successfully decrypted using {method.upper()} private key'
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 Backend server starting...")
    print("="*60)
    print("📡 Encrypt endpoint: http://localhost:5000/api/encrypt")
    print("🔓 Decrypt endpoint: http://localhost:5000/api/decrypt")
    print("✅ CORS enabled for frontend communication")
    print("\n🔐 Available Encryption Methods:")
    print("   1. Paillier (Partially Homomorphic - Addition)")
    print("   2. CKKS (Approximate FHE - ML/AI)")
    print("   3. BFV (Fully Homomorphic - Most Powerful)")
    print("="*60 + "\n")
    app.run(debug=True, port=5000)
