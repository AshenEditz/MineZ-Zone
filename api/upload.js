// api/upload.js - No external dependencies needed!

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST
    if (req.method !== 'POST') {
        res.status(405).json({ 
            success: false, 
            error: 'Method not allowed. Use POST.' 
        });
        return;
    }

    try {
        const { content, path, message, username } = req.body;

        // Validate input
        if (!content || !path || !message) {
            throw new Error('Missing required fields: content, path, or message');
        }

        // GitHub configuration
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        const GITHUB_USERNAME = 'asheneditz';
        const GITHUB_REPO = 'minez-zone-storage';

        if (!GITHUB_TOKEN) {
            throw new Error('GitHub token not configured. Please add GITHUB_TOKEN to environment variables.');
        }

        console.log('📤 Uploading to GitHub:', path);

        // Use native fetch (available in Node.js 18+)
        const response = await fetch(
            `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${path}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'MineZ-Zone-App'
                },
                body: JSON.stringify({
                    message: message,
                    content: content,
                    committer: {
                        name: username || 'MineZ Zone User',
                        email: 'upload@minezzone.app'
                    }
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error('GitHub API Error:', data);
            throw new Error(data.message || 'GitHub upload failed');
        }

        // Generate raw URL
        const rawUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/main/${path}`;

        console.log('✅ Upload successful:', rawUrl);

        // Return success
        res.status(200).json({
            success: true,
            url: rawUrl,
            downloadUrl: data.content.download_url,
            path: path
        });

    } catch (error) {
        console.error('❌ Upload error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
