// Cloud Authentication System
class CloudAuthSystem {
    constructor() {
        this.currentUser = null;
        this.usersRef = database.ref('users');
        this.checkAuth();
        this.initializeAdmin();
    }

    async initializeAdmin() {
        try {
            const adminSnapshot = await this.usersRef.child('asheneditz').once('value');
            if (!adminSnapshot.exists()) {
                await this.usersRef.child('asheneditz').set({
                    username: 'asheneditz',
                    email: 'admin@minezzone.com',
                    password: 'AshenGamerZ5543',
                    isAdmin: true,
                    createdAt: new Date().toISOString(),
                    avatar: 'https://ui-avatars.com/api/?name=Admin&background=ff0000&color=fff'
                });
                console.log('✅ Admin account created');
            }
        } catch (error) {
            console.error('Error creating admin:', error);
        }
    }

    async register(username, email, password) {
        try {
            const userSnapshot = await this.usersRef.child(username).once('value');
            if (userSnapshot.exists()) {
                return { success: false, message: 'Username already exists!' };
            }

            const usersSnapshot = await this.usersRef.once('value');
            const users = usersSnapshot.val() || {};
            const emailExists = Object.values(users).some(u => u.email === email);
            
            if (emailExists) {
                return { success: false, message: 'Email already registered!' };
            }

            const newUser = {
                username,
                email,
                password,
                isAdmin: false,
                createdAt: new Date().toISOString(),
                avatar: `https://ui-avatars.com/api/?name=${username}&background=00ffff&color=000`
            };

            await this.usersRef.child(username).set(newUser);
            return { success: true, message: 'Account created successfully!' };
        } catch (error) {
            return { success: false, message: 'Error: ' + error.message };
        }
    }

    async login(username, password) {
        try {
            const userSnapshot = await this.usersRef.child(username).once('value');
            const user = userSnapshot.val();

            if (user && user.password === password) {
                this.currentUser = {
                    username: user.username,
                    email: user.email,
                    isAdmin: user.isAdmin || false,
                    avatar: user.avatar
                };
                
                localStorage.setItem('minezCurrentUser', JSON.stringify(this.currentUser));
                this.updateUIForLoggedInUser();
                
                return { success: true, user: this.currentUser };
            }

            return { success: false, message: 'Invalid username or password!' };
        } catch (error) {
            return { success: false, message: 'Login error: ' + error.message };
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('minezCurrentUser');
        window.location.href = 'index.html';
    }

    checkAuth() {
        const savedUser = localStorage.getItem('minezCurrentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUIForLoggedInUser();
        }
    }

    updateUIForLoggedInUser() {
        const loginBtn = document.querySelector('.btn-login');
        const signupBtn = document.querySelector('.btn-signup');
        const userProfile = document.getElementById('userProfile');
        const userName = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');

        if (this.currentUser && userProfile) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (signupBtn) signupBtn.style.display = 'none';
            userProfile.style.display = 'flex';
            if (userName) userName.textContent = this.currentUser.username;
            if (userAvatar) userAvatar.src = this.currentUser.avatar;
        }
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    isAdmin() {
        return this.currentUser && this.currentUser.isAdmin;
    }
}

// Initialize auth system
const auth = new CloudAuthSystem();

// Login handler
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    submitBtn.disabled = true;
    
    const result = await auth.login(username, password);
    
    if (result.success) {
        alert('✅ Login successful! Welcome ' + result.user.username);
        window.location.href = 'index.html';
    } else {
        alert('❌ ' + result.message);
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        submitBtn.disabled = false;
    }
}

// Signup handler
async function handleSignup(event) {
    event.preventDefault();
    
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('❌ Passwords do not match!');
        return;
    }
    
    if (password.length < 6) {
        alert('❌ Password must be at least 6 characters!');
        return;
    }
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
    submitBtn.disabled = true;
    
    const result = await auth.register(username, email, password);
    
    if (result.success) {
        alert('✅ ' + result.message + ' Please login now.');
        showLogin();
    } else {
        alert('❌ ' + result.message);
    }
    
    submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Sign Up';
    submitBtn.disabled = false;
}

function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
}

function showSignup() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        auth.logout();
    }
}