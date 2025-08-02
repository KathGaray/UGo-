import * as SecureStore from 'expo-secure-store';


/*export interface TokenCache {
    getToken: (key: string) => Promise<string | undefined | null>;
    saveToken: (key: string, token: string) => Promise<void>;
    clearToken?: (key: string) => void;
}*/

export const TokenCache = {
    async getToken(key: string) {
        try {
            const item = await SecureStore.getItemAsync(key);
            if (item) {
                console.log(`${key} was used`);
            } else {
                console.log("No values stored for key:" + key);
            }
            return item;
        } catch (error) {
            console.error("SecureStore get item error", error);
            await SecureStore.deleteItemAsync(key);
            return null;
        }
    },
    async saveToken(key: string, token: string) {
        try {
            return SecureStore.setItemAsync(key, token)
        } catch (err) {
            return
        }
    },
}
