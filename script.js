/* Reset & Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary-red: #ff0000;
    --primary-black: #000000;
    --primary-aqua: #00ffff;
    --secondary-red: #cc0000;
    --dark-bg: #0a0a0a;
    --card-bg: #1a1a1a;
    --text-white: #ffffff;
    --text-gray: #cccccc;
    --shadow: 0 4px 20px rgba(0, 255, 255, 0.3);
    --transition: all 0.3s ease;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: var(--dark-bg);
    color: var(--text-white);
    line-height: 1.6;
    overflow-x: hidden;
}

/* Animated Background */
.animated-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    overflow: hidden;
    background: linear-gradient(135deg, #000000 0%, #1a0000 50%, #001a1a 100%);
}

.cube {
    position: absolute;
    width: 100px;
    height: 100px;
    border: 2px solid var(--primary-aqua);
    opacity: 0.1;
    animation: float 20s infinite;
}

.cube:nth-child(1) {
    top: 10%;
    left: 10%;
    animation-delay: 0s;
}

.cube:nth-child(2) {
    top: 60%;
    left: 80%;
    animation-delay: 4s;
}

.cube:nth-child(3) {
    top: 30%;
    left: 50%;
    animation-delay: 8s;
}

.cube:nth-child(4) {
    top: 80%;
    left: 20%;
    animation-delay: 12s;
}

.cube:nth-child(5) {
    top: 50%;
    left: 70%;
    animation-delay: 16s;
}

@keyframes float {
    0%, 100% {
        transform: translateY(0) rotate(0deg);
    }
    25% {
        transform: translateY(-50px) rotate(90deg);
    }
    50% {
        transform: translateY(-100px) rotate(180deg);
    }
    75% {
        transform: translateY(-50px) rotate(270deg);
    }
}

/* Container */
.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header */
.header {
    background: rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 2px solid var(--primary-aqua);
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: var(--shadow);
}

.header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
}

.logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 24px;
    font-weight: bold;
    color: var(--primary-aqua);
    text-shadow: 0 0 10px var(--primary-aqua);
}

.logo i {
    animation: rotate 4s linear infinite;
}

@keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.nav-menu {
    display: flex;
    gap: 20px;
}

.nav-link {
    color: var(--text-white);
    text-decoration: none;
    padding: 8px 16px;
    border-radius: 5px;
    transition: var(--transition);
    position: relative;
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: var(--primary-aqua);
    transition: var(--transition);
    transform: translateX(-50%);
}

.nav-link:hover, .nav-link.active {
    color: var(--primary-aqua);
}

.nav-link:hover::after, .nav-link.active::after {
    width: 80%;
}

/* Buttons */
.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    transition: var(--transition);
    text-transform: uppercase;
}

.btn-primary {
    background: var(--primary-aqua);
    color: var(--primary-black);
    box-shadow: 0 0 10px var(--primary-aqua);
}

.btn-primary:hover {
    background: var(--primary-red);
    color: var(--text-white);
    box-shadow: 0 0 20px var(--primary-red);
    transform: translateY(-2px);
}

.btn-login {
    background: transparent;
    color: var(--primary-aqua);
    border: 2px solid var(--primary-aqua);
}

.btn-login:hover {
    background: var(--primary-aqua);
    color: var(--primary-black);
}

.btn-register {
    background: var(--primary-red);
    color: var(--text-white);
}

.btn-register:hover {
    background: var(--secondary-red);
    transform: translateY(-2px);
}

.btn-logout {
    background: var(--primary-red);
    color: var(--text-white);
    padding: 8px 16px;
}

.auth-buttons {
    display: flex;
    gap: 10px;
    align-items: center;
}

.user-profile {
    display: flex;
    align-items: center;
    gap: 10px;
}

.profile-img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid var(--primary-aqua);
}

.username {
    color: var(--primary-aqua);
    font-weight: bold;
}

.mobile-toggle {
    display: none;
    font-size: 24px;
    cursor: pointer;
    color: var(--primary-aqua);
}

/* Hero Section */
.hero-section {
    padding: 80px 0;
    text-align: center;
}

.hero-content {
    margin-bottom: 60px;
}

.hero-title {
    font-size: 48px;
    margin-bottom: 20px;
    animation: fadeInDown 1s;
}

.animated-text {
    background: linear-gradient(90deg, var(--primary-aqua), var(--primary-red), var(--primary-aqua));
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradient 3s ease infinite;
}

@keyframes gradient {
    0%, 100% { background-position: 0% center; }
    50% { background-position: 100% center; }
}

.highlight {
    color: var(--primary-aqua);
    text-shadow: 0 0 20px var(--primary-aqua);
}

.hero-subtitle {
    font-size: 24px;
    color: var(--primary-red);
    margin-bottom: 10px;
    animation: fadeInUp 1s;
}

.hero-description {
    font-size: 18px;
    color: var(--text-gray);
    animation: fadeInUp 1s 0.2s backwards;
}

.hero-stats {
    display: flex;
    justify-content: center;
    gap: 60px;
    margin-top: 40px;
    flex-wrap: wrap;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.stat-item i {
    font-size: 40px;
    color: var(--primary-aqua);
}

.stat-number {
    font-size: 36px;
    font-weight: bold;
    color: var(--primary-red);
}

.stat-label {
    color: var(--text-gray);
    text-transform: uppercase;
    font-size: 14px;
}

/* Featured Section */
.featured-section {
    margin: 60px 0;
}

.section-title {
    font-size: 36px;
    text-align: center;
    margin-bottom: 40px;
    color: var(--primary-aqua);
    text-shadow: 0 0 10px var(--primary-aqua);
}

.content-categories {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
}

.category-card {
    background: var(--card-bg);
    padding: 40px 20px;
    border-radius: 15px;
    text-align: center;
    border: 2px solid transparent;
    transition: var(--transition);
    cursor: pointer;
}

.category-card:hover {
    border-color: var(--primary-aqua);
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
    transform: translateY(-10px);
}

.category-card i {
    font-size: 60px;
    color: var(--primary-aqua);
    margin-bottom: 20px;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

.category-card h3 {
    font-size: 24px;
    margin-bottom: 10px;
    color: var(--text-white);
}

.category-card p {
    color: var(--text-gray);
    margin-bottom: 20px;
}

/* Content Grid */
.content-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
    margin-top: 30px;
}

.content-card {
    background: var(--card-bg);
    border-radius: 15px;
    overflow: hidden;
    border: 2px solid transparent;
    transition: var(--transition);
    cursor: pointer;
}

.content-card:hover {
    border-color: var(--primary-aqua);
    box-shadow: var(--shadow);
    transform: translateY(-5px);
}

.content-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.content-info {
    padding: 20px;
}

.content-info h3 {
    font-size: 20px;
    margin-bottom: 10px;
    color: var(--primary-aqua);
}

.content-info p {
    color: var(--text-gray);
    font-size: 14px;
    margin-bottom: 15px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.content-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--text-gray);
    font-size: 13px;
}

.content-author {
    display: flex;
    align-items: center;
    gap: 5px;
}

.author-badge {
    display: inline-block;
    padding: 2px 8px;
    background: linear-gradient(45deg, var(--primary-aqua), var(--primary-red));
    border-radius: 10px;
    font-size: 10px;
    font-weight: bold;
    margin-left: 5px;
    animation: badgeGlow 2s infinite;
}

@keyframes badgeGlow {
    0%, 100% { box-shadow: 0 0 5px var(--primary-aqua); }
    50% { box-shadow: 0 0 15px var(--primary-red); }
}

.content-rating {
    display: flex;
    align-items: center;
    gap: 5px;
}

.stars {
    color: #ffd700;
}

.content-actions {
    display: flex;
    gap: 10px;
    margin-top: 15px;
}

.content-actions .btn {
    flex: 1;
    padding: 8px;
    font-size: 12px;
}

/* Section Header */
.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    flex-wrap: wrap;
    gap: 20px;
}

/* Server Cards */
.top-servers, .other-servers {
    margin-bottom: 40px;
}

.subsection-title {
    font-size: 24px;
    color: var(--primary-red);
    margin-bottom: 20px;
}

.server-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.server-card {
    background: var(--card-bg);
    padding: 20px;
    border-radius: 15px;
    border: 2px solid transparent;
    transition: var(--transition);
    display: flex;
    gap: 20px;
    position: relative;
}

.server-card:hover {
    border-color: var(--primary-aqua);
    box-shadow: var(--shadow);
}

.top-server {
    border-color: #ffd700;
}

.server-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: linear-gradient(45deg, #ffd700, #ff8c00);
    color: var(--primary-black);
    padding: 5px 15px;
    border-radius: 20px;
    font-weight: bold;
    font-size: 12px;
    animation: badgeGlow 2s infinite;
}

.server-img {
    width: 100px;
    height: 100px;
    border-radius: 10px;
    object-fit: cover;
}

.server-info {
    flex: 1;
}

.server-info h4 {
    font-size: 20px;
    color: var(--primary-aqua);
    margin-bottom: 10px;
}

.server-description {
    color: var(--text-gray);
    margin-bottom: 15px;
}

.server-details {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.server-ip, .server-port {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(0, 255, 255, 0.1);
    padding: 10px;
    border-radius: 5px;
}

.server-ip i, .server-port i {
    color: var(--primary-aqua);
}

.copy-btn {
    background: var(--primary-red);
    color: var(--text-white);
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: var(--transition);
    margin-left: auto;
}

.copy-btn:hover {
    background: var(--primary-aqua);
    color: var(--primary-black);
}

/* Leaderboard */
.leaderboard-container {
    background: var(--card-bg);
    border-radius: 15px;
    overflow: hidden;
    border: 2px solid var(--primary-aqua);
}

.leaderboard-header {
    display: grid;
    grid-template-columns: 80px 1fr 120px 120px;
    padding: 20px;
    background: rgba(0, 255, 255, 0.1);
    font-weight: bold;
    color: var(--primary-aqua);
}

.leaderboard-list {
    max-height: 600px;
    overflow-y: auto;
}

.leaderboard-item {
    display: grid;
    grid-template-columns: 80px 1fr 120px 120px;
    padding: 20px;
    border-bottom: 1px solid rgba(0, 255, 255, 0.1);
    transition: var(--transition);
}

.leaderboard-item:hover {
    background: rgba(0, 255, 255, 0.05);
}

.rank {
    font-size: 24px;
    font-weight: bold;
    color: var(--primary-red);
}

.rank.gold { color: #ffd700; }
.rank.silver { color: #c0c0c0; }
.rank.bronze { color: #cd7f32; }

.leaderboard-user {
    display: flex;
    align-items: center;
    gap: 10px;
}

.leaderboard-user img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

/* Profile */
.profile-container {
    max-width: 900px;
    margin: 0 auto;
}

.profile-header {
    display: flex;
    align-items: center;
    gap: 30px;
    background: var(--card-bg);
    padding: 40px;
    border-radius: 15px;
    margin-bottom: 30px;
    border: 2px solid var(--primary-aqua);
}

.profile-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 4px solid var(--primary-aqua);
    box-shadow: 0 0 20px var(--primary-aqua);
}

.profile-name {
    font-size: 32px;
    color: var(--primary-aqua);
    margin-bottom: 10px;
}

.profile-badges {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.badge {
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: bold;
    animation: badgeGlow 2s infinite;
}

.badge-admin {
    background: linear-gradient(45deg, #ff0000, #ff8c00);
}

.badge-verified {
    background: linear-gradient(45deg, #00ff00, #00ffff);
    color: var(--primary-black);
}

.badge-premium {
    background: linear-gradient(45deg, #ffd700, #ff8c00);
    color: var(--primary-black);
}

.profile-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.profile-stat {
    background: var(--card-bg);
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    border: 2px solid transparent;
    transition: var(--transition);
}

.profile-stat:hover {
    border-color: var(--primary-aqua);
    box-shadow: var(--shadow);
}

.profile-stat i {
    font-size: 40px;
    color: var(--primary-aqua);
    margin-bottom: 10px;
}

.profile-content h3 {
    font-size: 24px;
    margin-bottom: 20px;
    color: var(--primary-aqua);
}

/* Admin Panel */
.admin-container {
    max-width: 1200px;
    margin: 0 auto;
}

.admin-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
}

.admin-stat-card {
    background: var(--card-bg);
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    border: 2px solid var(--primary-aqua);
    transition: var(--transition);
}

.admin-stat-card:hover {
    box-shadow: var(--shadow);
    transform: translateY(-5px);
}

.admin-stat-card i {
    font-size: 50px;
    color: var(--primary-aqua);
    margin-bottom: 15px;
}

.admin-stat-number {
    font-size: 36px;
    font-weight: bold;
    color: var(--primary-red);
    margin-top: 10px;
}

.admin-sections {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
}

.admin-section {
    background: var(--card-bg);
    padding: 30px;
    border-radius: 15px;
    border: 2px solid var(--primary-aqua);
}

.admin-section h3 {
    font-size: 24px;
    color: var(--primary-aqua);
    margin-bottom: 20px;
}

.admin-user-item, .admin-message-item {
    padding: 15px;
    background: rgba(0, 255, 255, 0.05);
    border-radius: 10px;
    margin-bottom: 15px;
    border: 1px solid rgba(0, 255, 255, 0.1);
}

.admin-user-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.badge-controls {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
    margin-top: 10px;
}

.badge-btn {
    padding: 5px 10px;
    font-size: 11px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    transition: var(--transition);
}

.badge-btn:hover {
    transform: scale(1.05);
}

.admin-message-item {
    border-left: 4px solid var(--primary-aqua);
}

.message-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    color: var(--primary-aqua);
    font-weight: bold;
}

.message-text {
    color: var(--text-gray);
    margin-bottom: 10px;
}

.reply-section {
    margin-top: 10px;
}

.reply-input {
    width: 100%;
    padding: 10px;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid var(--primary-aqua);
    border-radius: 5px;
    color: var(--text-white);
    margin-bottom: 10px;
}

/* Chat Widget */
.chat-widget {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 350px;
    height: 500px;
    background: var(--card-bg);
    border-radius: 15px;
    border: 2px solid var(--primary-aqua);
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
    z-index: 1000;
}

.chat-header {
    background: rgba(0, 255, 255, 0.1);
    padding: 15px;
    border-radius: 15px 15px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid var(--primary-aqua);
}

.chat-header h4 {
    color: var(--primary-aqua);
    margin: 0;
}

.close-chat {
    background: var(--primary-red);
    color: var(--text-white);
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: var(--transition);
}

.close-chat:hover {
    background: var(--secondary-red);
}

.chat-messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.chat-message {
    padding: 10px 15px;
    border-radius: 10px;
    max-width: 80%;
    word-wrap: break-word;
}

.chat-message.user {
    background: rgba(0, 255, 255, 0.2);
    align-self: flex-end;
    border: 1px solid var(--primary-aqua);
}

.chat-message.admin {
    background: rgba(255, 0, 0, 0.2);
    align-self: flex-start;
    border: 1px solid var(--primary-red);
}

.message-sender {
    font-size: 12px;
    color: var(--primary-aqua);
    margin-bottom: 5px;
    font-weight: bold;
}

.message-time {
    font-size: 10px;
    color: var(--text-gray);
    margin-top: 5px;
}

.chat-input {
    display: flex;
    padding: 15px;
    border-top: 2px solid var(--primary-aqua);
    gap: 10px;
}

.chat-input input {
    flex: 1;
    padding: 10px;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid var(--primary-aqua);
    border-radius: 5px;
    color: var(--text-white);
}

.chat-input button {
    background: var(--primary-aqua);
    color: var(--primary-black);
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: var(--transition);
}

.chat-input button:hover {
    background: var(--primary-red);
    color: var(--text-white);
}

/* Footer */
.footer {
    background: rgba(0, 0, 0, 0.95);
    border-top: 2px solid var(--primary-aqua);
    margin-top: 80px;
    padding: 40px 0 20px;
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 40px;
    margin-bottom: 30px;
}

.footer-section h3, .footer-section h4 {
    color: var(--primary-aqua);
    margin-bottom: 20px;
}

.footer-section p, .footer-section li {
    color: var(--text-gray);
    margin-bottom: 10px;
}

.footer-section ul {
    list-style: none;
}

.footer-section a {
    color: var(--text-gray);
    text-decoration: none;
    transition: var(--transition);
}

.footer-section a:hover {
    color: var(--primary-aqua);
}

.social-links {
    display: flex;
    gap: 15px;
    margin-top: 15px;
}

.social-links a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: var(--card-bg);
    border-radius: 50%;
    border: 2px solid var(--primary-aqua);
    transition: var(--transition);
}

.social-links a:hover {
    background: var(--primary-aqua);
    color: var(--primary-black);
    transform: translateY(-5px);
}

.footer-bottom {
    text-align: center;
    padding-top: 20px;
    border-top: 1px solid rgba(0, 255, 255, 0.2);
    color: var(--text-gray);
}

/* Modals */
.modal {
    display: none;
    position: fixed;
    z-index: 2000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(10px);
}

.modal-content {
    background: var(--card-bg);
    margin: 5% auto;
    padding: 40px;
    border: 2px solid var(--primary-aqua);
    border-radius: 15px;
    width: 90%;
    max-width: 500px;
    box-shadow: var(--shadow);
    animation: modalSlide 0.3s;
}

.modal-large {
    max-width: 800px;
}

@keyframes modalSlide {
    from {
        transform: translateY(-100px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.close-modal {
    color: var(--primary-red);
    float: right;
    font-size: 32px;
    font-weight: bold;
    cursor: pointer;
    transition: var(--transition);
}

.close-modal:hover {
    color: var(--primary-aqua);
    transform: rotate(90deg);
}

.modal-content h2 {
    color: var(--primary-aqua);
    margin-bottom: 30px;
    text-align: center;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: var(--primary-aqua);
    font-weight: bold;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 12px;
    background: rgba(0, 0, 0, 0.5);
    border: 2px solid rgba(0, 255, 255, 0.3);
    border-radius: 5px;
    color: var(--text-white);
    font-size: 14px;
    transition: var(--transition);
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--primary-aqua);
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
}

.btn-block {
    width: 100%;
    padding: 15px;
    font-size: 16px;
}

/* Content Detail */
.content-detail {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
}

.content-detail-image {
    width: 100%;
    border-radius: 10px;
}

.content-detail-info h2 {
    color: var(--primary-aqua);
    margin-bottom: 20px;
}

.content-detail-meta {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
    color: var(--text-gray);
}

.content-detail-description {
    margin-bottom: 20px;
    line-height: 1.8;
}

.rating-section {
    margin: 30px 0;
    padding: 20px;
    background: rgba(0, 255, 255, 0.05);
    border-radius: 10px;
}

.rating-section h3 {
    color: var(--primary-aqua);
    margin-bottom: 15px;
}

.star-rating {
    display: flex;
    gap: 10px;
    font-size: 24px;
    margin-bottom: 15px;
}

.star {
    cursor: pointer;
    color: #555;
    transition: var(--transition);
}

.star:hover,
.star.active {
    color: #ffd700;
}

.reviews-section {
    margin-top: 30px;
}

.review-item {
    padding: 15px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    margin-bottom: 15px;
    border-left: 4px solid var(--primary-aqua);
}

.review-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.reviewer-name {
    color: var(--primary-aqua);
    font-weight: bold;
}

.review-stars {
    color: #ffd700;
}

/* Loading Spinner */
.loading-spinner {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.spinner {
    width: 60px;
    height: 60px;
    border: 4px solid rgba(0, 255, 255, 0.2);
    border-top: 4px solid var(--primary-aqua);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Animations */
@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsive Design */
@media (max-width: 768px) {
    .mobile-toggle {
        display: block;
    }

    .nav-menu {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: rgba(0, 0, 0, 0.98);
        flex-direction: column;
        padding: 20px;
        border-bottom: 2px solid var(--primary-aqua);
    }

    .nav-menu.active {
        display: flex;
    }

    .header .container {
        flex-wrap: wrap;
    }

    .auth-buttons {
        order: 3;
        width: 100%;
        justify-content: center;
        margin-top: 15px;
    }

    .hero-title {
        font-size: 32px;
    }

    .hero-subtitle {
        font-size: 18px;
    }

    .hero-stats {
        gap: 30px;
    }

    .content-categories {
        grid-template-columns: 1fr;
    }

    .content-grid {
        grid-template-columns: 1fr;
    }

    .section-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .server-card {
        flex-direction: column;
    }

    .admin-sections {
        grid-template-columns: 1fr;
    }

    .content-detail {
        grid-template-columns: 1fr;
    }

    .leaderboard-header,
    .leaderboard-item {
        grid-template-columns: 60px 1fr 80px 80px;
        font-size: 14px;
        padding: 15px 10px;
    }

    .chat-widget {
        width: 90%;
        right: 5%;
        bottom: 10px;
    }

    .profile-header {
        flex-direction: column;
        text-align: center;
    }

    .modal-content {
        width: 95%;
        padding: 20px;
        margin: 10% auto;
    }
}

@media (max-width: 480px) {
    .hero-title {
        font-size: 24px;
    }

    .stat-item i {
        font-size: 30px;
    }

    .stat-number {
        font-size: 24px;
    }

    .category-card i {
        font-size: 40px;
    }

    .section-title {
        font-size: 24px;
    }

    .footer-content {
        grid-template-columns: 1fr;
    }
}

/* Scrollbar */
::-webkit-scrollbar {
    width: 10px;
}

::-webkit-scrollbar-track {
    background: var(--dark-bg);
}

::-webkit-scrollbar-thumb {
    background: var(--primary-aqua);
    border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--primary-red);
}

/* Section visibility */
.section {
    padding: 60px 0;
}

.content-section {
    min-height: 60vh;
}