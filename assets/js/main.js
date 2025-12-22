// CassNcase Book Shop - Main Script

document.addEventListener('DOMContentLoaded', () => {
    console.log('CassNcase Book Shop Loaded 🌙');

    // Header Scroll Effect (Magical Glass)
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- LIVE STOCK SYNC ---
    // Wait for StockManager to load (Relies on stock-manager.js being included in HTML)
    if (typeof StockManager !== 'undefined') {
        StockManager.syncProducts().then(() => {
            document.dispatchEvent(new Event('stock-updated'));
        });
    }

    // Listen for changes (from other tabs/windows)
    window.addEventListener('storage', (e) => {
        if (e.key === 'cassncase_stock' && typeof StockManager !== 'undefined') {
            StockManager.syncProducts().then(() => {
                document.dispatchEvent(new Event('stock-updated'));
            });
        }
    });


});

// Utility: Format Currency
function formatCurrency(amount) {
    return '₱' + amount.toLocaleString();
}

// Utility: Get Product by ID (relies on data.js being loaded)
function getProduct(id) {
    if (typeof PRODUCTS !== 'undefined') {
        return PRODUCTS.find(p => p.id === id);
    }
    return null;
}



// Mobile Menu Toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('active');

        // Optional block scroll when open
        if (menu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}
