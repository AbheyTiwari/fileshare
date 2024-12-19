const fileContainer = document.getElementById('file-container');

// Mapping file extensions to preview icons
const fileIcons = {
    pdf: '/static/icons/pdf-icon.png',
    doc: '/static/icons/doc-icon.png',
    docx: '/static/icons/doc-icon.png',
    txt: '/static/icons/txt-icon.png',
    jpg: '/static/icons/image-icon.png',
    png: '/static/icons/image-icon.png',
    mp4: '/static/icons/video-icon.png', // Add this line for mp4 icon
    m4a: 'static/icons/audio-icon.png',  
    mp3: '/static/icons/audio-icon.png',
    wav: '/static/icons/audio-icon.png',
    ogg: '/static/icons/audio-icon.png',
    default: '/static/icons/file-icon.png', // Fallback for unknown types
};

// Truncate file names to a fixed length
function truncateName(name, length = 5) {
    return name.length > length ? name.substring(0, length) + '...' : name;
}

// Fetch files and display them with icons
async function fetchFiles() {
    try {
        const response = await fetch('/files');
        if (!response.ok) throw new Error('Failed to fetch files.');
        const files = await response.json();

        fileContainer.innerHTML = '';
        files.forEach(file => {
            const fileExtension = file.split('.').pop().toLowerCase();
            const fileIcon = fileIcons[fileExtension] || fileIcons.default;

            const fileCard = document.createElement('div');
            fileCard.className = 'file-card';

            if (fileExtension === 'mp4') {
                fileCard.innerHTML = `
                    <img src="${fileIcons.mp4}" alt="Video Icon" class="file-icon" />
                    <p>${truncateName(file)}</p>
                    <a href="/download/${file}" target="_blank">Download</a>
                `;
            } else if (['mp3', 'wav', 'ogg', 'm4a'].includes(fileExtension)) {
                fileCard.innerHTML = `
                    <img src="${fileIcons.mp3}" alt="Audio Icon" class="file-icon" />
                    <p>${truncateName(file)}</p>
                    <a href="/download/${file}" target="_blank">Download</a>
                `;
            } else {
                fileCard.innerHTML = `
                    <img src="${fileIcon}" alt="File Icon" class="file-icon" />
                    <p>${truncateName(file)}</p>
                    <a href="/download/${file}" target="_blank">Download</a>
                `;
            }
            fileContainer.appendChild(fileCard);
        });
    } catch (error) {
        console.error(error);
        fileContainer.innerHTML = '<p>Failed to load files. Please try again later.</p>';
    }
}

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
