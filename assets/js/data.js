// CassNcase Book Shop - Data & Configuration

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
        id: "moonlight-lilac-pb",
        title: "The Moonlight Lilac (Paperback Set)",
        format: "Paperback",
        includes: "Volume 1 & 2",
        price: 1500,
        stock: 199, // MANAGED MANUALLY HERE
        images: ["paperback2.png", "paperback1.png"],
        isPreOrder: true,
        batch: "Batch 1",
        description: {
            size: "8.5\" x 5.5\"",
            cover: "Matte laminated cover",
            pages: "4 full color illustrated pages",
            freebies: [
                "3 photocards",
                "1 special bookmark",
                "1 special secret freebie"
            ]
        }
    },
    {
        id: "moonlight-lilac-hb",
        title: "The Moonlight Lilac (Hardbound Set)",
        format: "Hardbound",
        includes: "Volume 1 & 2",
        price: 2800,
        stock: 50, // MANAGED MANUALLY HERE
        images: ["hardbound2.png", "hardbound1.png"],
        isPreOrder: true,
        batch: "Batch 1",
        description: {
            size: "9\" x 6\"",
            cover: "Hardcover",
            pages: "4 color pages inside the book",
            freebies: [
                "3 photocards",
                "1 special bookmark",
                "1 special freebie from Cythera",
                "1 secret freebie"
            ]
        }
    },
    {
        id: "her-stories-pdf",
        title: "Her Stories Behind the Curtains (PDF Copy)",
        format: "PDF / E-Book",
        includes: "Digital Copy",
        price: 250,
        stock: 999, // Digital = Always "In Stock"
        images: ["btc1.png", "btc2.png"], // Index 0: Details, Index 1: Shop (Will verify logic)
        isPreOrder: false,
        isDigital: true,
        batch: "Digital",
        description: {
            size: "Digital Download (PDF)",
            cover: "Exclusive E-Book Cover",
            pages: "Full Story Content",
            freebies: [
                "Digital Signature",
                "Mobile Wallpaper"
            ]
        }
    }
];
