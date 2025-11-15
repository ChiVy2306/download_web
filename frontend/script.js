const API_URL = 'https://web-downloader-backend-site.onrender.com';

// Elements
const videoUrlInput = document.getElementById('videoUrl');
const downloadBtn = document.getElementById('downloadBtn');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');
const successDiv = document.getElementById('success');
const successMessage = document.getElementById('successMessage');
const downloadLink = document.getElementById('downloadLink');
const formatBtns = document.querySelectorAll('.format-btn');
const videoQualityDiv = document.getElementById('videoQuality');
const audioQualityDiv = document.getElementById('audioQuality');
const themeToggle = document.getElementById('themeToggle');

let selectedQuality = 'medium';
let selectedFormat = 'mp4';

// Theme toggle
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Format selection - show/hide quality options based on format
formatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        formatBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedFormat = btn.dataset.format;
        const formatType = btn.dataset.type;

        // Toggle quality selector based on format type
        if (formatType === 'audio') {
            videoQualityDiv.style.display = 'none';
            audioQualityDiv.style.display = 'block';
            // Set default audio quality
            selectedQuality = '320';
        } else {
            videoQualityDiv.style.display = 'block';
            audioQualityDiv.style.display = 'none';
            // Set default video quality
            selectedQuality = 'medium';
        }
    });
});

// Quality selection - handle both video and audio quality buttons
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('quality-btn')) {
        const parent = e.target.closest('.quality-selector');
        const buttons = parent.querySelectorAll('.quality-btn');
        buttons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        selectedQuality = e.target.dataset.quality;
    }
});

// Show/hide UI elements
function showLoading() {
    loadingDiv.style.display = 'block';
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    downloadBtn.disabled = true;
}

function hideLoading() {
    loadingDiv.style.display = 'none';
    downloadBtn.disabled = false;
}

function showError(message) {
    errorMessage.textContent = message;
    errorDiv.style.display = 'flex';
    hideLoading();
}

function showSuccess(message, url, filename) {
    successMessage.textContent = message;
    downloadLink.href = url;
    downloadLink.download = filename;
    successDiv.style.display = 'block';
    hideLoading();
}

// Validate URL
function isValidUrl(string) {
    try {
        const url = new URL(string);
        const supportedDomains = [
            'youtube.com', 'youtu.be',
            'facebook.com', 'fb.watch', 'fb.com',
            'instagram.com',
            'tiktok.com',
            'reddit.com', 'redd.it',
            'twitter.com', 'x.com',
            'pornhub.com',
            'steampowered.com', 'steamcommunity.com'
        ];
        return supportedDomains.some(domain => url.hostname.includes(domain));
    } catch (_) {
        return false;
    }
}

// Download video
async function downloadVideo() {
    const url = videoUrlInput.value.trim();

    if (!url) {
        showError('Vui lòng nhập link video');
        return;
    }

    if (!isValidUrl(url)) {
        showError('Link không hợp lệ hoặc nền tảng không được hỗ trợ');
        return;
    }

    showLoading();

    try {
        const response = await fetch(`${API_URL}/api/download`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: url,
                quality: selectedQuality,
                format: selectedFormat
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Không thể tải video');
        }

        showSuccess(
            data.message || 'Video đã được tải xuống thành công!',
            data.downloadUrl,
            data.filename
        );

        // Auto download after 1 second
        setTimeout(() => {
            downloadLink.click();
        }, 1000);

    } catch (error) {
        console.error('Download error:', error);
        showError(error.message || 'Đã xảy ra lỗi khi tải video. Vui lòng thử lại.');
    }
}

// Event listeners
downloadBtn.addEventListener('click', downloadVideo);

videoUrlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        downloadVideo();
    }
});

// Clear error when user types
videoUrlInput.addEventListener('input', () => {
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
});

// Auto-focus input on page load
window.addEventListener('load', () => {
    videoUrlInput.focus();
});

// Handle paste event
videoUrlInput.addEventListener('paste', (e) => {
    setTimeout(() => {
        const url = videoUrlInput.value.trim();
        if (url && isValidUrl(url)) {
            errorDiv.style.display = 'none';
        }
    }, 100);
});
