class BaseRepo {
    constructor(supabase) {
        if (this.constructor === BaseRepo) throw new Error ("Cannot instantiate abstract class")
        this.supabase = supabase
    }

    /**
     * Retry helper for database operations
     * @param {Function} operation - The async operation to retry
     * @param {number} maxRetries - Maximum number of retry attempts
     * @param {number} delay - Delay between retries in milliseconds
     */
    async withRetry(operation, maxRetries = 3, delay = 1000) {
        let lastError;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error;
                console.error(`[BaseRepo] Attempt ${attempt}/${maxRetries} failed:`, error.message);
                
                // Don't retry on authentication or permission errors
                if (error.code === 'PGRST301' || error.code === '42501') {
                    throw error;
                }
                
                if (attempt < maxRetries) {
                    console.log(`[BaseRepo] Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2; // Exponential backoff
                }
            }
        }
        throw lastError;
    }
}

module.exports = BaseRepo