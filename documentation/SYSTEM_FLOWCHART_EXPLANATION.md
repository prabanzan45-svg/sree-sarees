# SREE SAREES: OVERALL SYSTEM FLOWCHART
## Academic Final-Year Project Report Documentation & Workflow Analysis

> **Project Title:** Sree Sarees — An E-Commerce and Smart Inventory Management System  
> **Tagline:** *"Tradition Woven with Elegance."*  
> **Diagram Title:** **OVERALL SYSTEM FLOWCHART – SREE SAREES WEBSITE**  
> **Location:** South Masi Street, Madurai, Tamil Nadu  
> **Standard:** International Standard ISO 5807 (Information Processing Flowchart Conventions)

---

## 1. System Overview

The **Sree Sarees** platform is an integrated web application combining traditional Indian saree e-commerce, automated boutique inventory management, an intelligent shopping assistant (**Sree AI**), automated owner order dispatch via **WhatsApp Business**, and traditional artisan services (custom **Blouse Stitching** and **Aari Work Classes**).

The **Overall System Flowchart** models the complete operational life-cycle of user interactions, system logic, conditional branches, database queries, and external messaging integrations implemented across the frontend and backend.

---

## 2. Standard Flowchart Symbol Conventions (ISO 5807)

The flowchart strictly adheres to standard academic flowchart symbols:

| Symbol Shape | Symbol Name | Academic Meaning & Project Usage |
| :---: | :---: | :--- |
| **Oval / Rounded Rectangle** | **Terminator** | Marks the **Start** and **End** points of the system workflow, as well as milestone completion states (*Order Completed*, *Enquiry Recorded*). |
| **Rectangle** | **Process** | Represents internal computational operations, mathematical calculations (*Subtotal + Delivery Charge*), algorithmic filtering, and server-side logic (*Server Verification*, *Stock Deduction*). |
| **Parallelogram** | **Input / Output (I/O)** | Denotes user interactions with the interface, form data input (*Customer Details, Measurements*), and screen displays (*Product Cards, Order Confirmation*). |
| **Diamond** | **Decision** | Represents conditional evaluations with labeled directional branches (**[Yes]** and **[No]**) that determine the execution path. |
| **Cylinder** | **Database Operation** | Represents read and write operations on persistent data stores (**MongoDB** or local persistent JSON collections: Products, Orders, Inventory Movements, Enquiries). |
| **Solid Arrow (`→`)** | **Directional Flow** | Shows the forward progression of control from one operation to the next. |
| **Dashed Arrow (`- - →`)** | **Correction / Return Loop** | Shows backward correction loops when validation fails or cart is empty. |

---

## 3. Comprehensive Module-by-Module Flow Analysis

The system is organized into **eight functional modules** structured across three distinct operational lanes:
- **Center Lane:** Modules 1 to 6 (Core E-Commerce, Shopping, Checkout, Order Processing, and WhatsApp Owner Notification).
- **Left Lane:** Module 7 (Sree AI Shopping Assistant).
- **Right Lane:** Module 8 (Traditional Services: Blouse Stitching & Aari Work Classes).

```
                      ┌──────────────────────────────────────────────┐
                      │    START: Open Sree Sarees Web Application   │
                      └──────────────────────┬───────────────────────┘
                                             │
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │          Customer Activity Hub               │
                      └──────┬───────────────┼───────────────┬───────┘
         2. Sree AI Assistant│               │1. Saree Shop  │3. Traditional Services
                             ▼               ▼               ▼
                   ┌─────────────────┐ ┌───────────┐ ┌──────────────────┐
                   │  MODULE 7:      │ │ MODULES   │ │  MODULE 8:       │
                   │  Sree AI        │ │ 2 to 6:   │ │  Blouse Tailoring│
                   │  Assistant      │ │ Core Shop │ │  & Aari Classes  │
                   └────────┬────────┘ └─────┬─────┘ └────────┬─────────┘
                            │                │                │
                            └────────────────┼────────────────┘
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │          END: Session Fulfilled              │
                      └──────────────────────────────────────────────┘
```

---

### Module 1: Start and Website Access
1. **Start:** Customer launches the web application in a modern desktop or mobile browser.
2. **Open Website (`GET /`):** Browser initializes the React 18 single-page application (SPA) bundled via Vite.
3. **Display Home Page:** Renders the header navigation, hero banner featuring *"Tradition Woven with Elegance."*, the 4 collection gateway cards, festive offers carousel, and quick service links.
4. **Customer Activity Hub (Decision):** Routes user engagement into one of three primary pathways:
   - **Path 1:** Browse Saree Collections (Core E-Commerce).
   - **Path 2:** Sree AI Shopping Assistant.
   - **Path 3:** Traditional Services (Blouse Stitching or Aari Work Classes).

---

### Module 2: Browse Saree Categories
1. **Display Saree Collections:** Displays the four core collections:
   - **Cotton Sarees** (Mangalagiri, Chettinad, Mulmul handlooms, ₹499–₹1,299)
   - **Silk Sarees** (Kanjivaram style soft silks, Varanasi brocades, Mysore silks, ₹1,599–₹2,799)
   - **Kalamkari Sarees** (Authentic mythological and floral pen/block prints, ₹1,099–₹2,199)
   - **Fancy Sarees** (Contemporary organza, shimmering georgette, and party wear, ₹899–₹2,499)
2. **Select Category:** Customer selects a category from the navigation bar or homepage cards (`/shop?category=Silk Sarees`).
3. **Query Saree Database (`GET /api/products`):** Server retrieves the 10 products assigned to the selected category (from the 40-product catalogue in MongoDB or `products.json`).
4. **Display Available Sarees:** Shows product cards with realistic draped photography, weave highlights, price, and discount tags.
5. **Search & Filter (Decision):**
   - **Yes:** User applies filters (fabric type, color, price slider, or keyword search); the UI dynamically refilters the active collection.
   - **No:** User directly selects a saree.
6. **View Product Details (`/product/:id`):** Displays detailed photography, fabric specifications, weave characteristics, and dimensions: **5.5 meters saree length + 0.8 meter unstitched matching blouse piece** (6.3m total).

---

### Module 3: Customer Shopping Process
1. **Add to Cart:** Customer clicks *"Add to Cart"*; item details, price, and selected quantity are committed to client `CartContext` and persisted in `localStorage`.
2. **View Shopping Cart:** Customer opens the slide-out bag drawer or dedicated `/cart` page.
3. **Manage Cart:** Customer can increment/decrement quantities or remove items; total is recalculated in real time.
4. **Proceed to Checkout:** Customer clicks the checkout button.
5. **Is Cart Empty? (Decision):**
   - **Yes:** System halts checkout progression, renders an informative empty bag alert, and loops back to category browsing.
   - **No:** Customer proceeds to the delivery and payment page.

---

### Module 4: Customer and Order Details Validation
1. **Enter Customer Information:** Captures Customer Full Name, 10-Digit Mobile Number, and Email Address.
2. **Enter Delivery Address:** Captures Street Address, City, State, and Pincode.
3. **Select Payment Method:** Customer chooses from:
   - **Cash on Delivery (COD)** (Default, collect upon arrival)
   - **Direct Google Pay / UPI QR** (Manual UTR reference submission)
   - **Online Payment Gateway** (Integrated UPI / Card checkout)
4. **Validate Form Details:**
   - Verifies required address fields are non-empty.
   - Verifies mobile number matches valid 10-digit format.
5. **Are Order Details Valid? (Decision):**
   - **No:** Renders contextual validation alerts; execution loops back to data entry fields.
   - **Yes:** Proceeds to financial calculation.
6. **Calculate Final Total:**
   $$\text{Subtotal} = \sum (\text{Verified Price} \times \text{Quantity})$$
   $$\text{Delivery Fee} = \begin{cases} ₹0 & \text{if Subtotal} \ge ₹5,000 \text{ (Free Express)} \\ ₹150 & \text{otherwise} \end{cases}$$
   $$\text{Final Order Total} = \text{Subtotal} + \text{Delivery Fee}$$

---

### Module 5: Order Processing & Stock Deduction
1. **Server-Side Verification (`POST /api/orders`):**
   - Backend ignores any client-manipulated prices; queries database for authoritative product prices.
   - Checks available stock quantity (`prod.stockQuantity >= qty`).
2. **Is Stock Available? (Decision):**
   - **No:** Order is rejected with an *"Insufficient stock"* notification; customer is redirected to cart to adjust quantities.
   - **Yes:** Order proceeds to atomic creation.
3. **Save Order in Database:** Creates the order document in MongoDB (`orders` collection) or local persistent store with status `Placed` and payment status `Pending` (or `Paid`).
4. **Generate Order ID:** System computes a unique sequential identifier (e.g. `#SS1012`).
5. **Deduct Stock & Record Movement:**
   - Decrements product stock count (`stockQuantity = stockQuantity - qty`).
   - Appends an audit record to `StockMovement` collection (`SM-XXXX`, reason: `ORDER_PURCHASE`).
6. **Display Order Confirmation Screen:** Shows the user the confirmation screen with Order ID, items, delivery destination, payment method, and truthful notification status badge.

---

### Module 6: Owner WhatsApp Notification Engine
1. **Assemble WhatsApp Notification:** Backend compiles an 11-point alert designated strictly for the store owner:
   - Destination: **+91 9087637123**
   - Order Number (`#SS1012`)
   - Order Date & Time (IST format)
   - Customer Full Name, Phone Number, and Email
   - Saree Items List (Name, Quantity, Unit Price, Subtotal)
   - Price Breakdown (Subtotal, Delivery Fee Savings, Final Total)
   - Payment Method & Payment Status
   - Full Customer Delivery Address
2. **Are Meta WhatsApp API Credentials Configured? (Decision):**
   - **Yes (`WHATSAPP_TOKEN` present):** Transmits payload via Meta WhatsApp Business Cloud API (`POST https://graph.facebook.com/v20.0/{PHONE_ID}/messages`).
     - **Delivered to Gateway? (Decision):**
       - **Yes:** Records status `DELIVERED_TO_GATEWAY` with Meta message ID.
       - **No:** Records status `API_ERROR`; **preserves saved order safely**.
   - **No (Local / Development Mode):**
     - Records status `CONFIG_REQUIRED` in database.
     - Logs full formatted message to backend terminal console.
     - **Preserves saved customer order safely without data loss**.
     - Provides an interactive **1-Click WhatsApp Web / App link** on the confirmation screen so the owner or evaluator can transmit the exact alert to `+91 9087637123` with a single click.
3. **Order Completed:** Customer session completes; order is ready for boutique fulfillment.

---

### Module 7: Sree AI Shopping Assistant Workflow
1. **Customer Opens Sree AI:** Activates the floating assistant in the bottom-right corner.
2. **Input Natural Language Query:** Customer types questions such as:
   - *"Show me sarees under ₹1,500"*
   - *"What is the cheapest saree available?"*
   - *"Do you have green silk sarees?"*
   - *"How do I care for a silk saree?"*
3. **Query Live Catalogue:** Sree AI queries active sarees in MongoDB / JSON store.
4. **Intelligent Query Processing:**
   - If `GEMINI_API_KEY` is present: Generates generative multi-turn reasoning with grounded catalogue context.
   - If running locally: Natural language parser matches category, color, fabric, price constraints, or traditional services.
5. **Display Matching Saree Cards:** Renders cards with genuine product photography, price, stock status, and direct buttons (*"View Product"*, *"Add to Cart"*).
6. **Customer Action (Decision):**
   - **Add to Cart:** Directly feeds into Module 3 Shopping Cart.
   - **Continue Chatting / Return:** Returns to home browsing.

---

### Module 8: Traditional Services Portal Workflow
Customer navigates to traditional boutique craftsmanship services:

#### Service 8A: Bespoke Blouse Stitching (`/blouse-stitching`)
1. Customer enters exact measurements in inches: Bust, Under-Bust, Shoulder Width, Blouse Length, Sleeve Length, Armhole, Front Neck Depth, Back Neck Depth, Waist.
2. Selects design styling: Princess cut, Katori, Boat neck, Deep U with Dori, Elbow sleeves, pure cotton lining, padded cups.
3. Submits tailoring form (`POST /api/enquiries/blouse`).
4. Server generates tracking reference `BLS-XXXX` and persists enquiry in `enquiries.json` / MongoDB.
5. Displays transparent quotation notice: master tailor contacts customer with personalized pricing based on fabric and embroidery workload.

#### Service 8B: Authentic Aari Work Classes (`/aari-work-class`)
1. Customer reviews training formats:
   - **Online Live Sessions:** Interactive live video with instructor feedback and couriered materials starter kit.
   - **Offline Classes in Madurai:** In-person practical training at South Masi Street boutique studio.
2. Selects preferred batch timings, experience level, and materials kit request.
3. Submits registration enquiry (`POST /api/enquiries/aari`).
4. Server generates registration reference `AARI-XXXX` and persists enquiry.
5. Displays syllabus overview, starter kit checklist, and coordinator confirmation notice.

Both branches terminate cleanly at **Enquiry Logged**, returning the user to the home screen.

---

## 4. Decision Logic Summary Table

| Decision Node | Question / Condition Evaluated | Branch: [Yes] | Branch: [No] |
| :--- | :--- | :--- | :--- |
| **Activity Hub** | Which main activity does customer choose? | Routes to 1 (Shop), 2 (Sree AI), or 3 (Services) | N/A |
| **Search / Filter?** | Has customer applied fabric/color/price filter? | Filters active products and re-displays collection | Direct selection of saree |
| **Is Cart Empty?** | Does client cart contain 0 items upon checkout click? | Halts checkout; displays empty bag notice; returns to shop | Continues to Customer & Address Form |
| **Are Details Valid?** | Are mandatory fields filled & 10-digit phone valid? | Calculates final order total and delivery fees | Displays input error; highlights fields for correction |
| **Is Stock Available?** | Does database confirm `stockQuantity >= item.quantity`? | Saves order; generates Order ID; deducts stock | Rejects order with stock warning; returns to cart |
| **Meta API Configured?** | Are `WHATSAPP_TOKEN` & Phone ID present in `server/.env`? | Transmits automated alert via Meta Cloud API | Records `CONFIG_REQUIRED`; logs to console; provides 1-click WhatsApp fallback |
| **Delivered to Meta?** | Did Meta Graph API return HTTP 200 with Message ID? | Records status `DELIVERED_TO_GATEWAY` | Records status `API_ERROR`; preserves saved order |
| **AI Purchase Decision** | Did customer click "Add to Cart" inside AI chat? | Routes item directly into Module 3 Shopping Cart | Keeps chat open or returns to homepage browsing |
| **Service Selection** | Did customer choose Blouse Stitching or Aari Classes? | Opens Blouse Form (`/blouse-stitching` -> `BLS-XXXX`) | Opens Aari Portal (`/aari-work-class` -> `AARI-XXXX`) |

---

## 5. Database Interaction Matrix

| Database Entity | Flowchart Step | Operation Type | Primary Data Fields Affected |
| :--- | :--- | :---: | :--- |
| **Catalogue DB** | Browse Sarees (Mod 2) | `READ` | `productId`, `name`, `category`, `price`, `images`, `stockQuantity` |
| **Catalogue DB** | Sree AI Search (Mod 7) | `READ` | Queries active sarees by fabric, color, price constraints |
| **Orders DB** | Order Processing (Mod 5) | `WRITE (CREATE)` | `orderNumber`, `customerName`, `customerPhone`, `items`, `finalTotal`, `paymentMethod` |
| **Inventory DB** | Stock Deduction (Mod 5) | `WRITE (UPDATE)` | Decrements `stockQuantity`; creates `StockMovement` audit record (`SM-XXXX`) |
| **Orders DB** | WhatsApp Dispatch (Mod 6) | `WRITE (UPDATE)` | Updates `whatsappNotifications`: `ownerSent`, `ownerStatus`, `messageId`, `error` |
| **Enquiries DB** | Blouse Stitching (Mod 8) | `WRITE (CREATE)` | `enquiryId: "BLS-XXXX"`, `customerName`, `measurements`, `liningRequired` |
| **Enquiries DB** | Aari Work Classes (Mod 8) | `WRITE (CREATE)` | `enquiryId: "AARI-XXXX"`, `studentName`, `preferredFormat`, `preferredBatch` |

---

## 6. How to Insert into Microsoft Word (Project Report)

The generated diagram files are saved in the `documentation/` folder:

### Option A: High-Resolution PNG (Recommended for MS Word)
1. In Microsoft Word, navigate to **Insert ➔ Pictures ➔ This Device...**
2. Select:
   `documentation/overall_system_flowchart.png`
3. Click **Insert**.
4. Right-click the image ➔ **Wrap Text ➔ In Line with Text** (or **Top and Bottom**).
5. Set width to fit the A4 page margin (approx. **6.5 inches** or **16.5 cm**).
6. The PNG was rendered at high resolution from vector sources; text and symbols remain sharp when printed.

### Option B: Scalable Vector Graphics (SVG) (For Infinite Vector Quality)
1. In Microsoft Word 2016, 2019, 2021, or Microsoft 365, click **Insert ➔ Pictures ➔ This Device...**
2. Select:
   `documentation/overall_system_flowchart.svg`
3. Click **Insert**. Word will render the vector graphic with crisp vector lines at 300+ DPI.

### Option C: Editable Source Code (Mermaid / PlantUML)
- **Mermaid Source:** [`documentation/overall_system_flowchart.mmd`](file:///C:/Users/priya/.gemini/antigravity/scratch/sree-sarees/documentation/overall_system_flowchart.mmd)
  - Can be pasted into any Markdown editor or rendered at [mermaid.live](https://mermaid.live).
- **PlantUML Source:** [`documentation/overall_system_flowchart.puml`](file:///C:/Users/priya/.gemini/antigravity/scratch/sree-sarees/documentation/overall_system_flowchart.puml)
  - Can be rendered using PlantUML CLI or the VS Code PlantUML extension.
