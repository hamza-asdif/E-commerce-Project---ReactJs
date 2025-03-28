import React, { useState, useEffect } from "react";
import axios from "axios";

function ProductManager() {
  // المتغيرات الأساسية
  const BIN_ID = "67c54486e41b4d34e49fc194";
  const ACCESS_KEY =
    "$2a$10$lHC6.TYTGJdHEzvNt8D6DOCWIDRJHjfUUWMBzLBRfhQGlEBEIK6oa";
  const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

  // متغيرات الحالة
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");

  // نموذج منتج جديد
  const [newProduct, setNewProduct] = useState({
    id: "", // سيتم تعيينه تلقائياً
    name: "",
    Image: "images/products/default.jpeg",
    price: 0,
    OldPrice: 0,
    description: "",
  });

  // جلب كل المنتجات
  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        headers: {
          "X-Access-Key": ACCESS_KEY,
        },
      });
      const allProducts = response.data.record.Products || [];
      setProducts(allProducts);
      setResponseMessage("تم جلب المنتجات بنجاح");
      console.log("جميع المنتجات:", allProducts);
      setLoading(false);
    } catch (err) {
      setError("فشل في جلب المنتجات: " + err.message);
      setLoading(false);
    }
  };

  // جلب منتج محدد عن طريق ID
  const fetchProductById = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        headers: {
          "X-Access-Key": ACCESS_KEY,
        },
      });

      const productData = response.data.record.Products.find(
        (p) => p.id === parseInt(id),
      );

      if (productData) {
        setCurrentProduct(productData);
        setResponseMessage(`تم العثور على المنتج: ${productData.name}`);
        console.log("المنتج المحدد:", productData);
      } else {
        setResponseMessage("لم يتم العثور على المنتج");
      }
      setLoading(false);
    } catch (err) {
      setError("فشل في جلب المنتج: " + err.message);
      setLoading(false);
    }
  };

  // إضافة منتج جديد
  const addProduct = async () => {
    setLoading(true);
    try {
      // جلب البيانات الحالية أولاً
      const response = await axios.get(API_URL, {
        headers: {
          "X-Access-Key": ACCESS_KEY,
        },
      });

      const currentData = response.data.record;
      const currentProducts = currentData.Products || [];

      // تعيين ID جديد
      const newId =
        currentProducts.length > 0
          ? Math.max(...currentProducts.map((p) => p.id)) + 1
          : 1;

      // إضافة المنتج الجديد إلى المصفوفة
      const productToAdd = { ...newProduct, id: newId };
      currentData.Products = [...currentProducts, productToAdd];

      // تحديث البيانات في JSONBin
      await axios.put(API_URL, currentData, {
        headers: {
          "X-Access-Key": ACCESS_KEY,
          "Content-Type": "application/json",
        },
      });

      setResponseMessage(`تمت إضافة المنتج: ${productToAdd.name}`);
      setProducts(currentData.Products);
      // إعادة تعيين نموذج المنتج الجديد
      setNewProduct({
        id: "",
        name: "",
        Image: "images/products/default.jpeg",
        price: 0,
        OldPrice: 0,
        description: "",
      });
      setLoading(false);
    } catch (err) {
      setError("فشل في إضافة المنتج: " + err.message);
      setLoading(false);
    }
  };

  // تحديث منتج موجود
  const updateProduct = async (productId, updatedProductData) => {
    setLoading(true);
    try {
      // جلب البيانات الحالية أولاً
      const response = await axios.get(API_URL, {
        headers: {
          "X-Access-Key": ACCESS_KEY,
        },
      });

      const currentData = response.data.record;
      const currentProducts = currentData.Products || [];

      // البحث عن المنتج وتحديثه
      const updatedProducts = currentProducts.map((product) =>
        product.id === parseInt(productId)
          ? { ...product, ...updatedProductData }
          : product,
      );

      currentData.Products = updatedProducts;

      // تحديث البيانات في JSONBin
      await axios.put(API_URL, currentData, {
        headers: {
          "X-Access-Key": ACCESS_KEY,
          "Content-Type": "application/json",
        },
      });

      setResponseMessage(`تم تحديث المنتج رقم: ${productId}`);
      setProducts(updatedProducts);
      setLoading(false);
    } catch (err) {
      setError("فشل في تحديث المنتج: " + err.message);
      setLoading(false);
    }
  };

  // حذف منتج
  const deleteProduct = async (productId) => {
    setLoading(true);
    try {
      // جلب البيانات الحالية أولاً
      const response = await axios.get(API_URL, {
        headers: {
          "X-Access-Key": ACCESS_KEY,
        },
      });

      const currentData = response.data.record;
      const currentProducts = currentData.Products || [];

      // حذف المنتج
      const updatedProducts = currentProducts.filter(
        (product) => product.id !== parseInt(productId),
      );

      currentData.Products = updatedProducts;

      // تحديث البيانات في JSONBin
      await axios.put(API_URL, currentData, {
        headers: {
          "X-Access-Key": ACCESS_KEY,
          "Content-Type": "application/json",
        },
      });

      setResponseMessage(`تم حذف المنتج رقم: ${productId}`);
      setProducts(updatedProducts);
      setCurrentProduct(null);
      setLoading(false);
    } catch (err) {
      setError("فشل في حذف المنتج: " + err.message);
      setLoading(false);
    }
  };

  // جلب المنتجات عند تحميل المكون
  useEffect(() => {
    fetchAllProducts();
  }, []);

  // التعامل مع تغييرات نموذج المنتج الجديد
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]:
        name === "price" || name === "OldPrice" ? parseFloat(value) : value,
    });
  };

  // التعامل مع تغييرات نموذج تحديث المنتج
  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name]:
        name === "price" || name === "OldPrice" ? parseFloat(value) : value,
    });
  };

  return (
    <div dir="rtl" className="container mx-auto p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4 text-center">
        إدارة المنتجات مع JSONBin.io
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {responseMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {responseMessage}
        </div>
      )}

      {/* قسم جلب المنتجات */}
      <div className="mb-8 bg-gray-50 p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2">قراءة المنتجات (Read)</h2>
        <div className="flex space-x-2">
          <button
            onClick={fetchAllProducts}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
            disabled={loading}
          >
            جلب جميع المنتجات
          </button>

          <div className="flex items-center ml-4">
            <input
              type="number"
              placeholder="أدخل رقم المنتج"
              className="border p-2 rounded ml-2"
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, id: e.target.value })
              }
            />
            <button
              onClick={() => fetchProductById(currentProduct?.id)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={loading || !currentProduct?.id}
            >
              جلب منتج محدد
            </button>
          </div>
        </div>

        {/* عرض المنتجات */}
        <div className="mt-4">
          {loading ? (
            <p>جاري التحميل...</p>
          ) : (
            <div>
              <h3 className="font-bold mb-2">المنتجات ({products.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="border p-3 rounded hover:bg-gray-50"
                  >
                    <p>
                      <strong>رقم:</strong> {product.id}
                    </p>
                    <p>
                      <strong>الاسم:</strong> {product.name}
                    </p>
                    <p>
                      <strong>السعر:</strong> {product.price}
                    </p>
                    <p>
                      <strong>السعر القديم:</strong> {product.OldPrice}
                    </p>
                    <div className="mt-2">
                      <button
                        onClick={() => setCurrentProduct(product)}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded ml-2"
                      >
                        تحديث
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* قسم إضافة منتج جديد */}
      <div className="mb-8 bg-gray-50 p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2">إضافة منتج جديد (Create)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">اسم المنتج</label>
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1">مسار الصورة</label>
            <input
              type="text"
              name="Image"
              value={newProduct.Image}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1">السعر</label>
            <input
              type="number"
              name="price"
              value={newProduct.price}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1">السعر القديم</label>
            <input
              type="number"
              name="OldPrice"
              value={newProduct.OldPrice}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1">الوصف</label>
            <textarea
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
              rows="3"
            ></textarea>
          </div>
        </div>
        <button
          onClick={addProduct}
          className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading || !newProduct.name}
        >
          إضافة منتج
        </button>
      </div>

      {/* قسم تحديث المنتج */}
      {currentProduct && (
        <div className="mb-8 bg-gray-50 p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">تحديث المنتج (Update)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">رقم المنتج</label>
              <input
                type="number"
                value={currentProduct.id}
                disabled
                className="border p-2 rounded w-full bg-gray-100"
              />
            </div>
            <div>
              <label className="block mb-1">اسم المنتج</label>
              <input
                type="text"
                name="name"
                value={currentProduct.name}
                onChange={handleUpdateInputChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block mb-1">مسار الصورة</label>
              <input
                type="text"
                name="Image"
                value={currentProduct.Image}
                onChange={handleUpdateInputChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block mb-1">السعر</label>
              <input
                type="number"
                name="price"
                value={currentProduct.price}
                onChange={handleUpdateInputChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block mb-1">السعر القديم</label>
              <input
                type="number"
                name="OldPrice"
                value={currentProduct.OldPrice}
                onChange={handleUpdateInputChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1">الوصف</label>
              <textarea
                name="description"
                value={currentProduct.description || ""}
                onChange={handleUpdateInputChange}
                className="border p-2 rounded w-full"
                rows="3"
              ></textarea>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => updateProduct(currentProduct.id, currentProduct)}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded ml-2"
              disabled={loading}
            >
              تحديث المنتج
            </button>
            <button
              onClick={() => setCurrentProduct(null)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManager;
