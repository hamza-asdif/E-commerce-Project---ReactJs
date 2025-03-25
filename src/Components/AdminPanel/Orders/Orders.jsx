import React from 'react';
import './Orders.css';

function Orders() {
  return (
    <div className="orders-dashboard">
      <div className="orders-header">
        <h1 className="orders-title">إدارة الطلبات</h1>
        <div className="orders-stats">
          <div className="stat-card">
            <span className="stat-value">١٢٤</span>
            <span className="stat-label">إجمالي الطلبات</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">٨٩</span>
            <span className="stat-label">تم التسليم</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">٢٣</span>
            <span className="stat-label">قيد الانتظار</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">١٢</span>
            <span className="stat-label">ملغي</span>
          </div>
        </div>
      </div>

      <div className="orders-tools">
        <div className="search-filters">
          <div className="search-box">
            <input type="text" placeholder="البحث عن طلب..." className="search-input" />
            <button className="search-btn">
              <i className="fas fa-search"></i>
            </button>
          </div>
          
          <div className="filter-group">
            <select className="filter-select">
              <option value="">جميع الحالات</option>
              <option value="delivered">تم التسليم</option>
              <option value="pending">قيد الانتظار</option>
              <option value="processing">قيد المعالجة</option>
              <option value="cancelled">ملغي</option>
            </select>
            
            <div className="date-filter">
              <input type="date" className="date-input" placeholder="من تاريخ" />
              <span className="date-separator">-</span>
              <input type="date" className="date-input" placeholder="إلى تاريخ" />
            </div>
            
            <button className="filter-btn">تطبيق الفلتر</button>
            <button className="filter-reset">إعادة تعيين</button>
          </div>
        </div>
        
        <div className="bulk-actions">
          <select className="bulk-select">
            <option value="">إجراءات جماعية</option>
            <option value="mark-delivered">تحديد كمسلم</option>
            <option value="mark-processing">تحديد كقيد المعالجة</option>
            <option value="export">تصدير المحدد</option>
          </select>
          <button className="bulk-btn">تطبيق</button>
          <button className="export-btn">
            <i className="fas fa-file-export"></i>
            تصدير الكل
          </button>
        </div>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead className='table-header'>
            <tr>
              <th className="checkbox-cell">
                <input type="checkbox" className="select-all-checkbox" />
              </th>
              <th className="sortable">
                رقم الطلب
                <i className="fas fa-sort"></i>
              </th>
              <th>العميل</th>
              
              <th className="sortable">
                المبلغ
                {/* <i className="fas fa-sort"></i> */}
              </th>
              <th>طريقة الدفع</th>
              <th className="sortable">
                المبلغ
                {/* <i className="fas fa-sort"></i> */}
              </th>
              <th>الحالة</th>
              <th >الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {/* Order 1 */}
            <tr>
              <td className="checkbox-cell">
                <input type="checkbox" className="order-checkbox" />
              </td>
              <td className="order-id">#١٢٣٤٥</td>
              <td className="customer-info">
                <div className="customer-name">جون دو</div>
                <div className="customer-email">john@example.com</div>
              </td>
              <td className="order-date">
                <div className="date-primary">٢٠٢٣-١٠-٠١</div>
                <div className="date-secondary">١٠:٣٠ ص</div>
              </td>
              <td className="order-amount">١٩٩.٠٠ ريال</td>
              <td className="payment-method">
                <span className="payment-badge credit-card">بطاقة ائتمان</span>
              </td>
              <td className="order-status">
                <span className="status-badge delivered">تم التسليم</span>
              </td>
              <td className="actions-cell">
                <div className="action-buttons">
                  <button className="action-btn view-btn" title="عرض التفاصيل">
                    <i className="fas fa-eye"></i>
                  </button>
                  <button className="action-btn print-btn" title="طباعة الفاتورة">
                    <i className="fas fa-print"></i>
                  </button>
                  <button className="action-btn more-btn" title="المزيد من الخيارات">
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                </div>
              </td>
            </tr>

            {/* Order 2 */}
            <tr>
              <td className="checkbox-cell">
                <input type="checkbox" className="order-checkbox" />
              </td>
              <td className="order-id">#١٢٣٤٦</td>
              <td className="customer-info">
                <div className="customer-name">جين سميث</div>
                <div className="customer-email">jane@example.com</div>
              </td>
              <td className="order-date">
                <div className="date-primary">٢٠٢٣-١٠-٠٢</div>
                <div className="date-secondary">٠٢:١٥ م</div>
              </td>
              <td className="order-amount">٢٩٩.٠٠ ريال</td>
              <td className="payment-method">
                <span className="payment-badge paypal">باي بال</span>
              </td>
              <td className="order-status">
                <span className="status-badge pending">قيد الانتظار</span>
              </td>
              <td className="actions-cell">
                <div className="action-buttons">
                  <button className="action-btn view-btn" title="عرض التفاصيل">
                    <i className="fas fa-eye"></i>
                  </button>
                  <button className="action-btn print-btn" title="طباعة الفاتورة">
                    <i className="fas fa-print"></i>
                  </button>
                  <button className="action-btn more-btn" title="المزيد من الخيارات">
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                </div>
              </td>
            </tr>

            {/* Order 3 */}
            <tr>
              <td className="checkbox-cell">
                <input type="checkbox" className="order-checkbox" />
              </td>
              <td className="order-id">#١٢٣٤٧</td>
              <td className="customer-info">
                <div className="customer-name">أليس جونسون</div>
                <div className="customer-email">alice@example.com</div>
              </td>
              <td className="order-date">
                <div className="date-primary">٢٠٢٣-١٠-٠٣</div>
                <div className="date-secondary">٠٩:٤٥ ص</div>
              </td>
              <td className="order-amount">٩٩.٠٠ ريال</td>
              <td className="payment-method">
                <span className="payment-badge cod">الدفع عند الاستلام</span>
              </td>
              <td className="order-status">
                <span className="status-badge cancelled">ملغي</span>
              </td>
              <td className="actions-cell">
                <div className="action-buttons">
                  <button className="action-btn view-btn" title="عرض التفاصيل">
                    <i className="fas fa-eye"></i>
                  </button>
                  <button className="action-btn print-btn" title="طباعة الفاتورة">
                    <i className="fas fa-print"></i>
                  </button>
                  <button className="action-btn more-btn" title="المزيد من الخيارات">
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                </div>
              </td>
            </tr>

            {/* Order 4 */}
            <tr>
              <td className="checkbox-cell">
                <input type="checkbox" className="order-checkbox" />
              </td>
              <td className="order-id">#١٢٣٤٨</td>
              <td className="customer-info">
                <div className="customer-name">محمد أحمد</div>
                <div className="customer-email">mohamed@example.com</div>
              </td>
              <td className="order-date">
                <div className="date-primary">٢٠٢٣-١٠-٠٤</div>
                <div className="date-secondary">١١:٢٠ ص</div>
              </td>
              <td className="order-amount">٤٥٠.٠٠ ريال</td>
              <td className="payment-method">
                <span className="payment-badge credit-card">بطاقة ائتمان</span>
              </td>
              <td className="order-status">
                <span className="status-badge processing">قيد المعالجة</span>
              </td>
              <td className="actions-cell">
                <div className="action-buttons">
                  <button className="action-btn view-btn" title="عرض التفاصيل">
                    <i className="fas fa-eye"></i>
                  </button>
                  <button className="action-btn print-btn" title="طباعة الفاتورة">
                    <i className="fas fa-print"></i>
                  </button>
                  <button className="action-btn more-btn" title="المزيد من الخيارات">
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                </div>
              </td>
            </tr>

            {/* Order 5 */}
            <tr>
              <td className="checkbox-cell">
                <input type="checkbox" className="order-checkbox" />
              </td>
              <td className="order-id">#١٢٣٤٩</td>
              <td className="customer-info">
                <div className="customer-name">سارة خالد</div>
                <div className="customer-email">sara@example.com</div>
              </td>
              <td className="order-date">
                <div className="date-primary">٢٠٢٣-١٠-٠٥</div>
                <div className="date-secondary">٠٣:٤٠ م</div>
              </td>
              <td className="order-amount">١٧٥.٠٠ ريال</td>
              <td className="payment-method">
                <span className="payment-badge bank-transfer">تحويل بنكي</span>
              </td>
              <td className="order-status">
                <span className="status-badge delivered">تم التسليم</span>
              </td>
              <td className="actions-cell">
                <div className="action-buttons">
                  <button className="action-btn view-btn" title="عرض التفاصيل">
                    <i className="fas fa-eye"></i>
                  </button>
                  <button className="action-btn print-btn" title="طباعة الفاتورة">
                    <i className="fas fa-print"></i>
                  </button>
                  <button className="action-btn more-btn" title="المزيد من الخيارات">
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="orders-pagination">
        <div className="pagination-info">عرض ١-٥ من ٢٤ طلب</div>
        <div className="pagination-controls">
          <button className="pagination-btn" disabled>
            <i className="fas fa-chevron-right"></i>
          </button>
          <button className="pagination-number active">١</button>
          <button className="pagination-number">٢</button>
          <button className="pagination-number">٣</button>
          <button className="pagination-number">٤</button>
          <button className="pagination-number">٥</button>
          <button className="pagination-btn">
            <i className="fas fa-chevron-left"></i>
          </button>
        </div>
        <div className="pagination-options">
          <span>عرض</span>
          <select className="per-page-select">
            <option value="5">٥</option>
            <option value="10">١٠</option>
            <option value="20">٢٠</option>
            <option value="50">٥٠</option>
          </select>
          <span>لكل صفحة</span>
        </div>
      </div>
    </div>
  );
}

export default Orders;