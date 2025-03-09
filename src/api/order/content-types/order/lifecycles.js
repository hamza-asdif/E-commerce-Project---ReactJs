'use strict';

const { strapi } = require('@strapi/strapi');

module.exports = {
    async afterCreate(event) {
      const { result } = event;
  
      try {
        // جلب بيانات لوحة التحكم الحالية
        const dashboardStats = await strapi.entityService.findMany(
          "api::dashboard.dashboard"
        );
  
        let currentSales = dashboardStats?.total_sales || 0;
        let newTotalSales = currentSales + result.total_price;
  
        // تحديث بيانات لوحة التحكم
        await strapi.entityService.update("api::dashboard.dashboard", dashboardStats.id, {
          data: {
            total_sales: newTotalSales,
          },
        });
  
        console.log("تم تحديث لوحة التحكم بالمبيعات الجديدة:", newTotalSales);
      } catch (error) {
        console.error("حدث خطأ أثناء تحديث المبيعات في لوحة التحكم:", error);
      }
    },
  };
  