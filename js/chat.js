// Real-time Cloud Chat System
class CloudChatSystem {
    constructor() {
        this.messagesRef = database.ref('chat/messages');
        this.setupRealtimeListener();
    }

    setupRealtimeListener() {
        this.messagesRef.limitToLast(50).on('child_added', (snapshot) => {
            const message = snapshot.val();
            this.displayMessage(message);
        });
    }

    async addMessage(username, message, isAdmin = false) {
        try {
            const newMessage = {
                id: Date.now(),
                username,
                message,
                isAdmin,
                timestamp: new Date().toISOString(),
                avatar: auth.currentUser?.avatar || `https://ui-avatars.com/api/?name=${username}&background=00ffff&color=000`
            };

            await this.messagesRef.push(newMessage);
            console.log('✅ Message sent');
        } catch (error) {
            console.error('❌ Error sending message:', error);
            alert('Failed to send message');
        }
    }

    displayMessage(msg) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${msg.isAdmin ? 'admin' : ''}`;
        
        const time = new Date(msg.timestamp).toLocaleTimeString();
        
        messageDiv.innerHTML = `
            <div style="display: flex; gap: 10px; align-items: start;">
                <img src="${msg.avatar}" alt="${msg.username}" 
                     style="width: 35px; height: 35px; border-radius: 50%; border: 2px solid var(--primary-aqua);">
                <div style="flex: 1;">
                    <div class="message-header">
                        ${msg.isAdmin ? '👑 ' : ''}${msg.username}
                    </div>
                    <div class="message-body">${this.escapeHtml(msg.message)}</div>
                    <div class="message-time">${time}</div>
                </div>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize chat
let chat;
document.addEventListener('DOMContentLoaded', () => {
    chat = new CloudChatSystem();
});

// Send message
async function sendMessage() {
    const input = document.getElementById('chatMessageInput');
    const message = input.value.trim();

    if (!message) return;

    if (!auth.isLoggedIn()) {
        alert('Please login to send messages!');
        window.location.href = 'login.html';
        return;
    }

    await chat.addMessage(auth.currentUser.username, message, auth.isAdmin());
    input.value = '';
}

// Toggle chat
function toggleChat() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.classList.toggle('minimized');
}

// Enter key to send
document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chatMessageInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});