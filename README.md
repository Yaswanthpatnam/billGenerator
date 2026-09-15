# 🚖 TripBill — Indian Travel Bill & Invoice Generator

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![PDF Export](https://img.shields.io/badge/jsPDF%20%26%20html2canvas-High--Res-orange)](https://github.com/parallax/jsPDF)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modern, fast, and privacy-focused web application tailored for the **Indian travel and transport ecosystem** (tours & travels operators, fleet agencies, and independent drivers). TripBill generates print-ready single-trip sheets and physical carbon-copy style multi-trip cash bills with instant high-resolution PDF downloads — 100% client-side with zero login required.

---

## ✨ Features

### 1. 📄 Single Trip Sheet Generator (`A4 Landscape`)
- Designed for outstation one-way/round trips, corporate rentals, and airport transfers.
- **Detailed Metrics**: Opening & Closing KMs, Opening & Closing Times, Extra KMs, Extra Hours, Total KMs, and Total Hours.
- **Itemized Charges**: Outstation rate, Base fare (4 Hrs / 8 Hrs), Extra KM/Hr rates, Toll charges, Parking fees, Checkpost fees, and Driver Bata.
- **Export Format**: A4 Landscape (`1123px × 794px`), ensuring complete side-by-side rates, closing meters, and signature blocks are captured without cut-offs.

### 2. 🧾 Multi-Trip Cash Bill Generator (`A4 Portrait`)
- Replicates standard Indian carbon-copy physical bill books.
- **Dynamic Duty Table**: Add and delete multiple daily duty entries with columns for Date, Vehicle No, Booked By, Start/Close KMs, Total KMs, Start/Close Hours, Total Hours, Toll/Parking, and Total Amount.
- **Automatic Calculations**: Auto-calculates Subtotal, Advance Deductions, and Net Balance Due.
- **Pixel-Perfect Alignment**: Precise baseline and dotted underline spacing preventing any text-overlap on print and exported PDFs.

### 3. 🌐 Modern Landing Page
- Interactive trip type switcher (**Single trip** vs **Multi trip**).
- Dynamic live invoice preview simulation with Indian travel routes and Indian Rupees (`₹`).
- Seamless section navigation (`#how-it-works`, `#features`, `#pricing`).
- Clean, high-contrast light theme optimized for clarity and readability.

### 4. 🔒 100% Client-Side & Private
- Zero backend storage, zero telemetry, zero accounts required.
- Everything runs inside the browser, keeping all customer and travel data private.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 18** | Modular component architecture and state management |
| **Bundler & Dev Server** | **Vite 8** | High-performance bundling and fast Hot Module Replacement (HMR) |
| **Styling** | **Tailwind CSS 3** | Responsive styling, typography, and print layouts |
| **Icons** | **Lucide React** | Scalable SVG icons for UI controls and navigation |
| **DOM Capture Engine** | **html2canvas** | High-resolution bitmap rendering (`scale: 5`) with font readiness hooks |
| **PDF Generation** | **jsPDF** | Client-side vector PDF generation supporting custom page dimensions |

---

## 📁 Project Structure

```
billgenerator/
├── public/
│   └── favicon.svg               # TripBill vector SVG favicon
├── src/
│   ├── assets/
│   │   ├── logo.png              # Travel agency default logo
│   │   └── signature.png         # Authorised signatory stamp
│   ├── components/
│   │   ├── Header.jsx            # Top navbar with navigation links
│   │   ├── HeroSection.jsx       # Hero headline and subtitle
│   │   ├── TripOption.jsx        # Single vs Multi-trip switcher cards
│   │   ├── InvoicePreview.jsx    # Live dynamic sample invoice card
│   │   ├── Benefits.jsx          # Highlights & value propositions
│   │   ├── Footer.jsx            # Footer links & copyright
│   │   ├── LandingPage.jsx       # Main landing page coordinator
│   │   ├── InvoicePage.jsx       # Single Trip Sheet (A4 Landscape) generator
│   │   └── MultiTripPage.jsx     # Multi-Trip Cash Bill (A4 Portrait) generator
│   ├── App.jsx                   # Root application router & view switcher
│   ├── index.css                 # Base styles and print utilities
│   ├── multi-trip.css            # Dotted line and sheet-specific CSS
│   └── main.jsx                  # React application entry point
├── index.html                    # HTML shell & font definitions
├── tailwind.config.js            # Tailwind configuration
├── postcss.config.js             # PostCSS plugins
├── package.json                  # Dependencies and scripts
└── vite.config.js                # Vite build configuration
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have **Node.js** (v18 or higher recommended) and **npm** installed on your machine.

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/billgenerator.git
   cd billgenerator
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173` to start creating bills.

---

## 📦 Available Scripts

- `npm run dev` — Starts the Vite development server with Hot Module Replacement.
- `npm run build` — Bundles the application for production inside the `dist/` directory.
- `npm run preview` — Locally previews the production build at `http://localhost:4173`.
- `npm run lint` — Runs ESLint across the codebase.

---

## 🚢 Deployment

Since TripBill is a 100% static client-side web application, it can be deployed to any static hosting provider for free in seconds:

### Deploying to Vercel
1. Push your code to a Git repository (GitHub / GitLab / Bitbucket).
2. Import the project into [Vercel](https://vercel.com/).
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy**.

### Deploying to Netlify
1. Connect your repository on [Netlify](https://www.netlify.com/).
2. Set Build command to `npm run build` and Publish directory to `dist`.
3. Click **Deploy Site**.

---

## 📄 License

This project is licensed under the MIT License — feel free to customize and use it for your transport business.
