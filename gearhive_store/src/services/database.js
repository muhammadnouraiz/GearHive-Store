/* src/services/database.js (Store App) */
import conf from '../config/conf';
import appwriteService from './appwrite';
import { ID } from 'appwrite'; // ✅ Ensure ID is imported

export class DatabaseService {

    // ... (Keep getProduct and getProducts exactly as they are) ...
    async getProduct(slug) {
        try {
            return await appwriteService.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionProducts,
                slug
            )
        } catch (error) {
            console.log("Appwrite service :: getProduct :: error", error);
            return false;
        }
    }

    async getProducts(queries = []) {
        try {
            return await appwriteService.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionProducts,
                queries,
            )
        } catch (error) {
            console.log("Appwrite service :: getProducts :: error", error);
            return false;
        }
    }

    // ✅ Method: Updates the quantity (stock) number
    async updateProductStock(id, newQuantity) {
        try {
            return await appwriteService.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionProducts,
                id,
                { quantity: newQuantity } 
            )
        } catch (error) {
            console.log("Appwrite service :: updateProductStock :: error", error);
            return false;
        }
    }

    // ✅ NEW METHOD: Create the Order in Database
    async createOrder(orderData) {
        try {
            return await appwriteService.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionOrders, // This comes from your updated conf.js
                ID.unique(),
                orderData
            );
        } catch (error) {
            console.log("Appwrite service :: createOrder :: error", error);
            return false;
        }
    }

    // 🖼️ Get Image View
    getFileView(fileId) {
        return appwriteService.bucket.getFileView(
            conf.appwriteBucketImages,
            fileId
        );
    }
}

const databaseService = new DatabaseService();
export default databaseService;