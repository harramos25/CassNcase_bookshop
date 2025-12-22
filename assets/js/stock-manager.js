const StockManager = {
    // STORAGE KEY
    STORAGE_KEY: 'cassncase_stock',
    // API ENDPOINTS
    API_GET: 'assets/data/stock.json',
    API_SAVE: 'api/save_stock.php',

    // Fetch current stock
    async fetchStock() {
        // 1. Try Server (Live Data)
        try {
            const response = await fetch(this.API_GET + '?t=' + Date.now()); // Prevent caching
            if (response.ok) {
                const data = await response.json();
                // Cache to local storage
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
                return data;
            }
        } catch (error) {
            console.warn("Server stock fetch failed, falling back to local storage.", error);
        }

        // 2. Fallback: Browser Memory
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error("Stock Parse Error", e);
            }
        }

        // 3. Fallback: Defaults (from data.js)
        if (typeof PRODUCTS !== 'undefined') {
            const defaults = {};
            PRODUCTS.forEach(p => defaults[p.id] = p.stock);
            return defaults;
        }

        return null;
    },

    // Save new stock
    // Save new stock (NO-DB MODE: Live Browser Storage)
    async saveStock(stockData) {
        try {
            // 1. Save to Local Browser Storage (Immediate Update)
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stockData));

            // 2. Dispatch event to update other open tabs immediately
            window.dispatchEvent(new StorageEvent('storage', {
                key: this.STORAGE_KEY,
                newValue: JSON.stringify(stockData)
            }));

            // 3. Simulate "Magic" Delay for UX
            await new Promise(r => setTimeout(r, 600));

            return { success: true, message: 'Vault updated locally!' };
        } catch (error) {
            console.error("Vault save error:", error);
            return { success: false, message: 'Memory Spell failed.' };
        }
    },

    // Integrate with global PRODUCTS array
    async syncProducts() {
        if (typeof PRODUCTS === 'undefined') return;

        const liveStock = await this.fetchStock();
        if (liveStock) {
            PRODUCTS.forEach(p => {
                if (liveStock[p.id] !== undefined) {
                    p.stock = liveStock[p.id];
                }
            });
            // console.log("Stock synced:", liveStock);
        }
    }
};
