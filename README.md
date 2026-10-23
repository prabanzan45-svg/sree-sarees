# 🌸 SREE SAREES: Complete AI-Integrated E-Commerce, Inventory Management & Traditional Services Platform
> **Tagline:** *"Tradition Woven with Elegance."*  
> **Academic Level:** Final-Year B.Tech / B.E. / MCA Project Demonstration  
> **Location:** South Masi Street, Madurai, Tamil Nadu  
> **Status:** Fully Functional, Secure & Production-Ready across Frontend, Backend, Database, AI Assistant, WhatsApp Notifications & Traditional Services.

---

## 1. Project Overview & Architectural Summary

**Sree Sarees** is a full-stack, enterprise-grade e-commerce boutique platform, intelligent inventory management system, and traditional services portal designed specifically for authentic Indian handloom textiles and ceremonial attire.

The platform addresses real-world challenges faced by boutique artisans and shop owners:
1. **Four Main Saree Collections (Exactly 40 Products):** Strictly curated into Cotton Sarees (10), Silk Sarees (10), Kalamkari Sarees (10), and Fancy Sarees (10). No other saree categories.
2. **Product-Only Visual Presentation:** 100% verified, local photography stored in `client/public/images/sarees/` showing only the folded saree, fabric weave, border, and pallu with **zero fashion models, women, or human thumbnails**, mirroring the clean presentation of luxury boutiques like Lakshmi Boutique.
3. **Dedicated Offers Section (`/offers`):** Distinct standalone page and homepage showcase featuring genuine festive discounts of up to 25% off across the 4 collections with discount badges.
4. **Bespoke Blouse Stitching Service (`/blouse-stitching`):** Tailored craftsmanship to customer measurements in inches (Bust, Waist, Length, Shoulder, Arm Hole, Sleeve Length, Front/Back Neck Depth). Transparent quotation policy where the master tailor reviews specifications and confirms personalized pricing.
5. **Authentic Aari Work Classes (`/aari-work-class`):** Two comprehensive learning formats:
   - **Online Live Sessions:** Interactive live video batches with close-up stitch demonstrations and delivered starter kit.
   - **Offline Classes in and around Madurai, Tamil Nadu:** Hands-on classroom training with wooden frame setup at the South Masi Street Madurai boutique studio.
6. **Zero Public Admin Dashboard (Security Enforcement):** Store owners manage inventory and view customer tailoring and Aari enquiries privately via server CLI scripts (`manage-inventory.js`, `manage-enquiries.js`).
7. **Instant WhatsApp Business Order Alerts:** Order alerts and customer confirmations dispatched via Meta WhatsApp Business Cloud API (`POST https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`).
8. **Sree AI Shopping Assistant:** Natural-language assistant handling catalogue search, lowest price locator (₹499), blouse tailoring procedures, and Aari class enquiries.

```
                              ┌─────────────────────────────────────────┐
                              │        Customer Web Application         │
                              │       (React 18 + Vite + Tailwind)      │
                              └───────────────────┬─────────────────────┘
                                                  │ REST APIs & Chat
                                                  ▼
                              ┌─────────────────────────────────────────┐
                              │       Node.js / Express.js Backend      │
                              │         (Port 5000 /api Base)           │
                              ├───────────────────┬─────────────────────┤
                              │ • Auth Controller │ • Order Controller  │
                              │ • Sree AI Engine  │ • Stock Controller  │
                              │ • Enquiry Engine  │ • Config Controller │
                              └───────┬───────────┴──────────┬──────────┘
                                      │                      │
                  ┌───────────────────┴────────┐   ┌─────────┴────────────────┐
                  ▼                            ▼   ▼                          ▼
┌─────────────────────────────────┐  ┌──────────────────┐  ┌───────────────────────────┐
│ Meta WhatsApp Business Platform │  │  Dual Database   │  │   Store Owner CLI Tools   │
│  • Instant Owner Order Alerts   │  │ • MongoDB/Atlas  │  │ • manage-inventory.js     │
│  • Customer Confirmations       │  │ • Persistent JSON│  │ • manage-enquiries.js     │
└─────────────────────────────────┘  └──────────────────┘  └───────────────────────────┘
```

---

## 2. The Four Saree Collections (40 Products Total)

Every saree measures **5.5 meters** accompanied by an authentic **0.8 meter unstitched matching blouse piece** (total 6.3 meters), priced realistically from **₹499 to ₹2,799**:

| Collection | Product Count | Weaves & Highlights | Price Range |
| :--- | :---: | :--- | :---: |
| **Cotton Sarees** | 10 | Chettinad, Mulmul, Mangalagiri, Chanderi, Sambalpuri handloom cottons | ₹499 – ₹1,299 |
| **Silk Sarees** | 10 | Kanjivaram style soft silks, pure art silks, Mysore weaves with pure gold zari | ₹1,599 – ₹2,799 |
| **Kalamkari Sarees** | 10 | Traditional pen and block-printed peacock, temple, and floral vine handlooms | ₹1,099 – ₹2,199 |
| **Fancy Sarees** | 10 | Modern designer organza, shimmering tissue weaves, traditional bandhani, and evening party drapes | ₹899 – ₹2,499 |

---

## 3. Dedicated Traditional Services

### A. Bespoke Blouse Stitching (`/blouse-stitching`)
- **Measurement Inputs in Inches:** Bust, Waist, Length, Shoulder, Arm Hole, Sleeve Length, Front Neck Depth, Back Neck Depth.
- **Design Customization:** Necklines (Round, Boat, Sweetheart, V-Neck, Square, High Collar), Back styles (Deep U with Dori, Keyhole, Low Back, Potli Buttons), Sleeves (Elbow, Cap, 3/4, Full, Sleeveless).
- **Options:** Pure cotton lining, padded cups, margin allowances, dori tassels.
- **Fair Quotation Policy:** Generates reference `BLS-XXXX`. No arbitrary fixed prices; master tailor contacts customer directly with personalized quotation.

### B. Authentic Aari Work Classes (`/aari-work-class`)
- **Two Learning Formats:**
  1. **Online Live Sessions:** Live HD video streaming, small batch size (8–10), live doubt clearing, couriered materials kit.
  2. **Offline Classes in and around Madurai, Tamil Nadu:** In-person training at South Masi Street boutique studio with physical wooden frame setup.
- **Curriculum:** 4 progressive levels from basic needle holding and chain stitch to heavy bridal blouse designing with zardozi, pearls, and cutwork.
- **Starter Kit Included:** Wooden ring frame, 3 Aari needles, metallic zari spools, silk threads, pearls, beads, stones, tracing sheets.
- **Batch Enrollment:** Generates registration ID `AARI-XXXX`. Timing and enrollment fees confirmed directly with training coordinator.

---

## 4. Store Owner Terminal Management Tools

In accordance with strict security requirements, all public administrative web dashboards have been completely removed. The boutique owner manages operations privately and securely via Node.js terminal CLI scripts:

### A. Inventory & Stock Management
```bash
# View live inventory status across all 40 sarees
node server/scripts/manage-inventory.js --status

# Restock a saree by product ID
node server/scripts/manage-inventory.js --restock SS-COT-001 15 "Fresh handloom batch received"

# Adjust selling price
node server/scripts/manage-inventory.js --update-price SS-SLK-001 2499 2299

# View stock movement audit log
node server/scripts/manage-inventory.js --audit
```

### B. Blouse Stitching & Aari Enquiries Management
```bash
# View all customer enquiries
node server/scripts/manage-enquiries.js

# View only blouse stitching requests
node server/scripts/manage-enquiries.js --blouse

# View only Aari work class registrations
node server/scripts/manage-enquiries.js --aari
```

---

## 5. Verification & Testing Suite

Run the full automated test suite verifying all 14 platform components:
```bash
node server/scripts/verify-system.js
```

### Test Coverage Summary:
- **Test 1:** Health check & Brand Identity (`Sree Sarees`, `Tradition Woven with Elegance.`)
- **Test 2:** Exactly 4 Collections & 40 Products (10 Cotton, 10 Silk, 10 Kalamkari, 10 Fancy)
- **Test 3:** Local Saree Photography Verification (Zero missing image files)
- **Test 4:** Saree Dimensions (5.5m + 0.8m unstitched blouse piece)
- **Test 5:** Centralized Business Configuration API (`GET /api/config/business`)
- **Test 6:** Blouse Stitching Enquiry Submission (`POST /api/enquiries/blouse` -> `BLS-XXXX`)
- **Test 7:** Aari Class Enquiry Submission (`POST /api/enquiries/aari` -> `AARI-XXXX`)
- **Test 8:** Customer Registration & Login with 10-digit mobile & address
- **Test 9:** Cash on Delivery Order Placement & Stock Deduction & WhatsApp trigger
- **Test 10:** Sree AI: Cheapest Saree Query (Identifies ₹499 Mulmul Cotton)
- **Test 11:** Sree AI: Sarees Under ₹1,500
- **Test 12:** Sree AI: Blouse Stitching Query
- **Test 13:** Sree AI: Aari Work Classes Query (Online & Madurai)
- **Test 14:** Sree AI: Special Offers Query

---

## 6. How to Run the Project Locally

### Prerequisites
- Node.js (v18+)
- npm

### Step 1: Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Step 2: Seed the 40-Product Catalogue
```bash
node server/scripts/seed.js
```

### Step 3: Start the Backend Server
```bash
node server/server.js
# Backend runs on http://localhost:5000
```

### Step 4: Start the Frontend Client
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 7. Business Information & WhatsApp Business Configuration

### Owner WhatsApp Business Information
- **Brand:** Sree Sarees
- **Tagline:** Tradition Woven with Elegance.
- **Physical Boutique:** South Masi Street, Madurai, Tamil Nadu – 625001, India (Near Meenakshi Amman Temple Heritage Zone)
- **Owner WhatsApp Business Number:** `+91 9087637123` (Set via `WHATSAPP_OWNER_PHONE` in `server/.env`)
- **Email:** `contact@sreesarees.com`

---

## 8. WhatsApp Business Order Notification Architecture

### Automatic Backend Dispatch
Every time a customer places an order on Sree Sarees:
1. The order is securely stored in the database with a unique ID (`#SS10XX`).
2. The backend **automatically** formats and transmits an order alert to **+91 9087637123**.
3. The store owner receives the alert directly without opening the website or clicking any button.
4. Customer phone numbers and the owner's WhatsApp number are strictly kept separate.
5. Customer confirmation messages via WhatsApp are disabled as per Requirement 8; the customer receives immediate confirmation on the website screen.

### Message Payload Elements Transmitted to Owner:
- 🌸 Header: `SREE SAREES — NEW ORDER NOTIFICATION`
- Order ID: `#SS10XX`
- Order Date & Time in IST
- Customer Name, Contact Mobile, and Email
- Ordered Sarees (Individual product names, quantities, unit prices, subtotal)
- Pricing Breakdown (Subtotal, Free express delivery savings, Final order total)
- Payment Method (Cash on Delivery / Direct UPI QR / Online Gateway)
- Formatted Customer Delivery Address

### How to Configure Live Meta WhatsApp Cloud API:
In `server/.env`:
```env
WHATSAPP_TOKEN=<Your_System_User_Permanent_Access_Token>
WHATSAPP_PHONE_NUMBER_ID=<Your_Meta_Phone_Number_Identifier>
WHATSAPP_OWNER_PHONE=919087637123
```
*Note: If Meta credentials are not configured, the system operates in verified development mode where orders are saved safely, status is recorded as `CONFIG_REQUIRED` without fake success claims, and full message previews are logged to the server console.*

### Testing WhatsApp Notifications
```bash
# Run the standalone WhatsApp test suite (16 tests)
node server/scripts/test-whatsapp.js

# Run full system verification (14 tests)
node server/scripts/verify-system.js
```

