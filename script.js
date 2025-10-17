// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBZacr9I_ecEUKU1ZV3EsjcfGIHkfnVQdQ",
    authDomain: "minez-zone.firebaseapp.com",
    databaseURL: "https://minez-zone-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "minez-zone",
    storageBucket: "minez-zone.firebasestorage.app",
    messagingSenderId: "840393320273",
    appId: "1:840393320273:web:b1d128705055a65b781570"
};

// SECURE - NO GITHUB TOKEN IN CLIENT CODE!
let currentUser = null;
let allContent = {
    addons: [],
    templates: [],
    shaders: [],
    skins: [],
    servers: []
};

// API URL - automatically detects environment
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'  // Local development
    : '/api';  // Production (Vercel)

// Initialize Firebase
let app, auth, database;

try {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    database = firebase.database();
    console.log('✅ Firebase initialized successfully');
} catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    showNotification('Firebase initialization failed. Please refresh the page.', 'error');
}

// Secure Upload Function - Calls Vercel Backend
async function uploadToBackend(file, type, category) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                // Convert file to Base64
                const content = btoa(
                    new Uint8Array(e.target.result)
                        .reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
                
                const timestamp = Date.now();
                const filename = `${timestamp}_${file.name}`;
                const path = `${category}/${type}/${currentUser.username}/${filename}`;
                
                console.log('📤 Uploading to Vercel backend:', path);
                
                // Call Vercel serverless function
                const response = await fetch(`${API_URL}/upload`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: content,
                        path: path,
                        message: `Upload ${filename} by ${currentUser.username}`,
                        username: currentUser.username
                    })
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Upload failed');
                }
                
                const data = await response.json();
                
                if (!data.success) {
                    throw new Error(data.error || 'Upload failed');
                }
                
                console.log('✅ Upload successful:', data.url);
                
                resolve({
                    url: data.url,
                    downloadUrl: data.downloadUrl,
                    path: data.path
                });
                
            } catch (error) {
                console.error('❌ Upload error:', error);
                reject(error);
            }
        };
        
        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };
        
        reader.readAsArrayBuffer(file);
    });
}

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 MineZ Zone initializing...');
    console.log('📡 API URL:', API_URL);
    
    initializeAuth();
    initializeNavigation();
    initializeModals();
    initializeUploadButtons();
    initializeChatWidget();
    
    setTimeout(() => {
        loadAllContent();
        updateStats();
    }, 1000);
    
    setInterval(updateStats, 30000);
    
    console.log('✅ App initialized - Vercel Backend Mode');
});

// Authentication
function initializeAuth() {
    auth.onAuthStateChanged(user => {
        if (user) {
            console.log('👤 User logged in:', user.email);
            loadUserData(user.uid);
        } else {
            console.log('👤 No user logged in');
            currentUser = null;
            updateUIForGuest();
        }
    });
}

async function loadUserData(uid) {
    try {
        const snapshot = await database.ref('users/' + uid).once('value');
        const userData = snapshot.val();
        if (userData) {
            currentUser = { uid, ...userData };
            updateUIForUser();
            console.log('✅ User data loaded:', currentUser.username);
        }
    } catch (error) {
        console.error('❌ Error loading user data:', error);
    }
}

function updateUIForUser() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const userProfile = document.getElementById('userProfile');
    const headerUsername = document.getElementById('headerUsername');
    const profileImg = document.getElementById('profileImg');
    
    if (loginBtn) loginBtn.style.display = 'none';
    if (registerBtn) registerBtn.style.display = 'none';
    if (userProfile) userProfile.style.display = 'flex';
    if (headerUsername) headerUsername.textContent = currentUser.username;
    if (profileImg) profileImg.src = `https://ui-avatars.com/api/?name=${currentUser.username}&background=00ffff&color=000`;
    
    const uploadButtons = ['uploadAddonBtn', 'uploadTemplateBtn', 'uploadShaderBtn', 'uploadSkinBtn', 'uploadServerBtn'];
    uploadButtons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) btn.style.display = 'inline-flex';
    });
    
    const leaderboardLink = document.getElementById('leaderboardLink');
    if (leaderboardLink) leaderboardLink.style.display = 'block';
    
    if (currentUser.username === 'AshenGamerZ' || currentUser.role === 'admin') {
        addAdminLink();
    }
}

function updateUIForGuest() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const userProfile = document.getElementById('userProfile');
    
    if (loginBtn) loginBtn.style.display = 'inline-block';
    if (registerBtn) registerBtn.style.display = 'inline-block';
    if (userProfile) userProfile.style.display = 'none';
    
    const uploadButtons = ['uploadAddonBtn', 'uploadTemplateBtn', 'uploadShaderBtn', 'uploadSkinBtn', 'uploadServerBtn'];
    uploadButtons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) btn.style.display = 'none';
    });
    
    const leaderboardLink = document.getElementById('leaderboardLink');
    if (leaderboardLink) leaderboardLink.style.display = 'none';
}

function addAdminLink() {
    const navMenu = document.getElementById('navMenu');
    if (!document.getElementById('adminLink') && navMenu) {
        const adminLink = document.createElement('a');
        adminLink.href = '#admin';
        adminLink.className = 'nav-link';
        adminLink.textContent = 'Admin Panel';
        adminLink.id = 'adminLink';
        adminLink.addEventListener('click', function(e) {
            e.preventDefault();
            navigateTo('admin');
        });
        navMenu.appendChild(adminLink);
    }
}

// Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                const target = href.substring(1);
                navigateTo(target);
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                if (navMenu) navMenu.classList.remove('active');
            }
        });
    });
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    window.navigateTo = navigateTo;
}

function navigateTo(section) {
    console.log('📍 Navigating to:', section);
    
    const sections = document.querySelectorAll('.section');
    sections.forEach(s => s.style.display = 'none');
    
    const targetSection = document.getElementById(section);
    if (targetSection) {
        targetSection.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        loadSectionData(section);
    }
}

function loadSectionData(section) {
    switch(section) {
        case 'addons':
            loadContentGrid('addons', 'addonsGrid');
            break;
        case 'templates':
            loadContentGrid('templates', 'templatesGrid');
            break;
        case 'shaders':
            loadContentGrid('shaders', 'shadersGrid');
            break;
        case 'skins':
            loadContentGrid('skins', 'skinsGrid');
            break;
        case 'servers':
            loadServers();
            break;
        case 'leaderboard':
            loadLeaderboard();
            break;
        case 'profile':
            loadProfile();
            break;
        case 'admin':
            if (currentUser && (currentUser.username === 'AshenGamerZ' || currentUser.role === 'admin')) {
                loadAdminPanel();
            }
            break;
    }
}

// Modals
function initializeModals() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (loginModal) loginModal.style.display = 'block';
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            if (registerModal) registerModal.style.display = 'block';
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await auth.signOut();
                showNotification('Logged out successfully', 'success');
                navigateTo('home');
            } catch (error) {
                showNotification(error.message, 'error');
            }
        });
    }
    
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    });
    
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
}

// Login Handler
async function handleLogin(e) {
    e.preventDefault();
    showLoading();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        if (username === 'AshenGamerZ' && password === 'AshenGamerZ5543') {
            const email = 'ashengamerz@minezzone.com';
            try {
                await auth.signInWithEmailAndPassword(email, password);
            } catch (error) {
                if (error.code === 'auth/user-not-found') {
                    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                    await database.ref('users/' + userCredential.user.uid).set({
                        username: username,
                        email: email,
                        role: 'admin',
                        createdAt: Date.now(),
                        uploads: 0,
                        points: 0,
                        badges: ['admin', 'verified']
                    });
                } else {
                    throw error;
                }
            }
        } else {
            const usersRef = database.ref('users');
            const snapshot = await usersRef.orderByChild('username').equalTo(username).once('value');
            
            if (snapshot.exists()) {
                const userData = Object.values(snapshot.val())[0];
                const email = userData.email;
                await auth.signInWithEmailAndPassword(email, password);
            } else {
                throw new Error('User not found');
            }
        }
        
        const loginModal = document.getElementById('loginModal');
        if (loginModal) loginModal.style.display = 'none';
        
        const loginForm = document.getElementById('loginForm');
        if (loginForm) loginForm.reset();
        
        showNotification('Login successful!', 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    }
    
    hideLoading();
}

// Register Handler
async function handleRegister(e) {
    e.preventDefault();
    showLoading();
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    try {
        const usersRef = database.ref('users');
        const snapshot = await usersRef.orderByChild('username').equalTo(username).once('value');
        
        if (snapshot.exists()) {
            throw new Error('Username already taken');
        }
        
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        await database.ref('users/' + userCredential.user.uid).set({
            username: username,
            email: email,
            role: 'user',
            createdAt: Date.now(),
            uploads: 0,
            points: 0,
            badges: []
        });
        
        const registerModal = document.getElementById('registerModal');
        if (registerModal) registerModal.style.display = 'none';
        
        const registerForm = document.getElementById('registerForm');
        if (registerForm) registerForm.reset();
        
        showNotification('Registration successful!', 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    }
    
    hideLoading();
}

// Upload Buttons
function initializeUploadButtons() {
    const uploadAddonBtn = document.getElementById('uploadAddonBtn');
    const uploadTemplateBtn = document.getElementById('uploadTemplateBtn');
    const uploadShaderBtn = document.getElementById('uploadShaderBtn');
    const uploadSkinBtn = document.getElementById('uploadSkinBtn');
    const uploadServerBtn = document.getElementById('uploadServerBtn');
    
    if (uploadAddonBtn) uploadAddonBtn.addEventListener('click', () => openUploadModal('addons'));
    if (uploadTemplateBtn) uploadTemplateBtn.addEventListener('click', () => openUploadModal('templates'));
    if (uploadShaderBtn) uploadShaderBtn.addEventListener('click', () => openUploadModal('shaders'));
    if (uploadSkinBtn) uploadSkinBtn.addEventListener('click', () => openUploadModal('skins'));
    if (uploadServerBtn) uploadServerBtn.addEventListener('click', () => openServerModal());
    
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) uploadForm.addEventListener('submit', handleUpload);
    
    const serverForm = document.getElementById('serverForm');
    if (serverForm) serverForm.addEventListener('submit', handleServerUpload);
}

function openUploadModal(type) {
    if (!currentUser) {
        showNotification('Please login to upload content', 'error');
        return;
    }
    
    const titles = {
        addons: 'Upload MC Addon',
        templates: 'Upload MC Template',
        shaders: 'Upload MC Shader',
        skins: 'Upload 3D Skin'
    };
    
    const uploadModalTitle = document.getElementById('uploadModalTitle');
    const uploadType = document.getElementById('uploadType');
    const uploadFileGroup = document.getElementById('uploadFileGroup');
    const uploadModal = document.getElementById('uploadModal');
    
    if (uploadModalTitle) uploadModalTitle.textContent = titles[type];
    if (uploadType) uploadType.value = type;
    
    if (uploadFileGroup) {
        uploadFileGroup.style.display = type === 'skins' ? 'none' : 'block';
    }
    
    if (uploadModal) uploadModal.style.display = 'block';
}

function openServerModal() {
    if (!currentUser) {
        showNotification('Please login to add a server', 'error');
        return;
    }
    const serverModal = document.getElementById('serverModal');
    if (serverModal) serverModal.style.display = 'block';
}

// Upload Handler with Vercel Backend
async function handleUpload(e) {
    e.preventDefault();
    
    const name = document.getElementById('uploadName').value;
    const description = document.getElementById('uploadDescription').value;
    const imageFile = document.getElementById('uploadImage').files[0];
    const contentFile = document.getElementById('uploadFile').files[0];
    const type = document.getElementById('uploadType').value;
    
    if (!imageFile) {
        showNotification('Please select an image', 'error');
        return;
    }
    
    if (type !== 'skins' && !contentFile) {
        showNotification('Please select a file to upload', 'error');
        return;
    }
    
    showLoading();
    console.log('📤 Starting upload:', name);
    
    try {
        // Upload image
        showNotification('Uploading image to GitHub...', 'info');
        const imageResult = await uploadToBackend(imageFile, type, 'images');
        const imageUrl = imageResult.url;
        console.log('✅ Image uploaded:', imageUrl);
        
        let fileUrl = null;
        let fileName = null;
        
        // Upload content file (if not skin)
        if (type !== 'skins' && contentFile) {
            showNotification('Uploading file to GitHub...', 'info');
            const fileResult = await uploadToBackend(contentFile, type, 'files');
            fileUrl = fileResult.url;
            fileName = contentFile.name;
            console.log('✅ File uploaded:', fileUrl);
        }
        
        // Save to Firebase Database
        showNotification('Saving to database...', 'info');
        const contentRef = database.ref(type).push();
        await contentRef.set({
            id: contentRef.key,
            name: name,
            description: description,
            imageUrl: imageUrl,
            fileUrl: fileUrl,
            fileName: fileName,
            type: type,
            author: currentUser.username,
            authorId: currentUser.uid,
            downloads: 0,
            rating: 0,
            ratingCount: 0,
            createdAt: Date.now()
        });
        
        // Update user stats
        await database.ref('users/' + currentUser.uid + '/uploads').transaction(current => (current || 0) + 1);
        await database.ref('users/' + currentUser.uid + '/points').transaction(current => (current || 0) + 10);
        
        const uploadModal = document.getElementById('uploadModal');
        if (uploadModal) uploadModal.style.display = 'none';
        
        const uploadForm = document.getElementById('uploadForm');
        if (uploadForm) uploadForm.reset();
        
        showNotification('✅ Upload successful!', 'success');
        loadAllContent();
    } catch (error) {
        console.error('❌ Upload error:', error);
        showNotification('Upload failed: ' + error.message, 'error');
    }
    
    hideLoading();
}

// Server Upload Handler
async function handleServerUpload(e) {
    e.preventDefault();
    
    const name = document.getElementById('serverName').value;
    const description = document.getElementById('serverDescription').value;
    const ip = document.getElementById('serverIp').value;
    const port = document.getElementById('serverPort').value;
    const imageFile = document.getElementById('serverImage').files[0];
    
    if (!imageFile) {
        showNotification('Please select a server image', 'error');
        return;
    }
    
    showLoading();
    
    try {
        const imageResult = await uploadToBackend(imageFile, 'servers', 'images');
        const imageUrl = imageResult.url;
        
        const serverRef = database.ref('servers').push();
        await serverRef.set({
            id: serverRef.key,
            name: name,
            description: description,
            ip: ip,
            port: port,
            imageUrl: imageUrl,
            author: currentUser.username,
            authorId: currentUser.uid,
            createdAt: Date.now()
        });
        
        await database.ref('users/' + currentUser.uid + '/uploads').transaction(current => (current || 0) + 1);
        await database.ref('users/' + currentUser.uid + '/points').transaction(current => (current || 0) + 5);
        
        const serverModal = document.getElementById('serverModal');
        if (serverModal) serverModal.style.display = 'none';
        
        const serverForm = document.getElementById('serverForm');
        if (serverForm) serverForm.reset();
        
        showNotification('✅ Server added successfully!', 'success');
        loadServers();
    } catch (error) {
        showNotification('Failed to add server: ' + error.message, 'error');
    }
    
    hideLoading();
}

// Chat Widget
function initializeChatWidget() {
    const chatAdminBtn = document.getElementById('chatAdminBtn');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const sendChatBtn = document.getElementById('sendChatBtn');
    const chatMessageInput = document.getElementById('chatMessageInput');
    
    if (chatAdminBtn) chatAdminBtn.addEventListener('click', openChat);
    if (closeChatBtn) closeChatBtn.addEventListener('click', closeChat);
    if (sendChatBtn) sendChatBtn.addEventListener('click', sendMessage);
    
    if (chatMessageInput) {
        chatMessageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendMessage();
        });
    }
}

function openChat() {
    if (!currentUser) {
        showNotification('Please login to chat with admin', 'error');
        return;
    }
    
    const chatWidget = document.getElementById('chatWidget');
    if (chatWidget) {
        chatWidget.style.display = 'flex';
        loadChatMessages();
    }
}

function closeChat() {
    const chatWidget = document.getElementById('chatWidget');
    if (chatWidget) chatWidget.style.display = 'none';
}

async function loadChatMessages() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    chatMessages.innerHTML = '';
    
    try {
        const snapshot = await database.ref('messages').orderByChild('userId').equalTo(currentUser.uid).once('value');
        
        snapshot.forEach(child => {
            const message = child.val();
            
            const userMsg = document.createElement('div');
            userMsg.className = 'chat-message user';
            userMsg.innerHTML = `
                <div class="message-sender">You</div>
                <div>${message.text}</div>
                <div class="message-time">${timeAgo(message.timestamp)}</div>
            `;
            chatMessages.appendChild(userMsg);
            
            if (message.reply) {
                const adminMsg = document.createElement('div');
                adminMsg.className = 'chat-message admin';
                adminMsg.innerHTML = `
                    <div class="message-sender">Admin</div>
                    <div>${message.reply.text}</div>
                    <div class="message-time">${timeAgo(message.reply.timestamp)}</div>
                `;
                chatMessages.appendChild(adminMsg);
            }
        });
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (error) {
        console.error('Error loading chat messages:', error);
    }
}

async function sendMessage() {
    const chatMessageInput = document.getElementById('chatMessageInput');
    if (!chatMessageInput) return;
    
    const text = chatMessageInput.value.trim();
    if (!text) return;
    
    try {
        await database.ref('messages').push({
            userId: currentUser.uid,
            username: currentUser.username,
            text: text,
            timestamp: Date.now()
        });
        
        chatMessageInput.value = '';
        loadChatMessages();
        showNotification('Message sent!', 'success');
    } catch (error) {
        showNotification('Failed to send message', 'error');
    }
}

// Load Content
async function loadAllContent() {
    console.log('📦 Loading all content...');
    const types = ['addons', 'templates', 'shaders', 'skins'];
    
    for (const type of types) {
        try {
            const snapshot = await database.ref(type).once('value');
            allContent[type] = [];
            
            snapshot.forEach(child => {
                allContent[type].push(child.val());
            });
            
            allContent[type].sort((a, b) => b.createdAt - a.createdAt);
            console.log(`✅ Loaded ${allContent[type].length} ${type}`);
        } catch (error) {
            console.error(`❌ Error loading ${type}:`, error);
        }
    }
    
    loadRecentContent();
}

function loadRecentContent() {
    const recentContainer = document.getElementById('recentContent');
    if (!recentContainer) return;
    
    recentContainer.innerHTML = '';
    
    const allItems = [
        ...allContent.addons,
        ...allContent.templates,
        ...allContent.shaders,
        ...allContent.skins
    ].sort((a, b) => b.createdAt - a.createdAt).slice(0, 6);
    
    if (allItems.length === 0) {
        recentContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-gray);">No content yet. Be the first to upload!</p>';
        return;
    }
    
    allItems.forEach(item => {
        recentContainer.appendChild(createContentCard(item));
    });
}

function loadContentGrid(type, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (allContent[type].length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-gray);">No content available yet. Be the first to upload!</p>';
        return;
    }
    
    allContent[type].forEach(item => {
        grid.appendChild(createContentCard(item));
    });
}

function createContentCard(item) {
    const card = document.createElement('div');
    card.className = 'content-card';
    card.onclick = () => showContentDetail(item);
    
    const rating = item.ratingCount > 0 ? (item.rating / item.ratingCount).toFixed(1) : '0.0';
    
    card.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/300x200/00ffff/000000?text=No+Image'">
        <div class="content-info">
            <h3>${item.name}</h3>
            <p>${item.description.substring(0, 100)}${item.description.length > 100 ? '...' : ''}</p>
            <div class="content-meta">
                <div class="content-author">
                    <i class="fas fa-user"></i>
                    ${item.author}
                    ${getUserBadgeHTML(item.author)}
                </div>
                <div class="content-rating">
                    <span class="stars">★</span>
                    ${rating}
                </div>
            </div>
            <div class="content-meta">
                <span><i class="fas fa-download"></i> ${item.downloads || 0}</span>
                <span><i class="fas fa-clock"></i> ${timeAgo(item.createdAt)}</span>
            </div>
        </div>
    `;
    
    return card;
}

function getUserBadgeHTML(username) {
    if (username === 'AshenGamerZ') {
        return '<span class="author-badge">ADMIN</span>';
    }
    return '';
}

function timeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
    return Math.floor(seconds / 86400) + 'd ago';
}

function showContentDetail(item) {
    const contentModal = document.getElementById('contentModal');
    const detail = document.getElementById('contentDetail');
    
    if (!contentModal || !detail) return;
    
    const rating = item.ratingCount > 0 ? (item.rating / item.ratingCount).toFixed(1) : '0.0';
    
    detail.innerHTML = `
        <div>
            <img src="${item.imageUrl}" alt="${item.name}" class="content-detail-image">
        </div>
        <div class="content-detail-info">
            <h2>${item.name}</h2>
            <div class="content-detail-meta">
                <p><i class="fas fa-user"></i> By ${item.author}</p>
                <p><i class="fas fa-download"></i> ${item.downloads || 0} downloads</p>
                <p><i class="fas fa-star"></i> ${rating} (${item.ratingCount || 0} ratings)</p>
                <p><i class="fas fa-clock"></i> ${new Date(item.createdAt).toLocaleDateString()}</p>
            </div>
            <div class="content-detail-description">
                <h3>Description</h3>
                <p>${item.description}</p>
            </div>
            ${item.fileUrl ? `
                <button class="btn btn-primary" onclick="downloadContent('${item.id}', '${item.type}', '${item.fileUrl}', '${item.fileName || 'download'}')">
                    <i class="fas fa-download"></i> Download
                </button>
            ` : ''}
        </div>
    `;
    
    contentModal.style.display = 'block';
}

async function downloadContent(id, type, url, filename) {
    try {
        await database.ref(`${type}/${id}/downloads`).transaction(current => (current || 0) + 1);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Download started!', 'success');
        updateStats();
    } catch (error) {
        showNotification('Download failed', 'error');
    }
}

// Servers
async function loadServers() {
    const communityServers = document.getElementById('communityServers');
    if (!communityServers) return;
    
    communityServers.innerHTML = '';
    
    try {
        const snapshot = await database.ref('servers').once('value');
        
        if (!snapshot.exists()) {
            communityServers.innerHTML = '<p style="color: var(--text-gray); padding: 20px;">No community servers yet. Be the first to add one!</p>';
            return;
        }
        
        snapshot.forEach(child => {
            const server = child.val();
            const serverCard = createServerCard(server);
            communityServers.appendChild(serverCard);
        });
    } catch (error) {
        console.error('Error loading servers:', error);
    }
}

function createServerCard(server) {
    const card = document.createElement('div');
    card.className = 'server-card';
    
    card.innerHTML = `
        <img src="${server.imageUrl}" alt="${server.name}" class="server-img" onerror="this.src='https://via.placeholder.com/100x100/ff0000/ffffff?text=Server'">
        <div class="server-info">
            <h4>${server.name}</h4>
            <p class="server-description">${server.description}</p>
            <div class="server-details">
                <div class="server-ip">
                    <i class="fas fa-globe"></i>
                    <span>${server.ip}</span>
                    <button class="copy-btn" onclick="copyText('${server.ip}')"><i class="fas fa-copy"></i></button>
                </div>
                <div class="server-port">
                    <i class="fas fa-network-wired"></i>
                    <span>${server.port}</span>
                    <button class="copy-btn" onclick="copyText('${server.port}')"><i class="fas fa-copy"></i></button>
                </div>
            </div>
            <small style="color: var(--text-gray); margin-top: 10px; display: block;">
                <i class="fas fa-user"></i> Added by ${server.author}
            </small>
        </div>
    `;
    
    return card;
}

window.copyText = function(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy', 'error');
    });
}

// Leaderboard
async function loadLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    if (!leaderboardList) return;
    
    leaderboardList.innerHTML = '';
    
    try {
        const snapshot = await database.ref('users').orderByChild('points').once('value');
        const users = [];
        
        snapshot.forEach(child => {
            users.push(child.val());
        });
        
        users.reverse();
        
        users.forEach((user, index) => {
            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            
            let rankClass = '';
            if (index === 0) rankClass = 'gold';
            else if (index === 1) rankClass = 'silver';
            else if (index === 2) rankClass = 'bronze';
            
            item.innerHTML = `
                <span class="rank ${rankClass}">#${index + 1}</span>
                <div class="leaderboard-user">
                    <img src="https://ui-avatars.com/api/?name=${user.username}&background=00ffff&color=000" alt="${user.username}">
                    <span>${user.username}</span>
                </div>
                <span>${user.uploads || 0}</span>
                <span>${user.points || 0}</span>
            `;
            
            leaderboardList.appendChild(item);
        });
    } catch (error) {
        console.error('Error loading leaderboard:', error);
    }
}

// Profile
async function loadProfile() {
    if (!currentUser) {
        showNotification('Please login to view your profile', 'error');
        navigateTo('home');
        return;
    }
    
    document.getElementById('profileAvatar').src = `https://ui-avatars.com/api/?name=${currentUser.username}&background=00ffff&color=000&size=120`;
    document.getElementById('profileName').textContent = currentUser.username;
    document.getElementById('profileUploads').textContent = currentUser.uploads || 0;
    document.getElementById('profilePoints').textContent = currentUser.points || 0;
    
    const badgesContainer = document.getElementById('profileBadges');
    badgesContainer.innerHTML = '';
    
    if (currentUser.badges && currentUser.badges.length > 0) {
        currentUser.badges.forEach(badge => {
            const badgeEl = document.createElement('span');
            badgeEl.className = `badge badge-${badge}`;
            badgeEl.textContent = badge.toUpperCase();
            badgesContainer.appendChild(badgeEl);
        });
    }
    
    const profileGrid = document.getElementById('profileContentGrid');
    profileGrid.innerHTML = '';
    
    let totalDownloads = 0;
    const types = ['addons', 'templates', 'shaders', 'skins'];
    
    for (const type of types) {
        const snapshot = await database.ref(type).orderByChild('authorId').equalTo(currentUser.uid).once('value');
        
        snapshot.forEach(child => {
            const item = child.val();
            totalDownloads += item.downloads || 0;
            profileGrid.appendChild(createContentCard(item));
        });
    }
    
    document.getElementById('profileDownloads').textContent = totalDownloads;
}

// Admin Panel
async function loadAdminPanel() {
    if (!currentUser || (currentUser.username !== 'AshenGamerZ' && currentUser.role !== 'admin')) {
        showNotification('Access denied', 'error');
        navigateTo('home');
        return;
    }
    
    const usersSnapshot = await database.ref('users').once('value');
    const totalUsers = usersSnapshot.numChildren();
    document.getElementById('adminTotalUsers').textContent = totalUsers;
    
    let totalContent = 0;
    const types = ['addons', 'templates', 'shaders', 'skins', 'servers'];
    for (const type of types) {
        const snapshot = await database.ref(type).once('value');
        totalContent += snapshot.numChildren();
    }
    document.getElementById('adminTotalContent').textContent = totalContent;
    
    const messagesSnapshot = await database.ref('messages').once('value');
    document.getElementById('adminTotalMessages').textContent = messagesSnapshot.numChildren();
    
    const usersList = document.getElementById('adminUsersList');
    usersList.innerHTML = '';
    
    usersSnapshot.forEach(child => {
        const user = child.val();
        const userItem = createAdminUserItem(child.key, user);
        usersList.appendChild(userItem);
    });
    
    const messagesList = document.getElementById('adminMessagesList');
    messagesList.innerHTML = '';
    
    messagesSnapshot.forEach(child => {
        const message = child.val();
        const messageItem = createAdminMessageItem(child.key, message);
        messagesList.appendChild(messageItem);
    });
}

function createAdminUserItem(uid, user) {
    const item = document.createElement('div');
    item.className = 'admin-user-item';
    
    item.innerHTML = `
        <div class="admin-user-header">
            <strong>${user.username}</strong>
            <span>Uploads: ${user.uploads || 0} | Points: ${user.points || 0}</span>
        </div>
        <div class="badge-controls">
            <button class="badge-btn" style="background: linear-gradient(45deg, #00ff00, #00ffff);" 
                    onclick="giveBadge('${uid}', 'verified')">
                Give Verified Badge
            </button>
            <button class="badge-btn" style="background: linear-gradient(45deg, #ffd700, #ff8c00);" 
                    onclick="giveBadge('${uid}', 'premium')">
                Give Premium Badge
            </button>
        </div>
    `;
    
    return item;
}

window.giveBadge = async function(uid, badge) {
    try {
        const userRef = database.ref('users/' + uid);
        const snapshot = await userRef.once('value');
        const user = snapshot.val();
        
        const badges = user.badges || [];
        if (!badges.includes(badge)) {
            badges.push(badge);
            await userRef.update({ badges: badges });
            showNotification(`${badge} badge given!`, 'success');
            loadAdminPanel();
        } else {
            showNotification('User already has this badge', 'info');
        }
    } catch (error) {
        showNotification('Failed to give badge', 'error');
    }
}

function createAdminMessageItem(id, message) {
    const item = document.createElement('div');
    item.className = 'admin-message-item';
    
    item.innerHTML = `
        <div class="message-header">
            <span>${message.username}</span>
            <span>${timeAgo(message.timestamp)}</span>
        </div>
        <div class="message-text">${message.text}</div>
        <div class="reply-section">
            <input type="text" class="reply-input" id="reply-${id}" placeholder="Type your reply...">
            <button class="btn btn-primary" onclick="replyToMessage('${id}', '${message.userId}')">Reply</button>
        </div>
    `;
    
    return item;
}

window.replyToMessage = async function(messageId, userId) {
    const replyText = document.getElementById(`reply-${messageId}`).value;
    
    if (!replyText) {
        showNotification('Please enter a reply', 'error');
        return;
    }
    
    try {
        await database.ref(`messages/${messageId}/reply`).set({
            text: replyText,
            timestamp: Date.now()
        });
        
        showNotification('Reply sent!', 'success');
        document.getElementById(`reply-${messageId}`).value = '';
    } catch (error) {
        showNotification('Failed to send reply', 'error');
    }
}

// Stats
async function updateStats() {
    try {
        const usersSnapshot = await database.ref('users').once('value');
        const totalUsers = usersSnapshot.numChildren();
        
        let totalContent = 0;
        let totalDownloads = 0;
        
        const types = ['addons', 'templates', 'shaders', 'skins', 'servers'];
        for (const type of types) {
            const snapshot = await database.ref(type).once('value');
            totalContent += snapshot.numChildren();
            
            snapshot.forEach(child => {
                totalDownloads += child.val().downloads || 0;
            });
        }
        
        document.getElementById('totalUsers').textContent = totalUsers;
        document.getElementById('totalContent').textContent = totalContent;
        document.getElementById('totalDownloads').textContent = totalDownloads;
        
        document.getElementById('footerUsers').textContent = totalUsers;
        document.getElementById('footerContent').textContent = totalContent;
        document.getElementById('footerDownloads').textContent = totalDownloads;
    } catch (error) {
        console.error('Failed to update stats:', error);
    }
}

// Utility Functions
function showLoading() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner) loadingSpinner.style.display = 'flex';
}

function hideLoading() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner) loadingSpinner.style.display = 'none';
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#00ff00' : type === 'error' ? '#ff0000' : '#00ffff'};
        color: #000;
        border-radius: 5px;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 0 20px ${type === 'success' ? '#00ff00' : type === 'error' ? '#ff0000' : '#00ffff'};
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

console.log('✅ MineZ Zone loaded - Vercel Backend Mode');