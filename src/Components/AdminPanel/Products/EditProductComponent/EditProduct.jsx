/* eslint-disable react/display-name */
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./EditProduct.css";
import { useParams } from "react-router-dom";
import supabase from "../../../../supabaseClient";
import { ImImages } from "react-icons/im";
import { FaRegTrashAlt, FaTrash } from "react-icons/fa";
import { BsTrash3 } from "react-icons/bs";
import alertify from "alertifyjs";
import { useAdminGlobalContext } from "../../AdminGlobalContext";
import { useGlobalContext } from "../../../../Context/GlobalContext";

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
  const priceRefc = useRef(null);
  const oldPriceRef = useRef(null);
  const descriptionRef = useRef(null);
  const categoryRef = useRef(null);
  const stockRef = useRef(null);
  const [newProductInfos, setnewProductInfos] = useState({});
  const [uploadError, setUploadError] = useState("");
  const [additionalImagesError, setadditionalImagesError] = useState("");
  const [deleteOldImages, setdeleteOldImages] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const { productsData } = useAdminGlobalContext();

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

  const fetchCategories = () => {
    if (productsData.length) {
      const allCategories = productsData.map((product) => product.category);
      const uniqueCategories = [...new Set(allCategories)];
      setCategories(uniqueCategories);
    }
  };

  useEffect(() => {
    console.log(id);
    fetchProductDetails_Edit();
  }, []);

  useEffect(() => {
    if (!thisPage_Loading && productNameRef.current) {
      productNameRef.current.focus();
    }
  }, [thisPage_Loading]); // التبعية هنا على thisPage_Loading فقط

  useEffect(() => {
    setTimeout(() => {
      setThisPageLoading(false);
    }, 3000);

    if (
      Object.keys(productDetails).length > 0 &&
      Object.keys(newProductInfos).length === 0
    ) {
      // تهيئة newProductInfos بقيم productDetails
      setnewProductInfos({
        name: productDetails.name,
        description: productDetails.description,
        price: productDetails.price,
        OldPrice: productDetails.OldPrice,
        Stock: productDetails.Stock,
        category: productDetails.category,
        Image: productDetails.Image,
        additional_images: productDetails.additional_images,
      });

      setProductMainImage(`/${productDetails.Image}`);
      setAdditionalImages(productDetails.additional_images || []);
      setNewCategory(productDetails.category);
      fetchCategories();
      console.log("see product here", productDetails);
      console.log(additionalImages);
    }
  }, [productDetails]);

  const handleInfosChange = (e) => {
    const { name, value } = e.target;

    if (value.trim() != "") {
      setnewProductInfos((prevInfos) => ({
        ...prevInfos,
        [name]: value,
      }));
    }
  };

  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];

    if (file && (file.type == "image/png" || file.type == "image/jpeg")) {
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("حجم الصورة يجب أن يكون أقل من 5 ميغابايت");
      }

      const reader = new FileReader();
      reader.onload = () => {
        setProductMainImage(reader.result);
        setUploadError("");
        setnewProductInfos((prevItems) => ({
          ...prevItems,
          Image: reader.result,
        }));
      };

      reader.readAsDataURL(file);
    } else {
      setUploadError(
        "صيغة الصورة غير مدعومة. الرجاء تحميل صورة بصيغة PNG أو JPEG."
      );
    }
  };

  const handleAdditionalImagesUpload = (e) => {
    const files = e.target.files;
    const validImages = [];

    if (files) {
      for (let index = 0; index < files.length; index++) {
        const image = files[index];
        if (
          image.type == "image/png" ||
          image.type == "image/jpeg" ||
          image.type == "image/webp"
        ) {
          image.size <= 5 * 1024 * 1024
            ? validImages.push(image)
            : setadditionalImagesError(
                "حجم الصورة يجب أن يكون أقل من 5 ميغابايت"
              );
        } else {
          setadditionalImagesError(
            "صيغة الصورة غير مدعومة. الرجاء تحميل صورة بصيغة PNG أو JPEG أو WEBP"
          );
        }
      }

      const finalImages = validImages.map((image) => {
        return new Promise((resolve) => {
          const reader = new FileReader();

          reader.onload = () => {
            resolve(reader.result);
          };

          reader.readAsDataURL(image);
        });
      });

      Promise.all(finalImages).then((results) =>
        setAdditionalImages((prevImages) => [...prevImages, ...results])
      );
    }

    console.log(files);
  };

  const handleDeleteAdditionalImage = (index) => {
    const cloneImages = [...additionalImages];
    const updatedImages = cloneImages.filter((image) => {
      return image !== cloneImages[index];
    });

    setAdditionalImages(updatedImages);
    setnewProductInfos((prevInfos) => ({
      ...prevInfos,
      additional_images: updatedImages,
    }));
    console.log(updatedImages);
  };

  const handleMakeIt_MainImage = (index) => {
    const cloneImages = [...additionalImages];
    const mainImage = cloneImages[index];

    alertify
      .confirm(
        " تغيير الصورة الرئيسية",
        "هل تريد تعيين هذه الصورة كصورة رئيسية؟",
        function () {
          setProductMainImage(mainImage);
          setnewProductInfos((prevInfos) => ({
            ...prevInfos,
            Image: mainImage,
          }));
          alertify.success("تم تغيير الصورة الرئيسية بنجاح");
        },
        function () {
          return;
        }
      )
      .set({
        labels: {
          ok: "نعم",
          cancel: "إلغاء",
        },
        defaultFocus: "cancel",
        reverseButtons: true,
      });
  };

  const handleChangeCategory = (e) => {
    const category = e.target.value;
    const newCategory = category;

    setNewCategory(newCategory);
  };

  //!!! handle the the validation on the product
  const validateProductData = (productData) => {
    // التحقق من الحقول الإلزامية
    if (!productData.name || productData.name.trim() === "") {
      alertify.error("يرجى إدخال اسم المنتج");
      return false;
    }

    if (!productData.price || productData.price <= 0) {
      alertify.error("يرجى إدخال سعر صالح للمنتج");
      return false;
    }

    if (!productData.Stock || productData.Stock < 0) {
      alertify.error("يرجى إدخال قيمة صالحة للمخزون");
      return false;
    }

    if (!productData.category || productData.category.trim() === "") {
      alertify.error("يرجى اختيار فئة للمنتج");
      return false;
    }

    // التحقق من الصورة الرئيسية
    if (!productData.Image || productData.Image === "") {
      alertify.error("يرجى إضافة صورة رئيسية للمنتج");
      return false;
    }

    if (
      !productData.additional_images ||
      productData.additional_images.length === 0
    ) {
      alertify.error("يرجى إضافة صورة رئيسية للمنتج");
      return false
    }

    // يمكنك إضافة المزيد من قواعد التحقق حسب احتياجاتك

    return true;
  };

  const handleSaveProduct_Backend = async() => {
    const finalProductData = formatProductData({
      ...productDetails,
      ...newProductInfos,
      Image: productMainImage.startsWith("/")
        ? productMainImage.substring(1)
        : productMainImage,
      category: newCategory || productDetails.category,
      additional_images: additionalImages,
    });

    console.log("Final product data to save:", finalProductData);

    

    if (!validateProductData(finalProductData)) {
      return; // إذا فشل التحقق، توقف عن الاستمرار
    }



    try {
      // إرسال البيانات إلى Supabase
      const { data, error } = await supabase
        .from("products")
        .update({
          name: finalProductData.name,
          description: finalProductData.description,
          price: finalProductData.price,
          OldPrice: finalProductData.OldPrice,
          Stock: finalProductData.Stock,
          category: finalProductData.category,
          Image: finalProductData.Image,
          additional_images: finalProductData.additional_images,
        })
        .eq("id", id);
  
      if (error) {
        console.error("Error updating product:", error);
        alertify.error("حدث خطأ أثناء تحديث المنتج");
        return;
      }
  
      alertify.success("تم حفظ المنتج بنجاح");
      // يمكنك إضافة إعادة توجيه إلى صفحة المنتجات هنا إذا كنت ترغب في ذلك
    } catch (error) {
      console.error("Exception:", error);
      alertify.error("حدث خطأ غير متوقع");
    }

    // هنا يمكنك إرسال البيانات إلى الخادم
    // saveProductToDatabase(finalProductData);

    alertify.success("تم حفظ المنتج بنجاح");
  };



  const formatProductData = (productData) => {
    return {
      ...productData,
      price: parseFloat(productData.price) || 0,
      OldPrice: parseFloat(productData.OldPrice) || 0,
      Stock: parseInt(productData.Stock) || 0,
      name: productData.name.trim(),
      description: productData.description ? productData.description.trim() : ""
    };
  };



  const handleSaveProduct = () => {
    alertify.alert(
      function () {
        alertify.message("تم حفظ المنتج بنجاح");
      },
      function () {}
    );
  };

  return (
    <>
      {thisPage_Loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>{loadingText}</p>
        </div>
      ) : (
        // { the main component here}
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
              <button
                type="submit"
                className="pep-btn pep-btn-save"
                onClick={handleSaveProduct_Backend}
              >
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
                        value={newProductInfos.name || ""}
                        name="name"
                        onChange={handleInfosChange}
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
                      value={
                        newProductInfos.description !== undefined
                          ? newProductInfos.description
                          : productDetails.description || ""
                      }
                      name="description"
                      onChange={handleInfosChange}
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
                          value={
                            newProductInfos.price !== undefined
                              ? newProductInfos.price
                              : productDetails.price || ""
                          }
                          name="price"
                          onChange={handleInfosChange}
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
                          value={
                            newProductInfos.OldPrice !== undefined
                              ? newProductInfos.OldPrice
                              : productDetails.OldPrice || ""
                          }
                          name="OldPrice"
                          onChange={handleInfosChange}
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
                        value={
                          newProductInfos.Stock !== undefined
                            ? newProductInfos.Stock
                            : productDetails.Stock || ""
                        }
                        name="Stock"
                        onChange={handleInfosChange}
                      />
                    </div>

                    <div className="pep-form-group">
                      <label
                        htmlFor="pep-product-category"
                        className="pep-label"
                      >
                        فئة المنتج
                      </label>
                      <select
                        id="pep-product-category"
                        className="pep-select"
                        onChange={(e) => handleChangeCategory(e)}
                        value={newCategory || productDetails.category}
                      >
                        {categories.length > 0 &&
                          categories.map((category, i) => {
                            return (
                              <option key={i} value={category}>
                                {category}
                              </option>
                            );
                          })}
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
                          accept="image/*"
                          onChange={handleMainImageUpload}
                        />
                      </div>
                    </div>

                    {/* خطأ: setUploadError.length يجب أن يكون uploadError.length */}
                    {uploadError.length ? (
                      <span className="upload-error">{uploadError}</span>
                    ) : null}
                  </div>

                  <div className="pep-image-gallery" id="mainImg-container">
                    <div className="pep-image-item main-img">
                      <div className="pep-image-preview">
                        <img
                          src={
                            productMainImage ||
                            (Object.keys(productDetails).length > 0
                              ? productDetails.Image
                              : "")
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
                          onChange={handleAdditionalImagesUpload}
                        />
                      </div>
                      {additionalImagesError.length ? (
                        <span className="upload-error">
                          {" "}
                          {additionalImagesError}{" "}
                        </span>
                      ) : (
                        <div></div>
                      )}
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
                                  onClick={() => handleDeleteAdditionalImage(i)}
                                >
                                  <BsTrash3 className="pep-icon-trash" />
                                </button>
                                <button
                                  type="button"
                                  className="pep-image-btn pep-image-btn-main"
                                  onClick={() => handleMakeIt_MainImage(i)}
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
      )}
    </>
  );
};

export default ProductEditPage;
