# Company Portal & AI Assistant 🤖🏢

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/Gemini_AI-API-orange?style=for-the-badge&logo=google)](https://ai.google.dev/)

A full-stack web application serving as a comprehensive Company Portal. It includes an intelligent customer service AI chatbot, an online repair request system, a product catalog with an ordering system, and a full-featured admin dashboard.

**Developed by**: Noppawat Loryingyongphaisal, Faculty of Engineering  
**Powered by**: Antigravity

---

## ✨ Features

### 1. 💬 Specialized AI Chatbot (Gemini)
- Integrated with Google's **Gemini 2.5 Flash** AI.
- Context-aware model: Strictly answers questions related to electrical appliances and electronics sold by the company.
- **Smart Quotas:** Automatically limits regular users to 20 messages per day to prevent API abuse, while granting unlimited access to admins.
- **Floating UI:** Beautiful floating chat widget available from anywhere on the site.

### 2. 🔧 Online Repair System
- Users can submit device repair requests with custom details.
- **Image Upload:** Supports uploading images (up to 5MB) of the broken device directly to the database via Base64 encoding.
- Real-time status tracking (Pending → Acknowledged → Completed).

### 3. 🛍️ Product Catalog & Ordering
- Displays available company products stored directly in the database.
- Users can view product details and place orders immediately.
- Clean and modern e-commerce grid layout.

### 4. 🛡️ Admin Dashboard
- **Analytics:** View total registered users and cumulative AI message usage.
- **Repair Management:** View customer repair requests, inspect broken item images, and update their statuses dynamically.
- **Inventory Management:** Add new products to the shop catalog with a built-in image upload feature.

### 5. 🔒 Custom Authentication & Security
- Secure login and registration functionality.
- Encrypted route protection using **Next.js Middleware**.
- Restricts unauthenticated users from accessing the chatbot, products, and repair features.
- Special `/admin` layout restricted explicitly to users with the 'admin' role.

---

## 🛠️ Technology Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS, Lucide Icons
- **Backend:** Next.js API Routes (Serverless Functions)
- **Database:** MongoDB & Mongoose ORM
- **AI Integration:** Google Generative AI (`@google/generative-ai`)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/web-comess-final-project.git
cd web-comess-final-project/my-ai-chatbot
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a file named `.env.local` in the root directory (`my-ai-chatbot/`) and add the following keys:
```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/your-db-name

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## ☁️ Deployment

This Next.js application is fully optimized for **Vercel** deployment.
1. Push your repository to GitHub.
2. Import the repository into your Vercel Dashboard.
3. Configure the Root Directory to `my-ai-chatbot`.
4. Add the `MONGODB_URI` and `GEMINI_API_KEY` to Vercel's Environment Variables settings.
5. Click **Deploy**.
