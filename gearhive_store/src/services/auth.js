/* src/services/auth.js */
import appwriteService from './appwrite';
import { ID } from 'appwrite';

export class AuthService {
    
    // 📝 Register a new customer
    async createAccount({ email, password, name }) {
        try {
            const userAccount = await appwriteService.account.create(
                ID.unique(), // Generate a unique ID for the user
                email,
                password,
                name
            );
            
            if (userAccount) {
                // If account creation is successful, log them in immediately
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (error) {
            console.log("Appwrite service :: createAccount :: error", error);
            throw error;
        }
    }

    // 🔐 Log in existing customer
    async login({ email, password }) {
        try {
            return await appwriteService.account.createEmailPasswordSession(email, password);
        } catch (error) {
            console.log("Appwrite service :: login :: error", error);
            throw error;
        }
    }

    // 👤 Get current logged-in user data
    async getCurrentUser() {
        try {
            return await appwriteService.account.get();
        } catch (error) {
            // It's normal to get an error here if the user isn't logged in
            // console.log("Appwrite service :: getCurrentUser :: error", error);
        }
        return null;
    }

    // 🚪 Log out
    async logout() {
        try {
            await appwriteService.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite service :: logout :: error", error);
        }
    }
}

const authService = new AuthService();
export default authService;