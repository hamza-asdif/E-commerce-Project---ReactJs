import React from 'react'
import './Orders.css'

function Orders() {
  return (
    <div>
      {/* Recent Orders */}
      <div className="recent-orders">
            <h2>الطلبات الأخيرة</h2>
            <table>
              <thead>
                <tr>
                  <th>رقم الطلب</th>
                  <th>العميل</th>
                  <th>التاريخ</th>
                  <th>المبلغ</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#١٢٣٤٥</td>
                  <td>جون دو</td>
                  <td>٢٠٢٣-١٠-٠١</td>
                  <td>١٩٩.٠٠ ريال</td>
                  <td className="status delivered">تم التوصيل</td>
                </tr>
                <tr>
                  <td>#١٢٣٤٦</td>
                  <td>جين سميث</td>
                  <td>٢٠٢٣-١٠-٠٢</td>
                  <td>٢٩٩.٠٠ ريال</td>
                  <td className="status pending">قيد الانتظار</td>
                </tr>
                <tr>
                  <td>#١٢٣٤٧</td>
                  <td>أليس جونسون</td>
                  <td>٢٠٢٣-١٠-٠٣</td>
                  <td>٩٩.٠٠ ريال</td>
                  <td className="status cancelled">ملغي</td>
                </tr>
              </tbody>
            </table>
          </div>
    </div>
  )
}

export default Orders
