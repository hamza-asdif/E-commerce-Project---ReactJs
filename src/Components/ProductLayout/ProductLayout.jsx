import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard/ProductCard";
import "./ProductLayout.css";
import { useGlobalContext } from "../../Context/GlobalContext";
import { Link } from "react-router-dom";

export default function ProductLayout({ Num }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { allProducts, setDisplayedProducts, displayedProducts } = useGlobalContext(); // نستخدم فقط القراءة هنا

  // محاكاة تأخير التحميل
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // تحديث المنتجات المعروضة بناءً على allProducts ووجود prop Num
  useEffect(() => {
    if (allProducts.length > 0) {
      if (Num) {
        // إذا تم تمرير prop Num، نقوم بتحديد عدد المنتجات المطلوب
        const numberOfProducts = parseInt(Num, 10);
        // هنا يمكنك الاختيار بين عشوائي أو أخذ العناصر من البداية:
        // اختيار عشوائي:
        let shuffled = [...allProducts].sort(() => 0.5 - Math.random());
        let selected = shuffled.slice(0, numberOfProducts);
        console.log("selected products ------------", selected)
        setDisplayedProducts(selected);
        // أو إذا كنت تريد أخذ أول العناصر:
        // setDisplayedProducts(allProducts.slice(0, numberOfProducts));
      } else {
        // إذا لم يتم تمرير prop Num، عرض جميع المنتجات
        setDisplayedProducts(allProducts);
      }
    }
  }, [allProducts, Num]);

  // التحقق من وجود خطأ في التحميل
  useEffect(() => {
    if (!loading && allProducts.length === 0) {
      setError("تعذر تحميل المنتجات. يرجى المحاولة مرة أخرى لاحقاً.");
    } else {
      setError(null);
    }
  }, [loading, allProducts]);

  const NoProduct = () => {
    if (displayedProducts.length === 0) {
      return (
        <div className="container">
          <div className="no-products-container">
            <div className="no-products-icon">📦</div>
            <h3>لا توجد منتجات</h3>
            <p>لم نتمكن من العثور على أي منتجات لعرضها في الوقت الحالي.</p>
          </div>
        </div>
      );
    }
  }


  useEffect( () => {
    NoProduct()
  }, [loading] )


  if (loading) {
    return (
      <div className="container">
      <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>جاري تحميل المنتجات...</p>
      </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-container">
          <h3>{error}</h3>
        </div>
      </div>
    );
  }

  

  return (
    <div className="container">
      <div className="product-data-section">
        {displayedProducts.map((product) => (
          <ProductCard
            ProductTitle={product.name}
            ProductImage={product.Image}
            ProductId={product.id}
            ProductPrice={product.price}
            ProductOldPrice={product.OldPrice}
            addittional_Images={product.addittional_Images}
            key={product.id}
            Rating={product.Rating}
          />
        ))}
      </div>
    </div>
  );
}