from flask import Flask, request, jsonify, send_from_directory, render_template
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {
    'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'docx', 'xlsx', 'pptx', 
    'mp4', 'mp3', 'wav', 'ogg', 'm4a', 'zip', 'tar', 'folder'
}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the uploads folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    """Check if a file's extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/')
def index():
    """Serve the frontend (optional if you're using templates)."""
    return render_template('index.html')  # Replace with your static HTML


@app.route('/files', methods=['GET'])
def list_files():
    """List all files in the upload folder."""
    files = []
    for root, dirs, filenames in os.walk(UPLOAD_FOLDER):
        for filename in filenames:
            files.append({'name': filename, 'isFolder': False})
        for dir_name in dirs:
            files.append({'name': dir_name, 'isFolder': True})
    return jsonify(files)


@app.route('/upload', methods=['POST'])
def upload_file():
    """Handle file uploads."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']

    # If no file is selected
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # If the file has an allowed extension, save it
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)  # Secure the filename to prevent path traversal
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        # Save the file to the designated folder
        file.save(file_path)

        # Return a success response with the filename
        return jsonify({'message': f'File uploaded successfully: {filename}', 'filename': filename}), 201

    return jsonify({'error': 'File type not allowed'}), 400


@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    """Serve a file for download."""
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404


@app.route('/preview/<filename>', methods=['GET'])
def preview_file(filename):
    """Preview a file (for images, audio, video, PDF, etc.)."""
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    if not os.path.exists(file_path):
        return jsonify({'error': 'File not found'}), 404

    file_extension = filename.split('.')[-1].lower()
    preview_data = {}

    # Handle different file types for preview
    if file_extension in {'jpg', 'jpeg', 'png', 'gif'}:
        preview_data = {'type': 'image', 'src': f'/files/{filename}'}
    elif file_extension in {'mp4', 'avi', 'mov'}:
        preview_data = {'type': 'video', 'src': f'/files/{filename}'}
    elif file_extension in {'mp3', 'wav', 'ogg', 'm4a'}:
        preview_data = {'type': 'audio', 'src': f'/files/{filename}'}
    elif file_extension in {'txt', 'pdf'}:
        preview_data = {'type': 'file', 'src': f'/files/{filename}'}

    if preview_data:
        return jsonify(preview_data)

    return jsonify({'error': 'Preview not available for this file type.'}), 400


@app.errorhandler(404)
def page_not_found(e):
    """Handle 404 errors."""
    return jsonify({'error': 'Endpoint not found'}), 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
