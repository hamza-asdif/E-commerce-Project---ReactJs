import React, { useEffect, useRef, useState } from "react";
import "./EditProduct.css";
import { useParams } from "react-router-dom";
import supabase from "../../../../supabaseClient";

const ProductEditPage = () => {
  const { id } = useParams("id");
  const [productDetails, setProductDetails] = useState({});
  const [thisPage_Loading, setThisPageLoading] = useState(true);
  const [productMainImage, setProductMainImage] = useState("");
  const [additionalImages, setAdditionalImages] = useState([]);
  const [loadingText, setLoadingText] = useState(
    "جارٍ تحميل الصفحة، يرجى الانتظار..."
  );
  const productNameRef = useRef(null);

  const fetchProductDetails_Edit = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id);

    if (data && data.length) {
      setProductDetails(data[0]);
      console.log(data);
    }
  };

  useEffect(() => {
    console.log(id);
    fetchProductDetails_Edit();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setThisPageLoading(false);
    }, 3000);

    setProductMainImage(productDetails.Image);
    setAdditionalImages(productDetails.additional_images);
    console.log(productDetails.Image);
    console.log(additionalImages);
  }, [productDetails]);

  useEffect(() => {
    if (!thisPage_Loading && productNameRef.current) {
      productNameRef.current.focus();
      productNameRef.current.value = productDetails.name;

    }
  }, [thisPage_Loading]);

  const LoadingJsx = () => {
    if (thisPage_Loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>{loadingText}</p>
        </div>
      );
    }
  };

  const EditPage_MainJsx = () => {
    return (
      <div className="pep-container">
        <div className="pep-header">
          <div className="pep-header-content">
            <h1 className="pep-title">تحرير المنتج</h1>
            <p className="pep-subtitle">قم بتحديث تفاصيل المنتج من هنا</p>
          </div>
          <div className="pep-actions">
            <button type="button" className="pep-btn pep-btn-cancel">
              إلغاء
            </button>
            <button type="submit" className="pep-btn pep-btn-save">
              حفظ التغييرات
            </button>
          </div>
        </div>

        <div className="pep-content">
          <div className="pep-sidebar">
            <div className="pep-nav">
              <div className="pep-nav-item pep-nav-item-active">
                <span className="pep-nav-icon">
                  <i className="pep-icon-info"></i>
                </span>
                <span className="pep-nav-text">المعلومات الأساسية</span>
              </div>
              <div className="pep-nav-item">
                <span className="pep-nav-icon">
                  <i className="pep-icon-image"></i>
                </span>
                <span className="pep-nav-text">الصور</span>
              </div>
              <div className="pep-nav-item">
                <span className="pep-nav-icon">
                  <i className="pep-icon-tag"></i>
                </span>
                <span className="pep-nav-text">التصنيفات</span>
              </div>
              <div className="pep-nav-item">
                <span className="pep-nav-icon">
                  <i className="pep-icon-settings"></i>
                </span>
                <span className="pep-nav-text">إعدادات متقدمة</span>
              </div>
            </div>
          </div>

          <div className="pep-main">
            <div className="pep-section">
              <div className="pep-section-header">
                <h2 className="pep-section-title">المعلومات الأساسية</h2>
                <p className="pep-section-desc">
                  أدخل المعلومات الأساسية للمنتج
                </p>
              </div>

              <div className="pep-card">
                <div className="pep-form-row">
                  <div className="pep-form-group">
                    <label htmlFor="pep-product-name" className="pep-label">
                      اسم المنتج <span className="pep-required">*</span>
                    </label>
                    <input
                      type="text"
                      id="pep-product-name"
                      className="pep-input"
                      placeholder="أدخل اسم المنتج"
                      ref={productNameRef}
                    />
                  </div>
                </div>

                <div className="pep-form-group">
                  <label htmlFor="pep-product-desc" className="pep-label">
                    وصف المنتج
                  </label>
                  <textarea
                    id="pep-product-desc"
                    className="pep-textarea"
                    rows="4"
                    placeholder="اكتب وصفاً تفصيلياً للمنتج"
                  ></textarea>
                </div>

                <div className="pep-form-row">
                  <div className="pep-form-group">
                    <label htmlFor="pep-product-price" className="pep-label">
                      السعر <span className="pep-required">*</span>
                    </label>
                    <div className="pep-input-group">
                      <input
                        type="number"
                        id="pep-product-price"
                        className="pep-input"
                        placeholder="0.00"
                        defaultValue={
                          Object.keys(productDetails).length > 0
                            ? productDetails.price
                            : ""
                        }
                      />
                      <span className="pep-input-addon">ر.س</span>
                    </div>
                  </div>

                  <div className="pep-form-group">
                    <label
                      htmlFor="pep-product-compare-price"
                      className="pep-label"
                    >
                      السعر قبل الخصم
                    </label>
                    <div className="pep-input-group">
                      <input
                        type="number"
                        id="pep-product-compare-price"
                        className="pep-input"
                        placeholder="0.00"
                        defaultValue={
                          Object.keys(productDetails).length > 0
                            ? productDetails.OldPrice
                            : ""
                        }
                      />
                      <span className="pep-input-addon">ر.س</span>
                    </div>
                  </div>
                </div>

                <div className="pep-form-row">
                  <div className="pep-form-group">
                    <label htmlFor="pep-product-stock" className="pep-label">
                      المخزون <span className="pep-required">*</span>
                    </label>
                    <input
                      type="number"
                      id="pep-product-stock"
                      className="pep-input"
                      placeholder="الكمية المتاحة"
                      defaultValue={
                        Object.keys(productDetails).length > 0
                          ? productDetails.Stock
                          : ""
                      }
                    />
                  </div>

                  <div className="pep-form-group">
                    <label htmlFor="pep-product-status" className="pep-label">
                      حالة المنتج
                    </label>
                    <select id="pep-product-status" className="pep-select">
                      <option value="available">متاح</option>
                      <option value="out-of-stock">نفذت الكمية</option>
                      <option value="draft">مسودة</option>
                      <option value="hidden">مخفي</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="pep-section">
              <div className="pep-section-header">
                <h2 className="pep-section-title">صور المنتج</h2>
                <p className="pep-section-desc">
                  قم بتحميل صور عالية الجودة للمنتج
                </p>
              </div>

              <div className="pep-card">
                <div className="pep-form-group">
                  <label className="pep-label">الصورة الرئيسية</label>
                  <div className="pep-upload-container">
                    <div className="pep-upload-area">
                      <div className="pep-upload-placeholder">
                        <div className="pep-upload-icon">
                          <i className="pep-icon-upload"></i>
                        </div>
                        <div className="pep-upload-text">
                          اسحب الصورة وأفلتها هنا أو{" "}
                          <span className="pep-upload-browse">
                            تصفح من جهازك
                          </span>
                        </div>
                        <div className="pep-upload-hint">
                          الحد الأقصى للحجم: 5 ميجابايت (JPG, PNG, WebP)
                        </div>
                      </div>
                      <input
                        type="file"
                        id="pep-main-image"
                        className="pep-upload-input"
                        accept="image"
                      />
                    </div>
                  </div>
                </div>

                <div className="pep-image-gallery">
                  <div className="pep-image-item main-img">
                    <div className="pep-image-preview">
                      <img
                        src={
                          Object.keys(productDetails).length > 0
                            ? `/${productMainImage}`
                            : ""
                        }
                        alt="معاينة الصورة"
                      />
                    </div>
                    <div className="pep-image-actions">
                      <button
                        type="button"
                        className="pep-image-btn pep-image-btn-delete"
                      >
                        <i className="pep-icon-trash"></i>
                      </button>
                      <button
                        type="button"
                        className="pep-image-btn pep-image-btn-main"
                      >
                        تعيين كصورة رئيسية
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pep-form-group">
                  <label className="pep-label">الصور الإضافية</label>
                  <div className="pep-upload-container">
                    <div className="pep-upload-area">
                      <div className="pep-upload-placeholder">
                        <div className="pep-upload-icon">
                          <i className="pep-icon-images"></i>
                        </div>
                        <div className="pep-upload-text">
                          اسحب الصور وأفلتها هنا أو{" "}
                          <span className="pep-upload-browse">
                            تصفح من جهازك
                          </span>
                        </div>
                        <div className="pep-upload-hint">
                          يمكنك تحميل حتى 5 صور إضافية
                        </div>
                      </div>
                      <input
                        type="file"
                        id="pep-additional-images"
                        className="pep-upload-input"
                        accept="image/*"
                        multiple
                      />
                    </div>
                  </div>

                  <div className="pep-image-gallery">
                    {additionalImages ? (
                      additionalImages.map((subImg, i) => {
                        return (
                          <div className="pep-image-item" key={i}>
                            <div className="pep-image-preview">
                              <img src={subImg} alt="معاينة الصورة" />
                            </div>
                            <div className="pep-image-actions">
                              <button
                                type="button"
                                className="pep-image-btn pep-image-btn-delete"
                              >
                                <i className="pep-icon-trash"></i>
                              </button>
                              <button
                                type="button"
                                className="pep-image-btn pep-image-btn-main"
                              >
                                تعيين كصورة رئيسية
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return <>{thisPage_Loading ? <LoadingJsx /> : <EditPage_MainJsx />}</>;
};

export default ProductEditPage;
