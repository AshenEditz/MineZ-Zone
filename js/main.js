// Cloud Content Management System
class CloudMinezZone {
    constructor() {
        this.contentRef = database.ref('content');
        this.currentFilter = 'all';
        this.currentSort = 'latest';
        this.content = [];
        this.init();
    }

    async init() {
        await this.loadContentFromCloud();
        this.setupRealtimeListener();
        this.updateStats();
        this.updateCategoryCounts();
    }

    setupRealtimeListener() {
        this.contentRef.on('child_added', (snapshot) => {
            const newContent = { id: snapshot.key, ...snapshot.val() };
            if (!this.content.find(c => c.id === newContent.id)) {
                this.content.push(newContent);
                this.updateStats();
                this.updateCategoryCounts();
                this.loadContent();
            }
        });

        this.contentRef.on('child_changed', (snapshot) => {
            const updatedContent = { id: snapshot.key, ...snapshot.val() };
            const index = this.content.findIndex(c => c.id === updatedContent.id);
            if (index !== -1) {
                this.content[index] = updatedContent;
                this.loadContent();
            }
        });
    }

    async loadContentFromCloud() {
        try {
            const snapshot = await this.contentRef.once('value');
            const contentData = snapshot.val();
            
            if (contentData) {
                this.content = Object.keys(contentData).map(key => ({
                    id: key,
                    ...contentData[key]
                }));
            } else {
                await this.addSampleContent();
            }
            
            this.loadContent();
        } catch (error) {
            console.error('Error loading content:', error);
        }
    }

    async addSampleContent() {
        const samples = [
            {
                title: 'Epic PvP Resource Pack',
                category: 'packs',
                description: 'Enhance your PvP experience with custom textures and sounds!',
                author: 'asheneditz',
                thumbnail: 'https://picsum.photos/400/300?random=1',
                downloads: 1250,
                uploadDate: new Date().toISOString(),
                tags: ['pvp', 'resource', 'textures'],
                fileUrl: '#demo'
            },
            {
                title: 'Survival Plus Addon',
                category: 'addons',
                description: 'Add new survival features with custom mobs and items!',
                author: 'asheneditz',
                thumbnail: 'https://picsum.photos/400/300?random=2',
                downloads: 2100,
                uploadDate: new Date().toISOString(),
                tags: ['survival', 'addon', 'features'],
                fileUrl: '#demo'
            },
            {
                title: 'Cool Minecraft Skin',
                category: 'skins',
                description: 'Stand out with this awesome HD custom skin!',
                author: 'asheneditz',
                thumbnail: 'https://picsum.photos/400/300?random=3',
                downloads: 850,
                uploadDate: new Date().toISOString(),
                tags: ['skin', 'custom', 'hd'],
                fileUrl: '#demo'
            }
        ];

        for (const item of samples) {
            await this.contentRef.push(item);
        }
    }

    updateStats() {
        const totalUploads = document.getElementById('totalUploads');
        const totalUsers = document.getElementById('totalUsers');
        const totalDownloads = document.getElementById('totalDownloads');

        if (totalUploads) {
            this.animateNumber(totalUploads, this.content.length);
        }
        
        if (totalUsers) {
            database.ref('users').once('value').then(snapshot => {
                this.animateNumber(totalUsers, snapshot.numChildren());
            });
        }
        
        if (totalDownloads) {
            const downloads = this.content.reduce((sum, item) => sum + (item.downloads || 0), 0);
            this.animateNumber(totalDownloads, downloads);
        }
    }

    animateNumber(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 20);
    }

    updateCategoryCounts() {
        const categories = ['addons', 'packs', 'skins', 'worlds', 'servers'];
        categories.forEach(cat => {
            const count = this.content.filter(item => item.category === cat).length;
            const element = document.getElementById(`${cat}Count`);
            if (element) {
                element.textContent = `${count} items`;
            }
        });
    }

    loadContent() {
        const contentGrid = document.getElementById('contentGrid');
        if (!contentGrid) return;

        contentGrid.innerHTML = '';

        let filteredContent = this.currentFilter === 'all' 
            ? this.content 
            : this.content.filter(item => item.category === this.currentFilter);

        filteredContent.sort((a, b) => {
            switch(this.currentSort) {
                case 'latest':
                    return new Date(b.uploadDate) - new Date(a.uploadDate);
                case 'popular':
                case 'downloads':
                    return (b.downloads || 0) - (a.downloads || 0);
                default:
                    return 0;
            }
        });

        filteredContent.forEach(item => {
            const card = this.createContentCard(item);
            contentGrid.appendChild(card);
        });

        if (filteredContent.length === 0) {
            contentGrid.innerHTML = '<p style="text-align:center; color:var(--text-gray); grid-column: 1/-1;">No content found.</p>';
        }
    }

    createContentCard(item) {
        const card = document.createElement('div');
        card.className = 'content-card fade-in';
        
        const date = new Date(item.uploadDate).toLocaleDateString();
        
        card.innerHTML = `
            <img src="${item.thumbnail}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/400x300/00ffff/000000?text=${encodeURIComponent(item.title)}'">
            <div class="content-card-body">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="content-meta">
                    <span><i class="fas fa-user"></i> ${item.author}</span>
                    <span><i class="fas fa-download"></i> ${item.downloads || 0}</span>
                </div>
                <div class="content-tags">
                    ${item.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
                <div class="content-actions">
                    <button class="btn-download" onclick="downloadContent('${item.id}')">
                        <i class="fas fa-download"></i> Download
                    </button>
                    <button class="btn-details" onclick="viewDetails('${item.id}')">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    async addContent(contentData, imageFile, contentFile) {
        try {
            let thumbnailUrl = contentData.thumbnail;
            let fileUrl = '#';

            if (imageFile) {
                const imageRef = storage.ref(`thumbnails/${Date.now()}_${imageFile.name}`);
                await imageRef.put(imageFile);
                thumbnailUrl = await imageRef.getDownloadURL();
            }

            if (contentFile) {
                const fileRef = storage.ref(`files/${Date.now()}_${contentFile.name}`);
                await fileRef.put(contentFile);
                fileUrl = await fileRef.getDownloadURL();
            }

            const newContent = {
                ...contentData,
                thumbnail: thumbnailUrl,
                fileUrl: fileUrl,
                author: auth.currentUser.username,
                uploadDate: new Date().toISOString(),
                downloads: 0
            };

            await this.contentRef.push(newContent);
            
            return { success: true, message: 'Content uploaded successfully!' };
        } catch (error) {
            console.error('Upload error:', error);
            return { success: false, message: 'Upload failed: ' + error.message };
        }
    }

    getContentById(id) {
        return this.content.find(item => item.id === id);
    }

    async incrementDownloads(id) {
        try {
            const item = this.getContentById(id);
            if (item) {
                const newDownloadCount = (item.downloads || 0) + 1;
                await this.contentRef.child(id).update({
                    downloads: newDownloadCount
                });
            }
        } catch (error) {
            console.error('Error updating downloads:', error);
        }
    }
}

// Initialize app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new CloudMinezZone();
});

// Category filter
function filterCategory(category) {
    app.currentFilter = category;
    app.loadContent();
    const section = document.querySelector('.content-section');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
}

// Sort content
function sortContent() {
    const sortBy = document.getElementById('sortBy');
    if (sortBy) {
        app.currentSort = sortBy.value;
        app.loadContent();
    }
}

// Search content
function searchContent() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.toLowerCase();
    
    const contentGrid = document.getElementById('contentGrid');
    if (!contentGrid) return;

    contentGrid.innerHTML = '';

    const filteredContent = app.content.filter(item => {
        return item.title.toLowerCase().includes(query) ||
               item.description.toLowerCase().includes(query) ||
               item.tags.some(tag => tag.toLowerCase().includes(query));
    });

    filteredContent.forEach(item => {
        const card = app.createContentCard(item);
        contentGrid.appendChild(card);
    });

    if (filteredContent.length === 0) {
        contentGrid.innerHTML = '<p style="text-align:center; color:var(--text-gray); grid-column: 1/-1;">No results found.</p>';
    }
}

// Download content
async function downloadContent(id) {
    if (!auth.isLoggedIn()) {
        alert('Please login to download!');
        window.location.href = 'login.html';
        return;
    }

    const item = app.getContentById(id);
    if (item) {
        await app.incrementDownloads(id);
        
        if (item.fileUrl && item.fileUrl !== '#' && item.fileUrl !== '#demo') {
            window.open(item.fileUrl, '_blank');
            alert(`✅ Downloading: ${item.title}`);
        } else {
            alert(`📦 Demo: ${item.title}\nUpload real files to enable downloads!`);
        }
    }
}

// View details
function viewDetails(id) {
    window.location.href = `product.html?id=${id}`;
}

// Handle upload
async function handleUpload(event) {
    event.preventDefault();

    if (!auth.isLoggedIn()) {
        alert('Please login to upload!');
        window.location.href = 'login.html';
        return;
    }

    const submitBtn = event.target.querySelector('button[type="submit"]');
    const progressDiv = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    submitBtn.style.display = 'none';
    progressDiv.style.display = 'block';

    const title = document.getElementById('uploadTitle').value;
    const category = document.getElementById('uploadCategory').value;
    const description = document.getElementById('uploadDescription').value;
    const tags = document.getElementById('uploadTags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    const imageFile = document.getElementById('uploadImage').files[0];
    const contentFile = document.getElementById('uploadFile').files[0];

    // Simulate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 10;
        progressFill.style.width = progress + '%';
        progressText.textContent = `Uploading... ${progress}%`;
        if (progress >= 90) clearInterval(progressInterval);
    }, 200);

    const contentData = {
        title,
        category,
        description,
        tags,
        thumbnail: 'https://via.placeholder.com/400x300/00ffff/000000?text=' + encodeURIComponent(title)
    };

    const result = await app.addContent(contentData, imageFile, contentFile);
    
    clearInterval(progressInterval);
    progressFill.style.width = '100%';
    progressText.textContent = 'Upload complete! 100%';

    setTimeout(() => {
        if (result.success) {
            alert('✅ ' + result.message);
            window.location.href = 'index.html';
        } else {
            alert('❌ ' + result.message);
            submitBtn.style.display = 'block';
            progressDiv.style.display = 'none';
        }
    }, 500);
}

// Handle image upload preview
function handleImageUpload(event) {
    const preview = document.getElementById('imagePreview');
    const file = event.target.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; border-radius: 10px; margin-top: 1rem;">`;
        };
        reader.readAsDataURL(file);
    }
}

// Handle file upload info
function handleFileUpload(event) {
    const fileInfo = document.getElementById('fileInfo');
    const file = event.target.files[0];
    
    if (file) {
        const size = (file.size / 1024 / 1024).toFixed(2);
        fileInfo.innerHTML = `
            <div style="margin-top: 1rem; padding: 1rem; background: rgba(0,255,255,0.1); border-radius: 10px;">
                <p><strong>📁 File:</strong> ${file.name}</p>
                <p><strong>💾 Size:</strong> ${size} MB</p>
                <p><strong>📋 Type:</strong> ${file.type || 'Unknown'}</p>
            </div>
        `;
    }
}

// Load product details
function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    const item = app.getContentById(id);
    const detailsContainer = document.getElementById('productDetails');
    
    if (!item || !detailsContainer) {
        if (detailsContainer) {
            detailsContainer.innerHTML = '<p style="text-align:center;">Product not found!</p>';
        }
        return;
    }

    const date = new Date(item.uploadDate).toLocaleDateString();

    detailsContainer.innerHTML = `
        <div class="product-header">
            <div class="product-image">
                <img src="${item.thumbnail}" alt="${item.title}">
            </div>
            <div class="product-info">
                <h1>${item.title}</h1>
                <div class="product-meta">
                    <span><i class="fas fa-user"></i> ${item.author}</span>
                    <span><i class="fas fa-calendar"></i> ${date}</span>
                    <span><i class="fas fa-download"></i> ${item.downloads || 0} downloads</span>
                </div>
                <div class="content-tags" style="margin: 1.5rem 0;">
                    ${item.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
                <div class="product-actions">
                    <button class="btn-primary" onclick="downloadContent('${item.id}')">
                        <i class="fas fa-download"></i> Download Now
                    </button>
                    <button class="btn-secondary" onclick="window.history.back()">
                        <i class="fas fa-arrow-left"></i> Go Back
                    </button>
                </div>
            </div>
        </div>
        <div class="product-description">
            <h2 style="color: var(--primary-aqua); margin-bottom: 1rem;">Description</h2>
            <p>${item.description}</p>
        </div>
    `;
}