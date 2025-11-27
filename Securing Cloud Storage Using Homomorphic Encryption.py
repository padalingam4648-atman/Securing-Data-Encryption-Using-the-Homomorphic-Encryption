import tenseal as ts
import base64
import gzip
import os
import sys
import dropbox
from retrying import retry  # For retrying network operations

def convert_to_ascii(input_file):
    """Converts a text file to ASCII format."""
    output_file = "output_ascii.txt"

    try:
        with open(input_file, 'r') as infile, open(output_file, 'w') as outfile:
            for line in infile:
                ascii_values = [str(ord(char)) for char in line]
                ascii_string = ' '.join(ascii_values)
                outfile.write(ascii_string + '\n')

        print(f"ASCII conversion completed. Output saved to {output_file}")
        return output_file
    except FileNotFoundError:
        print(f"Error: File '{input_file}' not found.")
    except Exception as e:
        print(f"An error occurred during ASCII conversion: {str(e)}")

def encrypt_file(input_file):
    """Encrypts an ASCII file using TenSEAL's CKKS homomorphic encryption."""
    output_file = "encrypted_output.txt"

    try:
        # Create TenSEAL context
        context = ts.context(
            ts.SCHEME_TYPE.CKKS,
            poly_modulus_degree=8192,
            coeff_mod_bit_sizes=[60, 40, 40, 60]
        )
        context.global_scale = 2**40
        context.generate_galois_keys()

        # Read and process ASCII values
        with open(input_file, 'r') as file:
            ascii_content = file.read().strip().split()
        ascii_values = [float(value) for value in ascii_content]

        # Encrypt values as a single vector
        encrypted_vector = ts.ckks_vector(context, ascii_values)
        serialized_data = base64.b64encode(encrypted_vector.serialize()).decode('utf-8')

        # Save encrypted data
        with open(output_file, 'w') as file:
            file.write(serialized_data)

        print(f"File has been encrypted and saved as {output_file}")
        return output_file
    except FileNotFoundError:
        print(f"The file {input_file} was not found.")
    except Exception as e:
        print(f"An error occurred during encryption: {str(e)}")

def compress_and_reduce_file(input_file):
    """Compresses and reduces a text file."""
    output_file = input_file + '.gz'

    if not os.path.isfile(input_file):
        print(f"The file {input_file} does not exist.")
        return

    try:
        with open(input_file, 'r') as f_in, gzip.open(output_file, 'wt') as f_out:
            for line in f_in:
                stripped_line = line.strip()
                if stripped_line:
                    f_out.write(stripped_line + '\n')

        print(f"Compressed and reduced file has been written to {output_file}")
        return output_file
    except Exception as e:
        print(f"An error occurred during compression: {str(e)}")

@retry(stop_max_attempt_number=3, wait_fixed=1000)  # Retry up to 3 times with a 2-second wait
def upload_to_dropbox(access_token, file_path):
    """Uploads a file to Dropbox."""
    dbx = dropbox.Dropbox(access_token)

    if not os.path.isfile(file_path):
        print(f"The file {file_path} does not exist.")
        return

    file_name = os.path.basename(file_path)
    upload_path = '/' + file_name

    try:
        with open(file_path, 'rb') as f:
            dbx.files_upload(f.read(), upload_path, mode=dropbox.files.WriteMode('overwrite'))
        print(f"File {file_name} uploaded to Dropbox at {upload_path}")
    except dropbox.exceptions.ApiError as e:
        print(f"API error during Dropbox upload: {str(e)}")
        raise  # Retry in case of network issues
    except Exception as e:
        print(f"Error uploading file to Dropbox: {str(e)}")
        raise  # Retry in case of other transient issues

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python 'Securing Cloud Storage Using Homomorphic Encryption.py' <input_file.txt>")
        print("\nExample: python 'Securing Cloud Storage Using Homomorphic Encryption.py' sample.txt")
        print("\nNote: Set DROPBOX_ACCESS_TOKEN environment variable for Dropbox upload.")
        sys.exit(1)
    
    input_file = sys.argv[1]
    
    ascii_file = convert_to_ascii(input_file)
    if not ascii_file:
        sys.exit(1)

    encrypted_file = encrypt_file(ascii_file)
    if not encrypted_file:
        sys.exit(1)

    compressed_file = compress_and_reduce_file(encrypted_file)
    if not compressed_file:
        sys.exit(1)

    access_token = os.environ.get('DROPBOX_ACCESS_TOKEN')
    if access_token:
        upload_to_dropbox(access_token, compressed_file)
    else:
        print("\nDropbox upload skipped: DROPBOX_ACCESS_TOKEN environment variable not set.")
        print(f"Encrypted and compressed file saved locally as: {compressed_file}")
