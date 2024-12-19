# fileshare

Flask File Upload App

This project is a simple Flask application that allows users to upload files through an HTTP POST request.
The uploaded files are stored on the server in a specified folder.

Features:
- Upload files through a POST request
- File is saved on the server's specified upload folder
- Returns appropriate responses for successful and failed uploads

Requirements:
- Python 3.x
- Flask

Installation:
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/your-repository-name.git
Navigate into the project directory:

cd your-repository-name
Install the required dependencies:


pip install -r requirements.txt
(If you don't have requirements.txt, you can install Flask manually by running pip install flask.)

Configuration:

UPLOAD_FOLDER: Set the folder path where the uploaded files will be stored.

Example:

UPLOAD_FOLDER = '/path/to/upload/folder'
MAX_CONTENT_LENGTH: Optionally, set a maximum file size for uploads (default is 16 MB).

Example:


app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max size
Running the App:

Ensure Flask is installed by running:


pip install flask
Run the Flask app:

python app.py
By default, the app will run on http://127.0.0.1:5000. To make the app accessible on your local network (e.g., for testing on your phone), run the app with:


app.run(host='0.0.0.0', port=5000)
Open a browser and navigate to http://127.0.0.1:5000 to test locally, or use your local IP address (e.g., http://192.168.1.5:5000) to access from other devices on the same network.

API Endpoints:

/upload (POST)
Description: Upload a file to the server.
Request: Send a POST request with the file attached.
Key: file
File: The file to upload.
Response:
200 OK: File uploaded successfully.
400 Bad Request: Errors such as no file part or no file selected.
Example Usage:

Upload a file using cURL:

curl -X POST -F "file=@/path/to/your/file" http://127.0.0.1:5000/upload
Upload a file using HTML form:

<!DOCTYPE html>
<html>
  <body>
    <form action="http://127.0.0.1:5000/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="file">
      <input type="submit">
    </form>
  </body>
</html>
License: This project is licensed under the MIT License - see the LICENSE file for details.
