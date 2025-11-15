const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const util = require('util');

const execPromise = util.promisify(exec);
const app = express();
const PORT = process.env.PORT || 3000;

// Setup FFmpeg path if it's in the project directory
const ffmpegPath = path.join(__dirname, '..', 'ffmpeg-7.1.1-essentials_build', 'ffmpeg-7.1.1-essentials_build', 'bin');
if (fs.existsSync(ffmpegPath)) {
    process.env.PATH = `${ffmpegPath};${process.env.PATH}`;
    console.log(`✅ FFmpeg found in project: ${ffmpegPath}`);
} else {
    console.log(`⚠️ FFmpeg not found at: ${ffmpegPath}`);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

// Create downloads/videos directory if it doesn't exist
const downloadsDir = path.join(__dirname, 'downloads');
const videosDir = path.join(downloadsDir, 'videos');
if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
}

// Auto-clean videos folder - check every 5 minutes, delete files older than 15 minutes
setInterval(() => {
    try {
        const files = fs.readdirSync(videosDir);
        const now = Date.now();
        const fifteenMinutes = 15 * 60 * 1000; // 15 minutes
        let deletedCount = 0;

        files.forEach(file => {
            const filePath = path.join(videosDir, file);
            const stats = fs.statSync(filePath);
            const fileAge = now - stats.birthtimeMs; // Time since file was created

            if (fileAge >= fifteenMinutes) {
                fs.unlinkSync(filePath);
                console.log(`🗑️ Auto-deleted (${Math.round(fileAge / 1000 / 60)}min old): ${file}`);
                deletedCount++;
            }
        });

        if (deletedCount > 0) {
            console.log(`✨ Cleaned ${deletedCount} file(s) older than 15 minutes`);
        }
    } catch (error) {
        console.error('Error cleaning videos folder:', error);
    }
}, 5 * 60 * 1000); // Check every 5 minutes

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Video Downloader API is running',
        supportedPlatforms: ['YouTube', 'Facebook', 'Instagram', 'TikTok']
    });
});

// Get video info endpoint
app.post('/api/video-info', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Get video information using yt-dlp
        const { stdout } = await execPromise(
            `yt-dlp --dump-json --no-playlist "${url}"`
        );

        const videoInfo = JSON.parse(stdout);

        res.json({
            title: videoInfo.title,
            thumbnail: videoInfo.thumbnail,
            duration: videoInfo.duration,
            uploader: videoInfo.uploader,
            formats: videoInfo.formats?.filter(f => f.vcodec !== 'none' && f.acodec !== 'none')
                .map(f => ({
                    format_id: f.format_id,
                    ext: f.ext,
                    quality: f.format_note || f.quality,
                    filesize: f.filesize
                })).slice(0, 10) || []
        });
    } catch (error) {
        console.error('Error fetching video info:', error);
        res.status(500).json({
            error: 'Failed to fetch video information',
            message: error.message
        });
    }
});

// Download video endpoint
app.post('/api/download', async (req, res) => {
    const { url, quality = 'medium', format = 'mp4' } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const timestamp = Date.now();
        const safeFilename = `video_${timestamp}`;

        // Quality options
        let formatOption = '';
        let mergeFormat = format.toLowerCase();
        const audioFormats = ['mp3', 'm4a', 'wav'];

        if (audioFormats.includes(format.toLowerCase())) {
            // For audio formats, extract audio only with quality
            const audioBitrate = quality; // quality will be '128', '192', or '320'
            const audioFormat = format.toLowerCase();

            if (audioFormat === 'wav') {
                // WAV is lossless, no bitrate needed
                formatOption = `-f bestaudio/best -x --audio-format wav`;
            } else {
                formatOption = `-f bestaudio/best -x --audio-format ${audioFormat} --audio-quality ${audioBitrate}k`;
            }
            mergeFormat = audioFormat;
        } else {
            // For video formats - don't force specific ext during download, only in merge
            if (quality === 'high') {
                formatOption = `-f "bestvideo+bestaudio/best"`;
            } else if (quality === 'medium') {
                formatOption = `-f "bestvideo[height<=720]+bestaudio/best[height<=720]"`;
            } else if (quality === 'low') {
                formatOption = `-f "bestvideo[height<=480]+bestaudio/best[height<=480]"`;
            }
        }

        const outputTemplate = path.join(videosDir, `${safeFilename}.%(ext)s`);

        // Build command - only add merge format for video formats
        let command = `yt-dlp ${formatOption} --restrict-filenames`;
        if (!audioFormats.includes(format.toLowerCase())) {
            command += ` --merge-output-format ${mergeFormat}`;
        }
        command += ` -o "${outputTemplate}" --no-playlist "${url}"`;

        console.log('Executing:', command);
        console.log('Output will be saved to:', outputTemplate);

        const { stdout, stderr } = await execPromise(command, {
            maxBuffer: 1024 * 1024 * 10 // 10MB buffer
        });

        console.log('yt-dlp output:', stdout);
        if (stderr) console.log('yt-dlp stderr:', stderr);

        // Find the downloaded file
        const files = fs.readdirSync(videosDir)
            .filter(file => file.startsWith(`video_${timestamp}`))
            .sort((a, b) => {
                return fs.statSync(path.join(videosDir, b)).mtime.getTime() -
                    fs.statSync(path.join(videosDir, a)).mtime.getTime();
            });

        if (files.length === 0) {
            console.error('No files found matching pattern:', `video_${timestamp}`);
            console.error('Files in directory:', fs.readdirSync(videosDir));
            throw new Error('Downloaded file not found. Please check if yt-dlp is installed correctly.');
        }

        const downloadedFile = files[0];
        const fileUrl = `/downloads/videos/${downloadedFile}`;
        
        // Use Render URL in production or localhost in dev
        const baseUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;

        res.json({
            success: true,
            message: 'Video downloaded successfully',
            downloadUrl: `${baseUrl}${fileUrl}`,
            filename: downloadedFile
        });

    } catch (error) {
        console.error('Error downloading video:', error);
        res.status(500).json({
            error: 'Failed to download video',
            message: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📁 Videos directory: ${videosDir}`);
    console.log(`🗑️ Auto-clean every 15 minutes`);
});
