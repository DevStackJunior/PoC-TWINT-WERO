# 💳 Proof of Concept – Merging two financial applications with AdonisJS

## 🧠 Context

This Proof of Concept (PoC) demonstrates the technical feasibility of **merging** different transactional formats from **two financial applications** into a unified platform using the **AdonisJS** framework.

The data sources are **two local JSON files** representing two different banking environments:  

🇨🇭 **TWINT (Swiss standards)** and 🇪🇺 **WERO (European standards)**.

No external API is used—all data is **loaded locally**, **merged into a MySQL database**, and then **accessed from the `/resources/` folder**.

---

## 🎯 PoC objectives

### Main objectives

- **Merge data** from two separate financial systems (App A and App B).  
- **Load from local JSON files** without external dependencies.  
- **Modular architecture** to isolate the logic of each application.  
- **Common management of business logic**, services, and schemas.  
- **Merge and transform data** into a single format.  
- **Operational migration** to a complete SQL database.  

---

## ⚙️ Technical objectives

### 1. Environment & persistence

- Use of a **MySQL container (Docker)** to centralize merged data.
- **Reading and importing** of the `/data/TX_TWINT.json` and `/data/TX_WERO.json` files into the database when the project is initialized.
- **No raw API routes exposed*
- **No raw API route exposed**: data is accessed from the `/data/` folder.  
- Option to use **AdonisJS seeding scripts** to automate loading.

---

### 2. Local data sources

The two JSON files are **identical in structure** (same schema, same keys),  
but their **contents differ** (values, amounts, currencies, origin, etc.).

| File       | Origin | Description | Format |
|----------------|--------- -|-------------|---------|
| `/data/TX_TWINT.json` | 🇨🇭 **App A – TWINT / Swiss Payment Standard** | Simulated data in Swiss standard format (TWINT micro-transaction) | TWINT / Swiss QR Bill / ISO 20022
| `/data/TX_WERO.json` | 🇪🇺 **App B – WERO / PSD2 Berlin Group** | Simulated data in European standard format (Open Banking EU) | PSD2 Berlin Group

---

### 3. Merging and reading process

1. **Initial loading**  
   - The files `/data/TX_TWINT.json` and `/data/TX_WERO.json` are read by `DataLoaderService`.  
   - Each entry is validated, enriched, and prepared for insertion.  

2. **Insertion and merging into the database**  
   - Records are inserted into MySQL.  
   - A single table groups all transactions with an origin field:  
     - `“origin”: “SWISS”` for `/data/TX_TWINT.json`  
     - `“origin”: “EU”` for `/data/TX_WERO.json`.

3. **Reading from `/resources/`**  
   - Views, scripts, or exports in `/resources/` access the database directly.  
   - No `/api/` folder is used: everything is internal and managed by AdonisJS.

---

### 4. Normalization & validation

Before insertion into the database, a normalization service applies:

- ✅ **Structure validation** (`user_id`, `merchant_id`, `amount`, `currency_id`, etc.)  
- 🔄 **Status conversion** → ISO 20022 standards:  
  `completed` → `BOOKED`,
  `pending` → `PENDING`,
  `failed` → `REJECTED`

---

### 📂 Global tree structure

```bash

/app
 ├── controllers/              # Business controllers: reading and merging JSON data
 ├── data/                     # Raw JSON data simulating two banking environments
 │   ├── TX_TWINT.json                # 🇨🇭 TWINT / Swiss Payment Standard data
 │   └── TX_WERO.json                # 🇪🇺 WERO / PSD2 Berlin Group data
 ├── exceptions/               # Global error and exception handling
 ├── middleware/               # AdonisJS middleware (container bindings, etc.)
 │   └── container_bindings_middleware.ts
 ├── models/                   # Lucid ORM models (linked to the MySQL database)
 │   ├── currency.ts           # Currency table (ISO 4217)
 │   ├── merchant.ts           # Merchant table
 │   ├── test.ts               # Test model / sandbox
 │   ├── transaction.ts        # Main transaction table
 │   ├── user.ts               # User table
 │   └── wallet.ts             # Electronic wallet table
/bin                           # CLI scripts (e.g., seed, maintenance)
/config                        # AdonisJS configuration (app, database, etc.)
/database                      # Migrations and seeds for the MySQL database
/resources                     # Presentation layer: CSS, JS, and Edge templates
 │
 ├── css/                      # Front-end stylesheets
 │   ├── app.css
 │   ├── dashboard.css
 │   └── home.css
 │
 ├── js/                       # Front-end scripts specific to views
 │   ├── app.js
 │   ├── common.js
 │   ├── dashboard.js
 │   ├── home.js
 │   ├── merchant.js
 │   └── pay.js
 │
 ├── views/                    # Edge templates for displaying pages
 │   ├── components/layout/    # Reusable components (global layout)
 │   │   └── main.edge
 │   ├── pages/                # Application pages
 │   │   ├── errors/           # Error pages (404, 500, etc.)
 │   │   ├── dashboard.edge    # Dashboard view (aggregated transactions)
 │   │   ├── merchant.edge     # Merchant view
 │   │   ├── pay.edge          # Payment view
 │   │   └── home.edge         # Home view / overview
 │
/start                         # Initialization (kernel, routes, providers, etc.)
