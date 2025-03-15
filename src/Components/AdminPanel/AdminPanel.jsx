import React from "react";
import "./AdminPanel.css";
import Sidebar from "./SideBar/SideBar";

const AdminPanel = () => {
  return (
    <div className="admin-panel">
        <Sidebar />
      {/* Header */}
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, Hamza. Here's your store overview.</p>
      </header>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>SAR 69,738.00</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>380</p>
        </div>
        <div className="stat-card">
          <h3>Active Users</h3>
          <p>1,234</p>
        </div>
        <div className="stat-card">
          <h3>Products</h3>
          <p>56</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="recent-orders">
        <h2>Recent Orders</h2>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#12345</td>
              <td>John Doe</td>
              <td>2023-10-01</td>
              <td>SAR 199.00</td>
              <td className="status delivered">Delivered</td>
            </tr>
            <tr>
              <td>#12346</td>
              <td>Jane Smith</td>
              <td>2023-10-02</td>
              <td>SAR 299.00</td>
              <td className="status pending">Pending</td>
            </tr>
            <tr>
              <td>#12347</td>
              <td>Alice Johnson</td>
              <td>2023-10-03</td>
              <td>SAR 99.00</td>
              <td className="status cancelled">Cancelled</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Product Management */}
      <div className="product-management">
        <h2>Product Management</h2>
        <div className="product-actions">
          <input type="text" placeholder="Search products..." />
          <button>Add Product</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#P001</td>
              <td>Product A</td>
              <td>SAR 99.00</td>
              <td>50</td>
              <td>
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
            <tr>
              <td>#P002</td>
              <td>Product B</td>
              <td>SAR 199.00</td>
              <td>30</td>
              <td>
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* User Analytics */}
      <div className="user-analytics">
        <h2>User Analytics</h2>
        <div className="chart-placeholder">
          <p>Chart Placeholder</p>
        </div>
      </div>

      {/* Notifications */}
      <div className="notifications">
        <h2>Notifications</h2>
        <ul>
          <li>New order received (#12345).</li>
          <li>Product "XYZ" is out of stock.</li>
          <li>User "John Doe" signed up.</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;