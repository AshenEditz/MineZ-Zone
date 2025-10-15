// Google Drive Auto Backup System
class GoogleDriveBackup {
    constructor() {
        this.CLIENT_ID = '968271896517-q54v37dqchs9b89ko7lj4aot9bnj04ek.apps.googleusercontent.com';
        this.API_KEY = 'AIzaSyCpaeX2r49CyHPyP5LwhefBQXqbD89F5_w';
        this.DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
        this.SCOPES = 'https://www.googleapis.com/auth/drive.file';
        this.isSignedIn = false;
        this.backupFolderId = null;
    }

    async init() {
        try {
            await gapi.load('client:auth2', async () => {
                await gapi.client.init({
                    apiKey: this.API_KEY,
                    clientId: this.CLIENT_ID,
                    discoveryDocs: this.DISCOVERY_DOCS,
                    scope: this.SCOPES
                });
                this.isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
                console.log('✅ Google Drive API initialized');
            });
        } catch (error) {
            console.error('❌ Google Drive init error:', error);
        }
    }

    async signIn() {
        try {
            await gapi.auth2.getAuthInstance().signIn();
            this.isSignedIn = true;
            console.log('✅ Signed in to Google Drive');
            return true;
        } catch (error) {
            console.error('❌ Sign in error:', error);
            return false;
        }
    }

    async createBackupFolder() {
        try {
            const response = await gapi.client.drive.files.list({
                q: "name='MineZ-ZONE-Backups' and mimeType='application/vnd.google-apps.folder' and trashed=false",
                fields: 'files(id, name)',
                spaces: 'drive'
            });

            if (response.result.files.length > 0) {
                this.backupFolderId = response.result.files[0].id;
                return this.backupFolderId;
            }

            const fileMetadata = {
                name: 'MineZ-ZONE-Backups',
                mimeType: 'application/vnd.google-apps.folder'
            };

            const folder = await gapi.client.drive.files.create({
                resource: fileMetadata,
                fields: 'id'
            });

            this.backupFolderId = folder.result.id;
            console.log('✅ Backup folder created');
            return this.backupFolderId;
        } catch (error) {
            console.error('❌ Error creating folder:', error);
            return null;
        }
    }

    async backupAllData() {
        if (!this.isSignedIn) {
            const signedIn = await this.signIn();
            if (!signedIn) return { success: false, message: 'Failed to sign in' };
        }

        try {
            await this.createBackupFolder();

            const backupData = {
                timestamp: new Date().toISOString(),
                users: await this.getFirebaseData('users'),
                content: await this.getFirebaseData('content'),
                chat: await this.getFirebaseData('chat/messages'),
                metadata: {
                    version: '1.0',
                    website: 'MineZ ZONE'
                }
            };

            const fileName = `MineZ-Backup-${new Date().toISOString().split('T')[0]}.json`;
            const fileContent = JSON.stringify(backupData, null, 2);
            const file = new Blob([fileContent], { type: 'application/json' });

            const metadata = {
                name: fileName,
                mimeType: 'application/json',
                parents: [this.backupFolderId]
            };

            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            form.append('file', file);

            const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                method: 'POST',
                headers: new Headers({ 'Authorization': 'Bearer ' + gapi.auth.getToken().access_token }),
                body: form
            });

            const result = await response.json();

            if (result.id) {
                console.log('✅ Backup successful');
                return { 
                    success: true, 
                    message: 'Backup saved to Google Drive!',
                    fileId: result.id,
                    fileName: fileName
                };
            }

            throw new Error('Backup failed');
        } catch (error) {
            console.error('❌ Backup error:', error);
            return { success: false, message: 'Backup failed: ' + error.message };
        }
    }

    async getFirebaseData(path) {
        try {
            const snapshot = await database.ref(path).once('value');
            return snapshot.val();
        } catch (error) {
            console.error(`Error getting ${path}:`, error);
            return null;
        }
    }

    startAutoBackup() {
        setInterval(() => {
            this.backupAllData();
        }, 24 * 60 * 60 * 1000);
        console.log('✅ Auto-backup enabled (every 24 hours)');
    }

    async listBackups() {
        try {
            await this.createBackupFolder();

            const response = await gapi.client.drive.files.list({
                q: `'${this.backupFolderId}' in parents and trashed=false`,
                fields: 'files(id, name, createdTime, size)',
                orderBy: 'createdTime desc'
            });

            return response.result.files;
        } catch (error) {
            console.error('❌ Error listing backups:', error);
            return [];
        }
    }

    async restoreFromBackup(fileId) {
        try {
            const response = await gapi.client.drive.files.get({
                fileId: fileId,
                alt: 'media'
            });

            const backupData = response.result;

            if (backupData.users) {
                await database.ref('users').set(backupData.users);
            }
            if (backupData.content) {
                await database.ref('content').set(backupData.content);
            }
            if (backupData.chat) {
                await database.ref('chat/messages').set(backupData.chat);
            }

            console.log('✅ Data restored');
            return { success: true, message: 'Data restored!' };
        } catch (error) {
            console.error('❌ Restore error:', error);
            return { success: false, message: 'Restore failed' };
        }
    }
}

// Initialize
let driveBackup;

function loadGoogleAPI() {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
        driveBackup = new GoogleDriveBackup();
        driveBackup.init();
    };
    document.head.appendChild(script);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadGoogleAPI);
} else {
    loadGoogleAPI();
}