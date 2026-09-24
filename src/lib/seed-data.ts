import { pexels } from "./utils";

export type SeedCategory = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  sortOrder: number;
};

export type SeedProduct = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  compareAt?: number;
  images: number[];
  rating: number;
  reviews: number;
  stock: number;
  featured?: boolean;
  isNew?: boolean;
  short: string;
  description: string;
  features: string[];
  specs: [string, string][];
};

export const SEED_CATEGORIES: SeedCategory[] = [
  { slug: "electronics", name: "Electronics", tagline: "Smart tech for every day", description: "Headphones, wearables and smart gadgets built to keep up with you.", image: pexels(18311088), sortOrder: 1 },
  { slug: "fashion", name: "Fashion", tagline: "Timeless everyday style", description: "Wardrobe essentials and modern staples crafted from quality fabrics.", image: pexels(32549952), sortOrder: 2 },
  { slug: "home-living", name: "Home & Living", tagline: "Spaces that feel like you", description: "Considered décor and lighting that make every room calm and complete.", image: pexels(14781780), sortOrder: 3 },
  { slug: "kitchen", name: "Kitchen & Dining", tagline: "Better mornings start here", description: "Coffee gear, knives and serveware for people who love to cook and host.", image: pexels(5556176), sortOrder: 4 },
  { slug: "beauty", name: "Beauty & Care", tagline: "Clean, effective self-care", description: "Skincare and wellness essentials with thoughtfully chosen ingredients.", image: pexels(7020055), sortOrder: 5 },
  { slug: "accessories", name: "Accessories", tagline: "The finishing touches", description: "Watches, leather goods and eyewear that complete every look.", image: pexels(38797596), sortOrder: 6 },
  { slug: "fitness", name: "Sports & Fitness", tagline: "Train at home or away", description: "Reliable gear for strength, mobility and running — at every level.", image: pexels(8436449), sortOrder: 7 },
  { slug: "lifestyle", name: "Lifestyle", tagline: "Little things, done well", description: "Desk, reading and gifting essentials that make daily routines better.", image: pexels(34299339), sortOrder: 8 },
];

export const SEED_PRODUCTS: SeedProduct[] = [
  // Electronics
  {
    slug: "aurora-wireless-headphones", name: "Aurora Wireless Headphones", brand: "Aurel Audio", category: "electronics",
    price: 149, compareAt: 189, images: [3394650, 3394653], rating: 4.8, reviews: 1284, stock: 42, featured: true,
    short: "Over-ear wireless headphones with adaptive noise cancelling and 40-hour battery life.",
    description: "Aurora pairs rich, balanced sound with adaptive noise cancelling that adjusts to your surroundings in real time. Plush memory-foam cushions and a lightweight frame make it easy to wear from the morning commute to late-night listening.",
    features: ["Adaptive active noise cancelling with transparency mode", "Up to 40 hours of playback — 10-minute quick charge for 5 hours", "Multipoint Bluetooth 5.3 to switch between two devices", "Foldable design with protective travel case"],
    specs: [["Connectivity", "Bluetooth 5.3, multipoint"], ["Battery life", "Up to 40 hours"], ["Weight", "250 g"], ["Warranty", "2 years"]],
  },
  {
    slug: "pulse-pro-anc-headphones", name: "Pulse Pro ANC Headphones", brand: "Aurel Audio", category: "electronics",
    price: 199, images: [15840650], rating: 4.7, reviews: 842, stock: 18, isNew: true,
    short: "Studio-grade sound, hybrid noise cancelling and all-day comfort in a matte finish.",
    description: "Pulse Pro is tuned for detail: custom 40 mm drivers deliver deep bass and crisp highs, while hybrid noise cancelling quiets planes, trains and busy offices. Six microphones keep your calls clear, even outdoors.",
    features: ["Hybrid active noise cancelling", "Six-microphone array for clear calls", "Hi-Res Audio certified with LDAC support", "Touch controls and in-ear detection"],
    specs: [["Driver", "40 mm dynamic"], ["Battery life", "Up to 32 hours"], ["Charging", "USB-C fast charge"], ["Warranty", "2 years"]],
  },
  {
    slug: "vertex-smartwatch-s5", name: "Vertex Smartwatch S5", brand: "Vektor", category: "electronics",
    price: 229, compareAt: 259, images: [12564670], rating: 4.6, reviews: 967, stock: 25, featured: true,
    short: "Always-on display, health tracking and 7-day battery in a refined aluminium case.",
    description: "Vertex S5 keeps you connected and in control of your health, with continuous heart-rate, sleep and SpO2 tracking plus built-in GPS. A bright always-on display and 7-day battery mean less charging and more living.",
    features: ["1.9\" always-on AMOLED display", "Heart-rate, SpO2 and sleep tracking", "Built-in GPS with 100+ workout modes", "Water resistant to 50 m"],
    specs: [["Display", "1.9\" AMOLED"], ["Battery life", "Up to 7 days"], ["Water resistance", "5 ATM"], ["Compatibility", "iOS & Android"]],
  },
  {
    slug: "stride-sport-smartwatch", name: "Stride Sport Smartwatch", brand: "Vektor", category: "electronics",
    price: 129, images: [31541678], rating: 4.5, reviews: 512, stock: 4, isNew: true,
    short: "Lightweight fitness watch with GPS, heart-rate tracking and a soft sport band.",
    description: "Built for training, Stride tracks your runs, rides and swims with accurate GPS and heart-rate monitoring. Its lightweight case and breathable silicone band stay comfortable through every workout.",
    features: ["Accurate multi-band GPS", "24/7 heart-rate and stress monitoring", "Up to 12 days of battery life", "Breathable quick-release sport band"],
    specs: [["Display", "1.4\" color touchscreen"], ["Battery life", "Up to 12 days"], ["Weight", "32 g"], ["Water resistance", "5 ATM"]],
  },
  {
    slug: "aurora-buds-pro", name: "Aurora Buds Pro", brand: "Aurel Audio", category: "electronics",
    price: 119, compareAt: 139, images: [4526407], rating: 4.6, reviews: 1032, stock: 60, featured: true,
    short: "True wireless earbuds with noise cancelling and a pocket-size charging case.",
    description: "Aurora Buds Pro deliver immersive sound in a compact, ergonomic fit. Active noise cancelling blocks distractions, and the wireless charging case gives you up to 30 hours of total listening.",
    features: ["Active noise cancelling with ambient mode", "Up to 30 hours with the charging case", "IPX4 sweat and splash resistance", "Wireless and USB-C charging"],
    specs: [["Connectivity", "Bluetooth 5.3"], ["Battery life", "8 h (30 h with case)"], ["Water resistance", "IPX4"], ["Warranty", "1 year"]],
  },
  {
    slug: "slim-wireless-keyboard", name: "Slim Wireless Keyboard", brand: "Vektor", category: "electronics",
    price: 79, images: [12880803], rating: 4.4, reviews: 388, stock: 33,
    short: "Low-profile rechargeable keyboard that pairs with up to three devices.",
    description: "A quiet, low-profile keyboard designed for focused work. Switch instantly between laptop, tablet and phone, and enjoy up to three months of use on a single charge.",
    features: ["Quiet low-profile scissor keys", "Pairs with up to 3 devices", "Up to 3 months per charge", "Works with macOS, Windows, iPadOS and Android"],
    specs: [["Connectivity", "Bluetooth & 2.4 GHz"], ["Battery", "Rechargeable, USB-C"], ["Layout", "Full-size US"], ["Weight", "420 g"]],
  },
  // Fashion
  {
    slug: "heritage-denim-jacket", name: "Heritage Denim Jacket", brand: "Atelier Nine", category: "fashion",
    price: 98, compareAt: 128, images: [16428734], rating: 4.7, reviews: 403, stock: 22, featured: true,
    short: "A classic trucker jacket in organic cotton denim that ages beautifully.",
    description: "Cut from 13 oz organic cotton denim, the Heritage jacket has a relaxed, modern fit and all the details you expect: chest pockets, button cuffs and a clean wash that softens with every wear.",
    features: ["100% organic cotton, 13 oz denim", "Relaxed modern fit", "Metal shank buttons and chest flap pockets", "Machine washable"],
    specs: [["Material", "100% organic cotton"], ["Fit", "Relaxed"], ["Care", "Machine wash cold"], ["Made in", "Portugal"]],
  },
  {
    slug: "tailored-linen-blazer", name: "Tailored Linen Blazer", brand: "Atelier Nine", category: "fashion",
    price: 159, images: [9218536], rating: 4.8, reviews: 219, stock: 12, featured: true, isNew: true,
    short: "An unstructured linen-blend blazer that works from office to weekend.",
    description: "Light, breathable and effortlessly polished, this blazer is cut from a linen-cotton blend with a soft, unstructured shoulder. Wear it over a tee on weekends or with tailored trousers for the office.",
    features: ["Breathable linen-cotton blend", "Unstructured shoulder for a natural drape", "Two-button closure and patch pockets", "Half-lined for warm-weather comfort"],
    specs: [["Material", "55% linen, 45% cotton"], ["Fit", "Regular"], ["Care", "Dry clean recommended"], ["Color", "Sand"]],
  },
  {
    slug: "essential-crew-sweatshirt", name: "Essential Crew Sweatshirt", brand: "Rafik Essentials", category: "fashion",
    price: 54, images: [9594147], rating: 4.6, reviews: 671, stock: 80,
    short: "Heavyweight brushed-cotton sweatshirt with a clean, relaxed silhouette.",
    description: "Our best-selling essential, made from heavyweight brushed-back cotton fleece that's soft inside and holds its shape wash after wash. Ribbed cuffs and hem keep the fit clean.",
    features: ["380 gsm brushed-back cotton fleece", "Pre-shrunk to keep its shape", "Ribbed collar, cuffs and hem", "Unisex relaxed fit"],
    specs: [["Material", "100% cotton"], ["Weight", "380 gsm"], ["Fit", "Relaxed unisex"], ["Care", "Machine wash 30°C"]],
  },
  {
    slug: "classic-pique-polo", name: "Classic Piqué Polo", brand: "Rafik Essentials", category: "fashion",
    price: 39, compareAt: 49, images: [12246169], rating: 4.5, reviews: 544, stock: 95,
    short: "A breathable cotton piqué polo with a crisp collar and modern fit.",
    description: "A wardrobe staple, updated. Breathable cotton piqué, a structured collar that stays crisp and a modern fit that's neither boxy nor tight make it perfect for work and weekends.",
    features: ["Breathable cotton piqué knit", "Structured collar that holds its shape", "Tonal two-button placket", "Available in multiple colors"],
    specs: [["Material", "100% cotton piqué"], ["Fit", "Modern"], ["Care", "Machine wash 30°C"], ["Color", "Crimson"]],
  },
  {
    slug: "striped-oxford-shirt", name: "Striped Oxford Shirt", brand: "Atelier Nine", category: "fashion",
    price: 64, images: [11485035], rating: 4.4, reviews: 190, stock: 40, isNew: true,
    short: "Soft brushed Oxford cotton in a timeless stripe, cut for everyday wear.",
    description: "Woven from soft, brushed Oxford cotton, this shirt balances smart and casual. A button-down collar, curved hem and timeless stripe make it one of the most versatile pieces you'll own.",
    features: ["Brushed Oxford cotton", "Button-down collar", "Curved hem — wear tucked or untucked", "Garment-washed for softness"],
    specs: [["Material", "100% cotton"], ["Fit", "Regular"], ["Care", "Machine wash 40°C"], ["Pattern", "Stripe"]],
  },
  {
    slug: "urban-chunky-sneakers", name: "Urban Chunky Sneakers", brand: "Norde", category: "fashion",
    price: 119, images: [27256441], rating: 4.6, reviews: 338, stock: 0,
    short: "Cushioned sneakers with a sculpted sole and premium leather upper.",
    description: "The Urban sneaker combines a premium leather upper with a sculpted, lightweight sole for all-day cushioning. A padded collar and breathable lining keep you comfortable from morning to night.",
    features: ["Premium leather and suede upper", "Lightweight cushioned EVA sole", "Padded collar and breathable lining", "Removable cushioned insole"],
    specs: [["Upper", "Leather & suede"], ["Sole", "EVA & rubber"], ["Fit", "True to size"], ["Color", "Black / White"]],
  },
  // Home & Living
  {
    slug: "oak-arc-desk-lamp", name: "Oak Arc Desk Lamp", brand: "Lumen & Co", category: "home-living",
    price: 89, compareAt: 109, images: [38986380, 38986382], rating: 4.8, reviews: 276, stock: 20, featured: true,
    short: "Solid oak desk lamp with a warm, dimmable LED and minimalist silhouette.",
    description: "Crafted from solid oak with a softly curved arm, this lamp brings warmth to any desk or bedside table. The integrated LED dims across three levels, and its warm tone is easy on the eyes.",
    features: ["Solid oak with natural oil finish", "Dimmable warm LED (2700K)", "Touch-sensitive three-level control", "Energy-efficient 50,000-hour LED"],
    specs: [["Material", "Solid oak, steel"], ["Light", "8 W LED, 2700K"], ["Height", "42 cm"], ["Warranty", "2 years"]],
  },
  {
    slug: "terra-ceramic-vase", name: "Terra Ceramic Vase", brand: "Maison Terra", category: "home-living",
    price: 46, images: [29904622], rating: 4.7, reviews: 158, stock: 35, isNew: true,
    short: "Hand-finished stoneware vase with a soft matte glaze and sculptural form.",
    description: "Each Terra vase is thrown and glazed by hand, so no two are exactly alike. Its sculptural silhouette and warm matte finish look beautiful styled alone or with dried stems.",
    features: ["Hand-thrown stoneware", "Soft matte reactive glaze", "Watertight for fresh flowers", "Each piece is unique"],
    specs: [["Material", "Stoneware"], ["Height", "24 cm"], ["Finish", "Matte glaze"], ["Care", "Hand wash"]],
  },
  {
    slug: "clarity-glass-bud-vase", name: "Clarity Glass Bud Vase", brand: "Maison Terra", category: "home-living",
    price: 29, images: [8128872], rating: 4.5, reviews: 212, stock: 50,
    short: "Mouth-blown clear glass vase for single stems and dried arrangements.",
    description: "Mouth-blown from clear, lead-free glass with a weighted base, Clarity lets your stems take center stage. Perfect for single blooms, eucalyptus or dried grasses.",
    features: ["Mouth-blown lead-free glass", "Weighted base for stability", "Minimal, timeless shape", "Dishwasher safe"],
    specs: [["Material", "Borosilicate glass"], ["Height", "20 cm"], ["Opening", "5 cm"], ["Care", "Dishwasher safe"]],
  },
  {
    slug: "dried-pampas-bouquet", name: "Dried Pampas Bouquet", brand: "Maison Terra", category: "home-living",
    price: 34, images: [38908537], rating: 4.6, reviews: 97, stock: 28,
    short: "A natural, long-lasting bouquet of dried pampas and grasses.",
    description: "Naturally dried and lightly preserved, this bouquet brings soft texture to your space for months — no watering required. It arrives ready to style in your favorite vase.",
    features: ["Naturally dried and preserved", "Lasts 1–3 years with care", "No water or maintenance needed", "Hand-arranged in our studio"],
    specs: [["Stems", "12–15"], ["Length", "60–70 cm"], ["Colors", "Natural tones"], ["Care", "Keep dry, away from direct sun"]],
  },
  {
    slug: "nordic-stoneware-vase-trio", name: "Nordic Stoneware Vase Trio", brand: "Maison Terra", category: "home-living",
    price: 72, compareAt: 88, images: [39340297], rating: 4.7, reviews: 131, stock: 14,
    short: "A set of three stoneware vases in complementary heights and neutral tones.",
    description: "Designed to be styled together, this trio pairs three heights with gentle neutral tones. Group them on a shelf, sideboard or dining table for effortless Scandinavian calm.",
    features: ["Set of three coordinating vases", "Durable glazed stoneware", "Neutral tones for any interior", "Gift-ready packaging"],
    specs: [["Material", "Stoneware"], ["Heights", "12, 18 & 24 cm"], ["Finish", "Satin glaze"], ["Care", "Hand wash"]],
  },
  // Kitchen & Dining
  {
    slug: "pour-over-coffee-kit", name: "Pour-Over Coffee Kit", brand: "Brewline", category: "kitchen",
    price: 84, compareAt: 99, images: [35240184], rating: 4.8, reviews: 512, stock: 30, featured: true,
    short: "Gooseneck kettle, glass dripper and hand grinder for café-quality coffee.",
    description: "Everything you need to brew exceptional coffee at home. The gooseneck kettle gives total control over your pour, the ceramic burr grinder delivers a consistent grind, and the glass dripper brings out every note.",
    features: ["Stainless steel gooseneck kettle (1 L)", "Adjustable ceramic burr hand grinder", "Heat-resistant glass dripper and server", "Includes 100 paper filters"],
    specs: [["Kettle capacity", "1 L"], ["Server capacity", "600 ml"], ["Material", "Stainless steel & glass"], ["Warranty", "1 year"]],
  },
  {
    slug: "barista-one-espresso-machine", name: "Barista One Espresso Machine", brand: "Brewline", category: "kitchen",
    price: 449, compareAt: 529, images: [36573009], rating: 4.7, reviews: 304, stock: 9, featured: true,
    short: "15-bar espresso machine with steam wand and precise temperature control.",
    description: "Pull rich, balanced shots at home with 15 bars of pressure and PID temperature control. The commercial-style steam wand textures silky milk for lattes and flat whites in seconds.",
    features: ["15-bar Italian pump", "PID digital temperature control", "Commercial-style steam wand", "Removable 2 L water tank"],
    specs: [["Pressure", "15 bar"], ["Water tank", "2 L"], ["Power", "1,450 W"], ["Warranty", "2 years"]],
  },
  {
    slug: "glass-siphon-brewer", name: "Glass Siphon Brewer", brand: "Brewline", category: "kitchen",
    price: 129, images: [13943377], rating: 4.5, reviews: 88, stock: 3, isNew: true,
    short: "A vacuum brewer that makes exceptionally clean, aromatic coffee.",
    description: "Brewing with a siphon is part science, part ceremony. Vapor pressure and vacuum combine to produce an exceptionally clean, aromatic cup — and a show your guests won't forget.",
    features: ["Heat-resistant borosilicate glass", "Reusable cloth filter", "Includes burner and stand", "Brews up to 5 cups"],
    specs: [["Capacity", "600 ml"], ["Material", "Borosilicate glass"], ["Heat source", "Alcohol burner"], ["Cups", "Up to 5"]],
  },
  {
    slug: "borosilicate-carafe-set", name: "Borosilicate Carafe Set", brand: "Brewline", category: "kitchen",
    price: 42, images: [16645946], rating: 4.6, reviews: 145, stock: 44,
    short: "Glass carafe with two double-wall tumblers for iced or hot drinks.",
    description: "A versatile serving set for coffee, tea or cold brew. The carafe is heat-resistant borosilicate glass, and the double-wall tumblers keep drinks at temperature without condensation.",
    features: ["Heat-resistant borosilicate glass", "Two double-wall tumblers included", "Stainless mesh strainer", "Dishwasher safe"],
    specs: [["Carafe", "800 ml"], ["Tumblers", "2 × 250 ml"], ["Material", "Borosilicate glass"], ["Care", "Dishwasher safe"]],
  },
  {
    slug: "precision-chefs-knife", name: "Precision Chef's Knife 8\"", brand: "Forge & Co", category: "kitchen",
    price: 89, images: [30327171], rating: 4.9, reviews: 422, stock: 26, isNew: true,
    short: "German steel chef's knife, precision-honed for effortless everyday prep.",
    description: "Forged from high-carbon German stainless steel and honed to a 15° edge, this knife glides through vegetables, meat and herbs. The balanced full-tang handle feels secure in any grip.",
    features: ["High-carbon German stainless steel", "Precision-honed 15° edge", "Full-tang, balanced handle", "Includes blade guard"],
    specs: [["Blade length", "20 cm (8\")"], ["Steel", "X50CrMoV15"], ["Hardness", "58 HRC"], ["Care", "Hand wash"]],
  },
  {
    slug: "matte-black-drip-coffee-maker", name: "Matte Black Drip Coffee Maker", brand: "Brewline", category: "kitchen",
    price: 69, images: [37552794], rating: 4.4, reviews: 230, stock: 38,
    short: "Programmable 10-cup coffee maker with keep-warm plate and matte finish.",
    description: "Wake up to fresh coffee with a 24-hour programmable timer. The shower-head design ensures even extraction, and the matte black finish looks sharp on any countertop.",
    features: ["24-hour programmable timer", "Even-extraction shower head", "Keep-warm plate with auto shut-off", "Reusable permanent filter"],
    specs: [["Capacity", "10 cups (1.25 L)"], ["Power", "1,000 W"], ["Finish", "Matte black"], ["Warranty", "1 year"]],
  },
  // Beauty & Care
  {
    slug: "hydrating-serum-toner-duo", name: "Hydrating Serum & Toner Duo", brand: "Solace Skin", category: "beauty",
    price: 48, compareAt: 60, images: [20382236], rating: 4.7, reviews: 689, stock: 70, featured: true,
    short: "A gentle toner and milky serum duo for soft, deeply hydrated skin.",
    description: "Start with the balancing toner to refresh and prep, then follow with the lightweight milk serum to lock in moisture. Free from fragrance and harsh alcohols, it's gentle enough for daily use on all skin types.",
    features: ["Hyaluronic acid and ceramides", "Fragrance-free and alcohol-free", "Suitable for sensitive skin", "Dermatologist tested"],
    specs: [["Toner", "150 ml"], ["Serum", "30 ml"], ["Skin type", "All"], ["Cruelty-free", "Yes"]],
  },
  {
    slug: "botanical-face-oil-trio", name: "Botanical Face Oil Trio", brand: "Solace Skin", category: "beauty",
    price: 56, images: [31251024], rating: 4.6, reviews: 274, stock: 40, isNew: true,
    short: "Three targeted face oils to nourish, brighten and balance your skin.",
    description: "A discovery trio of cold-pressed botanical oils: Nourish with rosehip, Brighten with sea buckthorn and Balance with jojoba. Use alone or layer a few drops under your moisturizer.",
    features: ["Cold-pressed, 100% plant-based oils", "Rosehip, sea buckthorn and jojoba", "Non-comedogenic formulas", "Glass dropper bottles"],
    specs: [["Size", "3 × 15 ml"], ["Skin type", "All"], ["Vegan", "Yes"], ["Cruelty-free", "Yes"]],
  },
  {
    slug: "violet-renewal-night-cream", name: "Violet Renewal Night Cream", brand: "Solace Skin", category: "beauty",
    price: 42, images: [35976902], rating: 4.5, reviews: 318, stock: 55,
    short: "A rich overnight cream with bakuchiol to smooth and renew while you sleep.",
    description: "This velvety night cream pairs bakuchiol — a gentle, plant-based retinol alternative — with shea butter and peptides to visibly smooth fine lines and restore softness overnight.",
    features: ["Bakuchiol: a gentle retinol alternative", "Peptides and shea butter", "Visibly smoother skin in 4 weeks", "Recyclable glass jar"],
    specs: [["Size", "50 ml"], ["Skin type", "Normal to dry"], ["Vegan", "Yes"], ["Cruelty-free", "Yes"]],
  },
  {
    slug: "eco-skincare-essentials-set", name: "Eco Skincare Essentials Set", brand: "Solace Skin", category: "beauty",
    price: 64, compareAt: 79, images: [4841525], rating: 4.8, reviews: 201, stock: 24,
    short: "Cleanser, moisturizer and balm in refillable, low-waste packaging.",
    description: "A complete daily routine in one set: a gentle gel cleanser, a lightweight daily moisturizer and a multi-use balm — all in refillable packaging designed to reduce waste.",
    features: ["Complete 3-step daily routine", "Refillable, low-waste packaging", "95%+ natural-origin ingredients", "Travel-friendly sizes"],
    specs: [["Includes", "Cleanser, moisturizer, balm"], ["Skin type", "All"], ["Vegan", "Yes"], ["Cruelty-free", "Yes"]],
  },
  {
    slug: "collagen-vitamin-c-complex", name: "Collagen + Vitamin C Complex", brand: "Solace Wellness", category: "beauty",
    price: 32, images: [29060334], rating: 4.4, reviews: 156, stock: 90,
    short: "A daily supplement to support skin elasticity, hair and nails.",
    description: "A daily blend of hydrolyzed marine collagen, vitamin C and biotin to support skin elasticity, stronger nails and healthy hair from within. Unflavored and easy to add to your routine.",
    features: ["Hydrolyzed marine collagen peptides", "With vitamin C and biotin", "No artificial colors or sweeteners", "30-day supply"],
    specs: [["Servings", "30"], ["Form", "Capsules"], ["Allergens", "Contains fish"], ["Made in", "EU"]],
  },
  // Accessories
  {
    slug: "meridian-chronograph-watch", name: "Meridian Chronograph Watch", brand: "Heritage Goods", category: "accessories",
    price: 249, compareAt: 299, images: [28977357], rating: 4.8, reviews: 356, stock: 11, featured: true,
    short: "A refined chronograph with sapphire crystal and Italian leather strap.",
    description: "Meridian combines classic chronograph styling with modern precision. Its Japanese quartz movement, scratch-resistant sapphire crystal and supple Italian leather strap make it a watch for every occasion.",
    features: ["Japanese quartz chronograph movement", "Scratch-resistant sapphire crystal", "Genuine Italian leather strap", "Water resistant to 100 m"],
    specs: [["Case", "41 mm stainless steel"], ["Movement", "Japanese quartz"], ["Water resistance", "10 ATM"], ["Warranty", "2 years"]],
  },
  {
    slug: "heritage-leather-bifold-wallet", name: "Heritage Leather Bifold Wallet", brand: "Heritage Goods", category: "accessories",
    price: 59, images: [4452390], rating: 4.7, reviews: 803, stock: 65,
    short: "Slim full-grain leather bifold with RFID protection.",
    description: "Handcrafted from full-grain, vegetable-tanned leather that develops a rich patina over time. A slim profile, six card slots and RFID-blocking lining keep your essentials organized and secure.",
    features: ["Full-grain vegetable-tanned leather", "RFID-blocking lining", "6 card slots and 2 bill compartments", "Slim 1.2 cm profile"],
    specs: [["Material", "Full-grain leather"], ["Dimensions", "11 × 9 cm"], ["Card slots", "6"], ["Color", "Cognac"]],
  },
  {
    slug: "noir-polarized-sunglasses", name: "Noir Polarized Sunglasses", brand: "Norde", category: "accessories",
    price: 89, compareAt: 110, images: [32677246], rating: 4.6, reviews: 417, stock: 36, featured: true, isNew: true,
    short: "Timeless acetate frames with polarized UV400 lenses and leather case.",
    description: "Handmade acetate frames with a timeless silhouette, fitted with polarized lenses that cut glare and offer full UV400 protection. Includes a premium leather case and cleaning cloth.",
    features: ["Polarized UV400 lenses", "Handmade Italian acetate frames", "5-barrel hinges for durability", "Leather case and cloth included"],
    specs: [["Frame", "Acetate"], ["Lens", "Polarized, UV400"], ["Lens width", "52 mm"], ["Warranty", "1 year"]],
  },
  {
    slug: "full-grain-leather-belt", name: "Full-Grain Leather Belt", brand: "Heritage Goods", category: "accessories",
    price: 45, images: [7679788], rating: 4.5, reviews: 264, stock: 48,
    short: "Classic 35 mm belt in full-grain leather with a brushed steel buckle.",
    description: "A belt built to last decades. Cut from a single strip of full-grain leather and finished with hand-painted edges and a solid brushed-steel buckle.",
    features: ["Single-piece full-grain leather", "Solid brushed-steel buckle", "Hand-painted edges", "Available in 5 sizes"],
    specs: [["Width", "35 mm"], ["Material", "Full-grain leather"], ["Buckle", "Stainless steel"], ["Sizes", "80–120 cm"]],
  },
  {
    slug: "everyday-cotton-cap", name: "Everyday Cotton Cap", brand: "Norde", category: "accessories",
    price: 25, images: [18313293], rating: 4.3, reviews: 129, stock: 70,
    short: "A soft, unstructured cotton cap with an adjustable strap.",
    description: "Garment-dyed cotton twill, an unstructured crown and a curved brim give this cap a relaxed, lived-in feel from day one. The adjustable strap ensures a comfortable fit.",
    features: ["Garment-dyed cotton twill", "Unstructured, low-profile crown", "Adjustable brass-buckle strap", "Embroidered eyelets"],
    specs: [["Material", "100% cotton"], ["Fit", "One size, adjustable"], ["Care", "Hand wash"], ["Color", "Plum"]],
  },
  // Sports & Fitness
  {
    slug: "pro-grip-yoga-mat", name: "Pro Grip Yoga Mat", brand: "Kinetic", category: "fitness",
    price: 58, compareAt: 72, images: [8436582], rating: 4.7, reviews: 732, stock: 52, featured: true,
    short: "Non-slip natural rubber mat with extra cushioning for joints.",
    description: "Designed for every practice, the Pro Grip mat pairs a natural rubber base with a polyurethane top layer that grips even when you sweat. 5 mm cushioning supports knees and wrists without sacrificing stability.",
    features: ["Non-slip polyurethane top layer", "5 mm natural rubber cushioning", "Alignment lines for positioning", "Carry strap included"],
    specs: [["Dimensions", "183 × 68 cm"], ["Thickness", "5 mm"], ["Weight", "2.3 kg"], ["Material", "Natural rubber & PU"]],
  },
  {
    slug: "velocity-running-shoes", name: "Velocity Running Shoes", brand: "Kinetic", category: "fitness",
    price: 129, images: [6744427], rating: 4.6, reviews: 468, stock: 27, isNew: true,
    short: "Responsive, lightweight running shoes for daily miles and race day.",
    description: "Velocity features a responsive foam midsole and an engineered mesh upper that breathes and supports. A durable rubber outsole grips the road so you can focus on your pace.",
    features: ["Responsive foam midsole", "Breathable engineered mesh upper", "High-abrasion rubber outsole", "Reflective details for low light"],
    specs: [["Weight", "255 g (US 9)"], ["Drop", "8 mm"], ["Use", "Road running"], ["Fit", "True to size"]],
  },
  {
    slug: "cast-iron-kettlebell-16kg", name: "Cast Iron Kettlebell 16 kg", brand: "Kinetic", category: "fitness",
    price: 64, images: [10480947], rating: 4.8, reviews: 205, stock: 19,
    short: "Single-cast iron kettlebell with a smooth, wide handle.",
    description: "Cast from a single piece of solid iron for durability and perfect balance. The wide, smooth handle accommodates two-handed swings, and a flat base keeps it stable on the floor.",
    features: ["Single-piece solid cast iron", "Smooth, wide powder-coated handle", "Flat base for stability", "Color-coded weight marking"],
    specs: [["Weight", "16 kg"], ["Handle diameter", "35 mm"], ["Finish", "Powder coat"], ["Warranty", "Lifetime"]],
  },
  {
    slug: "adjustable-dumbbell-pair", name: "Adjustable Dumbbell Pair", brand: "Kinetic", category: "fitness",
    price: 189, compareAt: 229, images: [9073247], rating: 4.7, reviews: 311, stock: 7,
    short: "Space-saving adjustable dumbbells from 2.5 to 24 kg each.",
    description: "Replace a full rack of weights with one compact pair. A quick-turn dial adjusts each dumbbell from 2.5 to 24 kg in seconds, making it easy to move between exercises.",
    features: ["Adjusts from 2.5 to 24 kg per dumbbell", "Quick-turn weight selection dial", "Durable molded trays included", "Replaces 15 sets of weights"],
    specs: [["Weight range", "2.5–24 kg each"], ["Increments", "15"], ["Tray size", "43 × 22 cm"], ["Warranty", "2 years"]],
  },
  {
    slug: "studio-medicine-ball-6kg", name: "Studio Medicine Ball 6 kg", brand: "Kinetic", category: "fitness",
    price: 39, images: [32610335], rating: 4.5, reviews: 98, stock: 40,
    short: "Textured-grip medicine ball for strength, core and conditioning.",
    description: "A versatile medicine ball with a textured, easy-grip surface for slams, throws, twists and core work. The durable rubber shell holds up to daily training.",
    features: ["Textured non-slip grip", "Durable rubber shell", "Slight bounce for rebound drills", "Ideal for core and conditioning"],
    specs: [["Weight", "6 kg"], ["Diameter", "28 cm"], ["Material", "Rubber"], ["Warranty", "1 year"]],
  },
  // Lifestyle
  {
    slug: "striped-stoneware-mug", name: "Striped Stoneware Mug", brand: "Paper & Pine", category: "lifestyle",
    price: 22, images: [34299319], rating: 4.7, reviews: 388, stock: 120, isNew: true,
    short: "A generous stoneware mug with a hand-painted stripe.",
    description: "Hand-painted and glazed stoneware that feels just right in your hands. Its generous 350 ml capacity is perfect for morning coffee, afternoon tea or anything in between.",
    features: ["Hand-painted stoneware", "Generous 350 ml capacity", "Microwave and dishwasher safe", "Comfortable wide handle"],
    specs: [["Capacity", "350 ml"], ["Material", "Stoneware"], ["Care", "Dishwasher safe"], ["Height", "9.5 cm"]],
  },
  {
    slug: "artisan-glazed-latte-cup", name: "Artisan Glazed Latte Cup", brand: "Paper & Pine", category: "lifestyle",
    price: 26, images: [39529869], rating: 4.8, reviews: 152, stock: 60,
    short: "A hand-glazed ceramic cup made for lattes and flat whites.",
    description: "The wide, rounded shape of this ceramic cup is ideal for latte art, and its reactive blue glaze makes every piece unique. Crafted by a small family-run pottery studio.",
    features: ["Hand-glazed ceramic", "Wide bowl, ideal for latte art", "Reactive glaze — every piece is unique", "Made by a family-run studio"],
    specs: [["Capacity", "280 ml"], ["Material", "Ceramic"], ["Care", "Hand wash recommended"], ["Color", "Ocean blue"]],
  },
  {
    slug: "linen-desk-notebook-set", name: "Linen Desk Notebook Set", brand: "Paper & Pine", category: "lifestyle",
    price: 28, compareAt: 34, images: [4765366], rating: 4.6, reviews: 274, stock: 85, featured: true,
    short: "Two linen-bound notebooks with smooth, fountain-pen-friendly paper.",
    description: "A pair of lay-flat notebooks bound in soft linen and filled with 120 gsm acid-free paper that handles fountain pens without bleed-through. One dotted, one lined — for ideas and plans alike.",
    features: ["Linen-bound hardcovers", "120 gsm acid-free paper", "Lay-flat binding", "One dotted, one lined"],
    specs: [["Size", "A5"], ["Pages", "192 each"], ["Paper", "120 gsm"], ["Includes", "2 notebooks"]],
  },
  {
    slug: "lavender-reading-gift-set", name: "Lavender Reading Gift Set", brand: "Paper & Pine", category: "lifestyle",
    price: 49, images: [34299336], rating: 4.7, reviews: 91, stock: 18,
    short: "A calming gift set with a mug, lavender bundle and a curated novel.",
    description: "The perfect slow-evening gift: a hand-painted stoneware mug, a bundle of dried French lavender and a curated bestselling novel, packaged in a keepsake box.",
    features: ["Stoneware mug included", "Dried French lavender bundle", "Curated bestselling novel", "Presented in a keepsake box"],
    specs: [["Includes", "Mug, lavender, book"], ["Box size", "30 × 22 × 10 cm"], ["Gift message", "Available"], ["Ideal for", "Birthdays & thank-yous"]],
  },
  {
    slug: "colorful-stationery-kit", name: "Colorful Stationery Kit", brand: "Paper & Pine", category: "lifestyle",
    price: 32, images: [7434244], rating: 4.4, reviews: 140, stock: 45,
    short: "A cheerful desk kit with pens, clips, sticky notes and more.",
    description: "Brighten up your workspace with a curated kit of everyday stationery: gel pens, highlighters, sticky notes, binder clips and a pocket notebook — all in a coordinated palette.",
    features: ["20+ desk essentials", "Smooth quick-dry gel pens", "Coordinated color palette", "Reusable storage tin"],
    specs: [["Pieces", "24"], ["Pen type", "0.5 mm gel"], ["Ideal for", "Home, office, school"], ["Packaging", "Reusable tin"]],
  },
];
