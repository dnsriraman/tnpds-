# 🚀 TNPDS Connect

### Smart Ration Shop Management and Digital Public Distribution System

TNPDS Connect is a smart web-based ration shop management platform designed to improve transparency, efficiency, and accessibility in Tamil Nadu's Public Distribution System (TNPDS).

The platform focuses on live shop status, stock availability, digital billing, and inventory management to simplify ration shop operations and improve the customer experience.

## 🎯 Problem Statement

Traditional ration shop management faces several challenges:

- Lack of real-time information about shop opening status.
- Difficulty checking available stock before visiting a ration shop.
- Manual billing and inventory management.
- Limited transparency in stock availability.
- Time wasted by customers visiting shops without knowing product availability.

## 💡 Our Solution

TNPDS Connect provides a digital solution that connects customers and ration shop operators through a common platform.

The system aims to provide live shop information, digital billing, and centralized inventory tracking.

## ✨ Key Features

- 🏪 **Live Shop Status:** View whether a ration shop is open or closed.
- 📦 **Stock Availability:** Check available ration commodities.
- 🧾 **Digital Billing:** Generate digital bills and maintain transaction records.
- 📊 **Inventory Management:** Track and update product stock.
- 🔄 **Real-Time Updates:** Keep shop status and stock information synchronized.
- 📱 **User-Friendly Interface:** Easy-to-use interface for customers and shopkeepers.

## 🛠️ Technology Stack

- **Frontend:** React / TypeScript / Vite
- **Backend:** TypeScript server
- **Database:** Firebase Firestore
- **Hosting:** Firebase Hosting (planned or deployed, depending on setup)
- **Development:** Google AI Studio, GitHub

## 🏗️ System Architecture

```text
Customer / Shopkeeper
         |
         v
   TNPDS Connect
    Web Interface
         |
         v
   Backend Server
         |
         v
   Firebase Firestore
         |
         v
 Shop Status / Stock
   / Billing Records
```

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- Git
- Firebase project configuration

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/dnsriraman/tnpds.git
   ```

2. Navigate to the project directory:

   ```bash
   cd tnpds
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Configure the required environment variables using the provided `.env.example` file.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL shown in the terminal.

## 🔐 Security

- Firebase security rules should restrict unauthorized access.
- Shopkeepers should have appropriate permissions for stock updates and billing.
- Sensitive credentials must be stored securely.
- User authentication and authorization should be enforced before deployment.

## 🌍 Future Enhancements

- Integration with authorized TNPDS data sources.
- QR-code-based billing and stock tracking.
- SMS notifications for customers.
- AI-powered demand forecasting.
- Mobile application integration.
- Offline support for ration shop operations.

## 🎯 Project Objective

Our objective is to make ration shop operations more transparent, efficient, and accessible by using modern web technologies.

**Note:** This project is a hackathon prototype. Any live shop status, stock, and billing data are dependent on the implemented backend and configured data sources. It is not an official Tamil Nadu government TNPDS application.

## 👥 Team

**Squad 403::forbidden**

**Hackathon:** Founder's Code 2026 – 24-Hour Hackathon

---

⭐ If you find this project interesting, consider starring the repository.
