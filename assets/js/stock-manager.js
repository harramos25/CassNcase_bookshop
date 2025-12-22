const StockManager = {
    // STORAGE KEY (Cache only)
    STORAGE_KEY: 'cassncase_stock_cache',

    // Fetch current stock from Google Sheet
    async fetchStock() {
        try {
            // 1. Fetch from Google Cloud (The Brain)
            const response = await fetch(CONFIG.stockApiURL);
            if (response.ok) {
                const data = await response.json();

                // Cache it locally just in case
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
                return data;
            }
        } catch (error) {
            console.warn("Cloud fetch failed, using cache.", error);
        }

        // 2. Fallback: Browser Cache
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) return JSON.parse(stored);

        // 3. Fallback: Defaults
        if (typeof PRODUCTS !== 'undefined') {
            const defaults = {};
            PRODUCTS.forEach(p => defaults[p.id] = 999); // Assume available
            return defaults;
        }
        return null;
    },

    // Save Status (Enable/Disable) -> Sends to Google Sheet
    async saveStock(id, status) {
        // status: 1 = Available, 0 = Unavailable
        try {
            // Prepare Data
            const payload = JSON.stringify({ id: id, status: status });

            // Send to Google Sheet (using 'no-cors' needed for simple opaque request OR cors if script handles it)
            // Note: Google Apps Script Web App returns redirects which fetch handles awkwardly by default.
            // We use simple POST.

            const response = await fetch(CONFIG.stockApiURL, {
                method: "POST",
                body: payload
            });

            // In 'no-cors' mode (common for GAS), we can't read response, but we assume success if no network error.
            // If script handles CORS properly (which we set up), we can read it.
            const result = await response.json();

            if (result.result === "success") {
                return { success: true, message: 'Updated Cloud successfully!' };
            } else {
                throw new Error("Script returned error");
            }

        } catch (error) {
            console.error("Cloud save error:", error);
            // Even if it fails, maybe we update local cache?
            // Ideally we tell user it failed.
            return { success: false, message: 'Connection to Cloud failed.' };
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
            console.log("Cloud Status Synced:", liveStock);
        }
    }
};
