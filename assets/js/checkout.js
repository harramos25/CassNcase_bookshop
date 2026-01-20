// Checkout Logic

// Global reference for product
let currentProduct = null;

document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');
    const qty = parseInt(params.get('qty')) || 1; // Default to 1
    currentProduct = getProduct(productId);

    if (!currentProduct) {
        // Only redirect if we are sure product is missing
        alert("No product selected! Redirecting to shop...");
        window.location.href = 'shop.html';
        return;
    }

    // Render Order Summary
    document.getElementById('product-name').innerText = currentProduct.title;
    document.getElementById('product-qty').innerText = `Qty: ${qty}`;
    document.getElementById('product-price').innerText = formatCurrency(currentProduct.price * qty);

    // Set Thumbnail
    const thumb = document.getElementById('summary-thumb');
    if (thumb && currentProduct) {
        // PRIORITIZE: Explicit images from data.js
        if (currentProduct.images && currentProduct.images.length > 0) {
            // Use index 0 (Details image) for checkout summary
            thumb.src = `assets/images/${currentProduct.images[0]}`;
        } else if (currentProduct.format) {
            // Fallback to legacy format key logic
            const formatKey = currentProduct.format.toLowerCase().includes('hardbound') ? 'hardbound' : 'paperback';
            thumb.src = `assets/images/${formatKey}.png`;
        }
    }

    // Hidden inputs for form submission
    updateHiddenInput('orderType', currentProduct.format); // "Paperback" or "Hardbound"
    updateHiddenInput('orderQty', qty);

    // Region Change Listener
    const regionSelect = document.getElementById('region');
    regionSelect.addEventListener('change', () => {
        calculateTotal(currentProduct.price, qty);
    });

    // Initial Calculation
    calculateTotal(currentProduct.price, qty);

    // --- DIGITAL PRODUCT LOGIC ---
    if (currentProduct.isDigital) {
        // Hide Shipping Fields
        const fieldsToHide = ['inp-fullname', 'inp-contact', 'region', 'inp-address'];

        fieldsToHide.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                // Hide Parent .form-group
                const group = input.closest('.form-group');
                if (group) group.style.display = 'none';

                // Remove Required & Auto-fill to pass validation
                input.required = false;

                // Set dummy values based on type
                if (id === 'region') input.value = 'luzon'; // Dummy region
                else if (id === 'inp-contact') input.value = '00000000000';
                else if (id === 'inp-fullname') input.value = 'Digital Customer';
                else input.value = 'N/A (Digital Item)';
            }
        });

        // Hide Section Title "Shipping Information" -> maybe change to "Customer Information"
        const shipHeader = document.querySelector('.section-subtitle');
        if (shipHeader) shipHeader.innerText = "1. Customer Information";
    }

    // Reference Number Validation
    const refInput = document.getElementById('inp-ref');
    const submitBtn = document.getElementById('submit-btn');

    // Initial state: disabled until ref is entered
    submitBtn.disabled = true;

    if (refInput) {
        // Run once on load
        submitBtn.disabled = refInput.value.trim() === '';

        refInput.addEventListener('input', () => {
            submitBtn.disabled = refInput.value.trim() === '';
        });
    }

    // Form Submission INTERCEPTION
    const form = document.getElementById('checkout-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Final validation: check if payment is selected
        const maya = document.getElementById('pay-maya').checked;
        const rcbc = document.getElementById('pay-rcbc').checked;
        const bank = document.getElementById('pay-bank').checked;

        if (!maya && !rcbc && !bank) {
            alert("Please select a payment method first!");
            return;
        }

        // Show Custom Modal instead of confirm()
        document.getElementById('confirm-modal').classList.add('active');
    });
});

function calculateTotal(productPrice, qty) {
    const region = document.getElementById('region').value;
    let shipping = 0;

    // Check for Digital Product
    if (currentProduct && currentProduct.isDigital) {
        shipping = 0;
    } else if (CONFIG.shippingRates[region]) {
        shipping = CONFIG.shippingRates[region];
    }

    const subtotal = productPrice * qty;
    const total = subtotal + shipping;

    // Update UI
    document.getElementById('subtotal-amount').innerText = formatCurrency(subtotal);

    const shippingEl = document.getElementById('shipping-fee');

    if (currentProduct && currentProduct.isDigital) {
        shippingEl.innerText = 'Via Email';
        shippingEl.style.color = 'var(--sage-soft)';
    } else if (shipping === 0) {
        shippingEl.innerText = 'FREE'; // Or "Select Region" if implied
        shippingEl.style.color = '#5D4D3B';
    } else {
        shippingEl.innerText = formatCurrency(shipping);
        shippingEl.style.color = '#3D3126';
    }

    document.getElementById('total-amount').innerText = formatCurrency(total);
}

function updateHiddenInput(key, value) {
    // Finds the input mapped to the entryID in CONFIG
    const entryId = CONFIG.entryIDs[key];
    if (entryId) {
        // We look for input with name="entry.XXXX"
        const input = document.querySelector(`input[name="${entryId}"]`);
        if (input) input.value = value;
    }
}

// --- INTERACTIVE UI FUNCTIONS ---

function selectPayment(method) {
    // 1. Update UI Cards
    document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('active'));
    document.getElementById(`card-${method}`).classList.add('active');

    // 2. Update Hidden Radios
    const radios = ['pay-maya', 'pay-rcbc', 'pay-bank'];
    radios.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.checked = (el.value === method || (method === 'Maya' && el.value === 'Maya') || (method === 'RCBC' && el.value === 'RCBC') || (method === 'Bank' && el.value === 'Bank Transfer'));
    });

    // 3. Update Reveal Logic
    const revealBox = document.getElementById('payment-reveal');
    revealBox.classList.add('active');

    // Hide all items first
    document.querySelectorAll('.qr-item').forEach(item => item.classList.add('hidden'));

    // Show selected
    if (method === 'Maya') {
        document.getElementById('qr-maya').classList.remove('hidden');
    } else if (method === 'RCBC') {
        document.getElementById('qr-rcbc').classList.remove('hidden');
    } else {
        document.getElementById('transfer-details').classList.remove('hidden');
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.querySelector('.copy-btn');
        const originalText = btn.innerText;
        btn.innerText = 'COPIED!';
        btn.classList.add('copied');

        setTimeout(() => {
            btn.innerText = originalText;
            btn.classList.remove('copied');
        }, 2000);
    });
}

function toggleRefGuide() {
    const guide = document.getElementById('ref-guide');
    guide.classList.toggle('hidden');
}

// --- MODAL FUNCTIONS ---

function closeConfirmModal() {
    document.getElementById('confirm-modal').classList.remove('active');
}

function confirmSubmit() {
    // User clicked "Yes" in the modal
    closeConfirmModal();
    submitOrder(currentProduct);
}


function submitOrder(product) {
    const form = document.getElementById('checkout-form');
    const submitBtn = document.getElementById('submit-btn');

    // Set Action URL from Config
    if (CONFIG.formActionURL) {
        form.action = CONFIG.formActionURL;
    } else {
        alert("System Error: Google Form URL missing!");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "Processing... ⏳";

    // METHOD: Hidden Iframe Submission
    form.target = "hidden_iframe";

    // Listen for the iframe load event (which means Google replied)
    const iframe = document.getElementById('hidden_iframe');
    let submitted = false;

    // Fallback: If iframe load event is blocked or slow, redirect anyway after 2s
    const fallbackTimer = setTimeout(() => {
        if (!submitted) {
            window.location.href = 'success.html';
        }
    }, 2000);

    iframe.onload = function () {
        submitted = true;
        clearTimeout(fallbackTimer);
        window.location.href = 'success.html';
    };

    // Submit
    form.submit();
}
