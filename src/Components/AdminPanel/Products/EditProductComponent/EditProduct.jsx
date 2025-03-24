/* eslint-disable react/display-name */
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./EditProduct.css";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../../../../supabaseClient";
import { ImImages } from "react-icons/im";
import {
  FaCheckCircle,
  FaPlusCircle,
  FaRegTrashAlt,
  FaTrash,
} from "react-icons/fa";
import { BsTrash3 } from "react-icons/bs";
import alertify from "alertifyjs";
import { useAdminGlobalContext } from "../../AdminGlobalContext";
import { useGlobalContext } from "../../../../Context/GlobalContext";

const ProductEditPage = ({ isAddProduct }) => {
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState({});
  const [thisPage_Loading, setThisPageLoading] = useState(true);
  const [productMainImage, setProductMainImage] = useState("");
  const [additionalImages, setAdditionalImages] = useState([]);
  const [loadingText, setLoadingText] = useState(
    "جارٍ تحميل الصفحة، يرجى الانتظار..."
  );
  const productNameRef = useRef(null);
  const [newProductInfos, setnewProductInfos] = useState({});
  const [uploadError, setUploadError] = useState("");
  const [additionalImagesError, setadditionalImagesError] = useState("");
  const [deleteOldImages, setdeleteOldImages] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const { productsData } = useAdminGlobalContext();
  const navigate = useNavigate();
  const settingsText = ["المعلومات الأساسية", "التصنيفات", "الصور"];
  const [SettingIndex, setSettingIndex] = useState(0);
  const categoryRef = useRef(null);
  const ImagesRef = useRef(null);

  const fetchProductDetails_Edit = async () => {
    if (!isAddProduct && id) {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id);

      if (data && data.length) {
        setProductDetails(data[0]);
        console.log(data);
      }
    }
  };

  // !!! Handle the logic of: if the user adds a Product not changes the product
  const handleAddProductLogic_emptyEditProduct = () => {
    if (isAddProduct) {
      const emptyProduct = {
        name: "",
        description: "",
        price: 0,
        OldPrice: 0,
        Stock: 0,
        category: "",
        Image: "",
        additional_images: [],
        isExpressCheckoutEnabled: false,
        quantity: 1,
        Rating: 0,
        ReviewsCount: 0,
      };

      setProductDetails(emptyProduct);
      setnewProductInfos(emptyProduct);
      setThisPageLoading(false);
    }
  };

  // !!! use layout effect to handle isAddProduct
  useLayoutEffect(() => {
    handleAddProductLogic_emptyEditProduct();
  }, [isAddProduct]);

  // !!! fetch product ccategories and make them unique
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("category");

      if (data) {
        const allCategories = data.map((item) => item.category);
        const uniqueCategories = [...new Set(allCategories)].filter(Boolean);
        setCategories(uniqueCategories);
        console.log("Categories fetched:", uniqueCategories);
      }

      if (error) {
        console.log("Category error", error);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    if (!isAddProduct) {
      fetchProductDetails_Edit();
    }
    fetchCategories();
  }, [isAddProduct, id]);

  useEffect(() => {
    if (!thisPage_Loading && productNameRef.current) {
      productNameRef.current.focus();
    }
  }, [thisPage_Loading]);

  useEffect(() => {
    if (!isAddProduct) {
      setTimeout(() => {
        setThisPageLoading(false);
      }, 3000);
    }

    if (
      Object.keys(productDetails).length > 0 &&
      !isAddProduct &&
      Object.keys(newProductInfos).length === 0
    ) {
      // Initialize newProductInfos with productDetails values
      setnewProductInfos({
        name: productDetails.name || "",
        description: productDetails.description || "",
        price: productDetails.price || 0,
        OldPrice: productDetails.OldPrice || 0,
        Stock: productDetails.Stock || 0,
        category: productDetails.category || "",
        Image: productDetails.Image || "",
        additional_images: productDetails.additional_images || [],
        isExpressCheckoutEnabled:
          productDetails.isExpressCheckoutEnabled || false,
      });

      setProductMainImage(productDetails.Image || "");
      setAdditionalImages(productDetails.additional_images || []);
      setNewCategory(productDetails.category || "");
    }
  }, [productDetails, isAddProduct]);

  // !!! the logic of change product infos when user write somthing
  const handleInfosChange = (e) => {
    const { name, value } = e.target;

    if (name === "price" || name === "OldPrice" || name === "Stock") {
      setnewProductInfos((prevInfos) => ({
        ...prevInfos,
        [name]: value === "" ? 0 : parseFloat(value),
      }));
    } else {
      setnewProductInfos((prevInfos) => ({
        ...prevInfos,
        [name]: value,
      }));
    }
  };

  // !!! function to upload the main imageof the product
  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];

    if (
      file &&
      (file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/webp")
    ) {
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("حجم الصورة يجب أن يكون أقل من 5 ميغابايت");
        return;
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

  // !!! function to handle the logic of add additional images
  const handleAdditionalImagesUpload = (e) => {
    const files = e.target.files;
    const validImages = [];

    if (files) {
      for (let index = 0; index < files.length; index++) {
        const image = files[index];
        if (
          image.type === "image/png" ||
          image.type === "image/jpeg" ||
          image.type === "image/webp"
        ) {
          if (image.size <= 5 * 1024 * 1024) {
            validImages.push(image);
          } else {
            setadditionalImagesError(
              "حجم الصورة يجب أن يكون أقل من 5 ميغابايت"
            );
          }
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

      Promise.all(finalImages).then((results) => {
        const newImages = [...additionalImages, ...results];
        setAdditionalImages(newImages);
        setnewProductInfos((prev) => ({
          ...prev,
          additional_images: newImages,
        }));
      });
    }
  };

  // !!! delete additional images function
  const handleDeleteAdditionalImage = (index) => {
    const updatedImages = additionalImages.filter((_, i) => i !== index);

    setAdditionalImages(updatedImages);
    setnewProductInfos((prevInfos) => ({
      ...prevInfos,
      additional_images: updatedImages,
    }));
  };

  // !!! handle the logic of make an aditional image main imagge
  const handleMakeIt_MainImage = (index) => {
    const mainImage = additionalImages[index];

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
        rtl: true,
      });
  };

  const handleChangeCategory = (e) => {
    const category = e.target.value;
    setNewCategory(category);
    setnewProductInfos((prev) => ({
      ...prev,
      category: category,
    }));
  };

  // !!! validate the product data, before send it to the database && get the input that has the error
  const validateProductData = (productData) => {
    // Check required fields
    if (!productData.name || productData.name.trim() === "") {
      alertify.error("يرجى إدخال اسم المنتج");
      return false;
    }

    if (!productData.price || productData.price <= 0) {
      alertify.error("يرجى إدخال سعر صالح للمنتج");
      return false;
    }

    if (productData.Stock === undefined || productData.Stock < 0) {
      alertify.error("يرجى إدخال قيمة صالحة للمخزون");
      return false;
    }

    if (!productData.category || productData.category.trim() === "") {
      alertify.error("يرجى اختيار فئة للمنتج");
      return false;
    }

    // Check main image
    if (!productData.Image || productData.Image === "") {
      alertify.error("يرجى إضافة صورة رئيسية للمنتج");
      return false;
    }

    return true;
  };

  // !!! main function of save product infos and send the product into supabase backend
  const handleSaveProduct_Backend = async () => {
    // Combine product details with new info
    const combinedData = {
      ...(isAddProduct ? {} : productDetails),
      ...newProductInfos,
      Image: productMainImage,
      category: newCategory || newProductInfos.category,
      additional_images: additionalImages,
      createdAt: isAddProduct
        ? new Date().toISOString()
        : productDetails.createdAt,
    };

    if (isAddProduct && combinedData.id) {
      delete combinedData.id;
    }

    const finalProductData = formatProductData(combinedData);

    console.log("Final product data to save:", finalProductData);

    if (!validateProductData(finalProductData)) {
      return;
    }

    try {
      if (!isAddProduct) {
        // Update existing product
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

        alertify.success("تم تحديث المنتج بنجاح");
      } else {
        // Add new product - make sure we're not sending an ID
        const productToInsert = { ...finalProductData };
        if (productToInsert.id) {
          delete productToInsert.id; // Remove ID to let the database generate one
        }

        const { data, error } = await supabase
          .from("products")
          .insert([productToInsert]);

        if (error) {
          console.error("Error adding product:", error);
          alertify.error("حدث خطأ أثناء إضافة المنتج: " + error.message);
          return;
        }

        alertify.success("تم إضافة المنتج بنجاح");
        console.log("Added product data:", data);

        // Clear the form after successful addition
        if (isAddProduct) {
          const emptyProduct = {
            name: "",
            description: "",
            price: 0,
            OldPrice: 0,
            Stock: 0,
            category: "",
            Image: "",
            additional_images: [],
            isExpressCheckoutEnabled: false,
          };
          setProductMainImage("");
          setAdditionalImages([]);
          setnewProductInfos(emptyProduct);
          setNewCategory("");
        }
      }

      new Promise((resolve) => {
        setTimeout(() => {
          resolve(navigate("/admin/products"));
        }, 2000);
      });
    } catch (error) {
      console.error("Exception:", error);
      alertify.error("حدث خطأ غير متوقع");
    }
  };

  // !!! function to format data ( toggle between add product logic && edit product logic )
  const formatProductData = (productData) => {
    return {
      ...productData,
      price: parseFloat(productData.price) || 0,
      OldPrice: parseFloat(productData.OldPrice) || 0,
      Stock: parseInt(productData.Stock) || 0,
      name: productData.name ? productData.name.trim() : "",
      description: productData.description
        ? productData.description.trim()
        : "",
    };
  };

  const handlePrametersClick = (index) => {
    setSettingIndex(index);

    const sections = [productNameRef, categoryRef, ImagesRef];

    sections.forEach((item, i) => {
      if (i === index) {
        item.current.focus();

        if (sections[i] && sections[i].current) {
          sections[i].current.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }
    });
  };

  return (
    <>
      {thisPage_Loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>{loadingText}</p>
        </div>
      ) : (
        <div className="pep-container">
          <div className="pep-header">
            <div className="pep-header-content">
              <h1 className="pep-title">
                {isAddProduct ? "إضافة منتج جديد" : "تحرير المنتج"}
              </h1>
              <p className="pep-subtitle">
                {isAddProduct
                  ? "قم بإضافة تفاصيل المنتج الجديد من هنا"
                  : "قم بتحديث تفاصيل المنتج من هنا"}
              </p>
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
                {isAddProduct ? (
                  <>
                    <FaPlusCircle /> إضافة المنتج
                  </>
                ) : (
                  <>
                    <FaCheckCircle /> حفظ التغييرات
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="pep-content">
            <div className="pep-sidebar">
              <div className="pep-nav">
                {settingsText.map((text, index) => {
                  return (
                    <div
                      className={`pep-nav-item ${
                        SettingIndex == index ? "pep-nav-item-active" : ""
                      }`}
                      onClick={() => handlePrametersClick(index)}
                      key={index}
                    >
                      <span className="pep-nav-icon">
                        {(index === 0 && <i className="pep-icon-info"></i>) ||
                          (index === 1 && <i className="pep-icon-image"></i>) ||
                          (index === 2 && <i className="pep-icon-tag"></i>)}
                      </span>
                      <span className="pep-nav-text"> {text} </span>
                    </div>
                  );
                })}
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
                      value={newProductInfos.description || ""}
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
                          value={newProductInfos.price || ""}
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
                          value={newProductInfos.OldPrice || ""}
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
                        value={newProductInfos.Stock || ""}
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
                        onChange={handleChangeCategory}
                        value={newCategory || newProductInfos.category || ""}
                        ref={categoryRef}
                      >
                        <option value="">اختر فئة</option>
                        {categories.length > 0 &&
                          categories.map((category, i) => (
                            <option key={i} value={category}>
                              {category}
                            </option>
                          ))}
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
                          ref={ImagesRef}
                        />
                      </div>
                    </div>

                    {uploadError && (
                      <span className="upload-error">{uploadError}</span>
                    )}
                  </div>

                  {productMainImage && (
                    <div className="pep-image-gallery" id="mainImg-container">
                      <div className="pep-image-item main-img">
                        <div className="pep-image-preview">
                          <img src={productMainImage} alt="معاينة الصورة" />
                        </div>
                      </div>
                    </div>
                  )}

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
                      {additionalImagesError && (
                        <span className="upload-error">
                          {additionalImagesError}
                        </span>
                      )}
                    </div>

                    <div className="pep-image-gallery">
                      {additionalImages &&
                        additionalImages.length > 0 &&
                        additionalImages.map((subImg, i) => (
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
                        ))}
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
