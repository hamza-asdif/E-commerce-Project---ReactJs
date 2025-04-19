

# Million Idea Store - E-commerce Platform

<div align="center">
  <img src="public/images/slide.png" alt="Million Idea Store Preview" style="width: 100%; max-width: 900px; border-radius: 10px; margin: 20px 0; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);" />
  <p>
    <strong>Modern, full-featured e-commerce platform with dual-mode checkout, RTL support, and a comprehensive admin dashboard.</strong>
  </p>
  <p>
    <a href="https://fullstack-ecommerce-project-react-49.netlify.app/" target="_blank">🌐 Live Demo</a>
  </p>
  <p>
    <img src="https://img.shields.io/badge/React-18-blue" alt="React" />
    <img src="https://img.shields.io/badge/Supabase-2.x-dark" alt="Supabase" />
    <img src="https://img.shields.io/badge/RTL-Support-green" alt="RTL Support" />
    <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version" />
    <img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
  </p>
</div>

---

## 📑 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Screenshots](#screenshots)
- [Technical Stack](#technical-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Business Features](#business-features)
- [Security Features](#security-features)
- [Performance](#performance)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

Million Idea Store is a modern e-commerce platform built with React and Supabase. It features a customer-facing storefront and a comprehensive admin dashboard for managing products, orders, and analytics. The platform is fully localized for Arabic (RTL) and offers a seamless shopping experience with features like express checkout and real-time order tracking.

---

## ✨ Key Features

### Customer

- **Product Browsing & Search:** Filter, search, and view detailed product pages.
- **Shopping Cart:** Persistent cart with real-time updates and sliding sidebar.
- **Dual-Mode Checkout:** Express checkout from product pages or standard cart checkout.
- **Order Tracking:** Track order status after purchase.
- **RTL/Arabic Support:** Full right-to-left layout and Arabic localization.
- **Responsive Design:** Works on all devices.

### Admin

- **Product Management:** Add, edit, delete products, manage images and stock.
- **Order Management:** View, update, and track orders.
- **Analytics:** View sales and order statistics.
- **Notifications:** Real-time admin notifications.

---

## 📸 Screenshots

> **Tip:** Add screenshots or GIFs for these features to make your README more engaging!

- ![Home Page](public/images/homepage.png)  
  *Home page with RTL support*  
  *(Add a screenshot of your main storefront here)*

- ![Admin Dashboard](public/images/admin-dashboard.png)  
  *Admin dashboard for managing products and orders*  
  *(Add a screenshot of the admin panel here)*

- ![Cart & Express Checkout](public/images/express-checkout.gif)  
  *Express checkout flow with sliding cart*  
  *(Add a GIF showing the sliding cart and express checkout process)*

- ![Order Tracking](public/images/order-tracking.png)  
  *Order tracking/status page*  
  *(Add a screenshot if you have order tracking UI)*

- ![Mobile View](public/images/mobile-view.png)  
  *Mobile responsive layout*  
  *(Add a screenshot of the site on mobile)*

---

## 🛠 Technical Stack

- **Frontend:** React 18, React Router, CSS Modules, Alertify
- **Backend:** Supabase (database, authentication, file storage)
- **State Management:** React Context API, Local Storage
- **Performance:** Lazy loading, code splitting, image optimization

---

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/million-idea-store.git
   cd million-idea-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**  
   Create a `.env` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure

```
src/
└── Components/
    ├── AdminPanel/
    │   ├── AdminGlobalContext.jsx
    │   ├── AdminHeader/
    │   ├── Analytics/
    │   ├── Orders/
    │   ├── Products/
    │   └── SideBar/
    ├── Breadcrumb/
    ├── Cart/
    ├── Checkout/
    ├── CheckoutForm/
    ├── Favorites/
    ├── Footer/
    ├── GoToShop_Buttons/
    ├── HeroImage/
    ├── Login/
    ├── Navbar/
    ├── ProductLayout/
    ├── productPage/
    ├── Register/
    ├── SearchBar/
    ├── SearchForProducts/
    ├── SectionTitle/
    ├── ShopPage/
    ├── SideBarWidget/
    ├── Thank_you_page/
    ├── TopBar/
    ├── WhyUsSection/
    ├── AdminLayout.jsx
    ├── ErrorBoundary.jsx
    ├── index.jsx
    └── LoadingFallback.jsx
```
*Each folder typically contains both `.jsx` and `.css` files for its component(s).*

---

## 🌟 Business Features

- **Shipping & Delivery:** Free shipping, cash on delivery, order tracking, multi-city coverage.
- **Cart Features:** Real-time quantity adjustments, instant price updates, persistent cart, express checkout, stock validation.
- **Order Processing:** Instant confirmation, unique order IDs, status tracking, customer info validation, order history.
- **Customer Service:** Arabic language, RTL UI, easy order tracking, simple checkout, clear pricing.

---

## 🔐 Security Features

- Secure admin authentication
- Role-based access control
- Protected admin routes
- Secure API communication
- Data validation and sanitization

---

## ⚡️ Performance

- Component lazy loading
- Image optimization
- State management optimization
- API response caching
- Efficient re-rendering

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and contribute to the project.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Built with ❤️ by <a href="https://github.com/yourusername">Hamza Asdif</a> using React & Supabase
</div>