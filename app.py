import tenseal as ts
import base64
import gzip
import os
import dropbox
from flask import Flask, render_template, request, send_file, jsonify
from retrying import retry
from io import BytesIO

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size

def convert_to_ascii(file_content):
    """Converts text content to ASCII format."""
    ascii_values = [str(ord(char)) for char in file_content]
    return ' '.join(ascii_values)

def encrypt_data(ascii_content):
    """Encrypts ASCII data using TenSEAL's CKKS homomorphic encryption."""
    try:
        context = ts.context(
            ts.SCHEME_TYPE.CKKS,
            poly_modulus_degree=8192,
            coeff_mod_bit_sizes=[60, 40, 40, 60]
        )
        context.global_scale = 2**40
        context.generate_galois_keys()
        
        ascii_values = [float(value) for value in ascii_content.split()]
        encrypted_vector = ts.ckks_vector(context, ascii_values)
        serialized_data = base64.b64encode(encrypted_vector.serialize()).decode('utf-8')
        return serialized_data
    except Exception as e:
        raise Exception(f"Encryption failed: {str(e)}")

def compress_data(data):
    """Compresses data using gzip."""
    compressed = BytesIO()
    with gzip.GzipFile(fileobj=compressed, mode='wb') as gz:
        gz.write(data.encode('utf-8') if isinstance(data, str) else data)
    compressed.seek(0)
    return compressed.getvalue()

@retry(stop_max_attempt_number=3, wait_fixed=1000)
def upload_to_dropbox(access_token, file_data, file_name):
    """Uploads file to Dropbox."""
    dbx = dropbox.Dropbox(access_token)
    try:
        dbx.files_upload(file_data, f'/{file_name}', mode=dropbox.files.WriteMode('overwrite'))
        return True
    except Exception as e:
        raise Exception(f"Dropbox upload failed: {str(e)}")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/encrypt', methods=['POST'])
def encrypt_file():
    """Endpoint to encrypt uploaded file."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        file_content = file.read().decode('utf-8')
        ascii_content = convert_to_ascii(file_content)
        encrypted_content = encrypt_data(ascii_content)
        compressed_data = compress_data(encrypted_content)
        
        return {
            'success': True,
            'filename': file.filename,
            'encrypted_size': len(compressed_data),
            'message': 'File encrypted successfully'
        }
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/upload-and-encrypt', methods=['POST'])
def upload_and_encrypt():
    """Endpoint to encrypt file and optionally upload to Dropbox."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    dropbox_token = request.form.get('dropbox_token', '').strip()
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        file_content = file.read().decode('utf-8')
        ascii_content = convert_to_ascii(file_content)
        encrypted_content = encrypt_data(ascii_content)
        compressed_data = compress_data(encrypted_content)
        
        result = {
            'success': True,
            'filename': f"{file.filename}.encrypted.gz",
            'size': len(compressed_data)
        }
        
        if dropbox_token:
            try:
                upload_to_dropbox(dropbox_token, compressed_data, f"{file.filename}.encrypted.gz")
                result['dropbox_uploaded'] = True
                result['message'] = 'File encrypted and uploaded to Dropbox'
            except Exception as e:
                result['dropbox_error'] = str(e)
                result['message'] = f'File encrypted but Dropbox upload failed: {str(e)}'
        else:
            result['message'] = 'File encrypted successfully'
        
        return result
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/download-template', methods=['GET'])
def download_template():
    """Provides a template of encrypted file for download."""
    try:
        if not os.path.exists('encrypted_output.txt.gz'):
            return jsonify({'error': 'No encrypted file available'}), 404
        
        return send_file(
            'encrypted_output.txt.gz',
            as_attachment=True,
            download_name='encrypted_output.gz'
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
