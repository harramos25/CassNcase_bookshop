// Bookshop System - Data & Configuration

const CONFIG = {
    // GOOGLE FORM CONNECTION
    // basic structure: https://docs.google.com/forms/d/e/[FORM_ID]/formResponse
    formActionURL: "https://docs.google.com/forms/d/e/1FAIpQLSfnSFhgOUDVSl-rJHd5xkVs8ZJmCX8MzQGtEQeJxkPejMD0vA/formResponse",

    // ENTRY IDs (From User provided link)
    entryIDs: {
        fullname: "entry.1727087221",
        email: "entry.118277763",
        contact: "entry.1680300785",
        address: "entry.239638494",
        shippingRegion: "entry.1341583804", // Region selection
        paymentMethod: "entry.169308304", // Maya / GCash / Bank
        orderType: "entry.19354815", // Paperback / Hardbound
        orderQty: "entry.1487024208", // Quantity
        refNumber: "entry.1163003862"
    },

    // SHIPPING RATES
    shippingRates: {
        luzon: 50,
        visayas: 70,
        mindanao: 90
    },

    // CUSTOM BACKEND API (Google Sheets)
    stockApiURL: "https://script.google.com/macros/s/AKfycbzGgCWMXAZ2XAuirQ0_YxFqGY4oY0miZm2x2iMvcrwC0021Do7tuq6esc5nVZiluMMYFA/exec"
};

const PRODUCTS = [
    {
        id: "aetherium-chronicles-hc",
        title: "The Aetherium Chronicles",
        format: "Hardcover",
        includes: "Volume 1",
        price: 2200,
        stock: 199,
        images: ["1.png", "1.1.png"],
        isPreOrder: true,
        batch: "Batch 1",
        description: { // Keeping for backward compat if needed, but we rely on specs now
            freebies_title: "Included Starbound Freebies 🎁",
            freebies_intro: "Every Collector’s Edition includes:"
        },
        specs: [
            { label: "Trim Size", value: "9\" × 6\"" },
            { label: "Cover Type", value: "Premium Hardcover" },
            { label: "Interior", value: "Includes 4 full-color illustrated starplates" }
        ],
        freebies: [
            "3 collectible Aetherium character cards",
            "1 exclusive Starlight bookmark",
            "1 limited artifact freebie from the Aetherium vault",
            "1 sealed secret starbound surprise ✨"
        ]
    },
    {
        id: "shadowed-starlight-hc",
        title: "The Shadowed Starlight",
        format: "Hardcover",
        includes: "Volume 1",
        price: 2200,
        stock: 50,
        images: ["3.png", "3.1.png"],
        isPreOrder: true,
        batch: "Batch 1",
        description: {
            freebies_title: "Included Starbound Freebies 🎁",
            freebies_intro: "Every Collector’s Edition includes:"
        },
        specs: [
            { label: "Trim Size", value: "9\" × 6\"" },
            { label: "Cover Type", value: "Premium Hardcover" },
            { label: "Interior", value: "Includes 4 full-color illustrated starplates" }
        ],
        freebies: [
            "3 collectible Aetherium character cards",
            "1 exclusive Starlight bookmark",
            "1 limited artifact freebie from the Aetherium vault",
            "1 sealed secret starbound surprise ✨"
        ]
    },
    {
        id: "celestial-key-pdf",
        title: "The Celestial Key (PDF Copy)",
        format: "PDF / E-Book",
        includes: "Digital Copy",
        price: 250,
        stock: 999,
        images: ["2.png", "2.1.png"],
        isPreOrder: false,
        isDigital: true,
        batch: "Digital",
        specs: [
            { label: "Format", value: "PDF (High-resolution)" },
            { label: "Content", value: "<br>• Exclusive behind-the-scenes stories<br>• Secret lore entries<br>• Personal letters and unseen moments from Nyra Caelum’s point of view" }
        ],
        freebies: [] // No physical freebies
    }
];
