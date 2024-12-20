const fileContainer = document.getElementById('file-container');

// Mapping file extensions to preview icons
const fileIcons = {
    pdf: '/static/icons/pdf-icon.png',
    doc: '/static/icons/doc-icon.png',
    docx: '/static/icons/doc-icon.png',
    txt: '/static/icons/txt-icon.png',
    jpg: '/static/icons/image-icon.png',
    png: '/static/icons/image-icon.png',
    mp4: '/static/icons/video-icon.png',
    m4a: '/static/icons/audio-icon.png',
    mp3: '/static/icons/audio-icon.png',
    wav: '/static/icons/audio-icon.png',
    ogg: '/static/icons/audio-icon.png',
    folder: '/static/icons/folder-icon.png',
    default: '/static/icons/file-icon.png',
};

// Truncate file names to a fixed length
function truncateName(name, length = 15) {
    return name.length > length ? name.substring(0, length) + '...' : name;
}

// Preview Modal
const previewModal = document.getElementById('preview-modal');
const previewContent = document.getElementById('preview-content');

// Function to display the preview of a file
function previewFile(file) {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (fileExtension === 'jpg' || fileExtension === 'png') {
        previewContent.innerHTML = `<img src="/files/${file.name}" alt="Image Preview" class="preview-image" />`;
    } else if (['mp4', 'avi', 'mov'].includes(fileExtension)) {
        previewContent.innerHTML = `<video controls class="preview-video">
                                        <source src="/files/${file.name}" type="video/${fileExtension}">
                                      </video>`;
    } else if (['mp3', 'wav', 'ogg', 'm4a'].includes(fileExtension)) {
        previewContent.innerHTML = `<audio controls class="preview-audio">
                                        <source src="/files/${file.name}" type="audio/${fileExtension}">
                                      </audio>`;
    } else if (fileExtension === 'txt' || fileExtension === 'pdf') {
        previewContent.innerHTML = `<iframe src="/files/${file.name}" class="preview-file" frameborder="0"></iframe>`;
    } else if (fileExtension === 'folder') {
        previewContent.innerHTML = `<p>Folder: ${file.name} (Previewing folder content)</p>`;
        // Add functionality here to fetch and display folder contents
    } else {
        previewContent.innerHTML = `<p>Preview not available for this file type.</p>`;
    }

    previewModal.style.display = 'block'; // Show the modal
}

// Close the preview modal
function closePreview() {
    previewModal.style.display = 'none';
}

// Event listener for modal close button
document.getElementById('close-preview').addEventListener('click', closePreview);

// Function to display files in the container
const displayFiles = (files) => {
    fileContainer.innerHTML = ''; // Clear existing content
    files.forEach((file) => {
        const isFolder = file.isFolder; // Assuming the server returns `isFolder` flag
        const fileExtension = isFolder ? 'folder' : file.name.split('.').pop().toLowerCase();
        const fileIcon = fileIcons[fileExtension] || fileIcons.default;
        
        const fileCard = document.createElement('div');
        fileCard.className = 'file-card';
        fileCard.innerHTML = `
            <img src="${fileIcon}" alt="File Icon" class="file-icon" />
            <p>${truncateName(file.name)}</p>
            <a href="/download/${file.name}" target="_blank" class="download-btn">Download</a>
        `;
        
        fileCard.addEventListener('click', () => previewFile(file)); // Add click listener for preview
        fileContainer.appendChild(fileCard);
    });
};

// Fetch files and display them with icons
async function fetchFiles() {
    try {
        const response = await fetch('/files');
        if (!response.ok) throw new Error('Failed to fetch files.');
        const files = await response.json();

        displayFiles(files);
    } catch (error) {
        console.error(error);
        fileContainer.innerHTML = '<p>Failed to load files. Please try again later.</p>';
    }
}

// Upload file function
function uploadFile(event) {
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(`File uploaded successfully: ${file.name}`);
                fetchFiles();  // Refresh files immediately after upload
            } else {
                alert('Upload failed');
            }
        })
        .catch(error => {
            console.error('Error uploading file:', error);
            alert('An error occurred while uploading the file.');
        });
    } else {
        alert('No file selected.');
    }
}

// Load files on page load
fetchFiles();

// Automatically refresh file list every 15 seconds
setInterval(fetchFiles, 15000);
