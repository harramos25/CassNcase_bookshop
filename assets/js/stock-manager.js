const StockManager = {
    // STORAGE KEY (Cache only)
    STORAGE_KEY: 'cassncase_stock_cache',

    // Fetch current stock from Google Sheet
    async fetchStock() {
        // 1. Fetch from Google Cloud (The Brain)
        // Add timestamp to prevent caching.
        // Add redirect: 'follow' to ensure we follow Google's 302 redirects properly.
        const response = await fetch(CONFIG.stockApiURL + '?t=' + Date.now(), {
            method: "GET",
            redirect: "follow"
        });
        if (response.ok) {
            const data = await response.json();

            // Cache it locally just in case
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            return data;
        }
    } catch(error) {
        console.warn("Cloud fetch failed, using cache.", error);
    }

        // 2. Fallback: Browser Cache
        const stored = localStorage.getItem(this.STORAGE_KEY);
    if(stored) return JSON.parse(stored);

    // 3. Fallback: Defaults
    if(typeof PRODUCTS !== 'undefined') {
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

        // USE GET REQUEST for reliability
        // This avoids POST body parsing issues completely.
        const url = `${CONFIG.stockApiURL}?action=update&id=${id}&status=${status}`;

        // Fire and Forget (no-cors mode is fine for GET updates too)
        await fetch(url, {
            method: "GET",
            mode: "no-cors"
        });

        // Return success immediately
        return { success: true, message: 'Updated Cloud successfully!' };

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
