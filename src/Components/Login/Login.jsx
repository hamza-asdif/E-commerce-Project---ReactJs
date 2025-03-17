import React, { useEffect, useRef, useState } from "react";
import "./Login.css";
import { GrFormViewHide } from "react-icons/gr";
import { BiShowAlt } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import alertify from "alertifyjs";

const Login = ({ isRegisterForm }) => {
  const [loading, setLoading] = useState(true);
  const [loading_Btn, setLoadingBtn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (passwordRef.current) {
      passwordRef.current.type = showPassword ? "text" : "password";
    }
  }, [showPassword]);

  const handleInput = (e) => {
    const inpName = e.target.name;
    const inpValue = e.target.value;

    if (inpName === "InputEmail" && inpValue.includes("@")) {
      setEmail(inpValue);
    } else if (inpName === "InputPassword" && inpValue.length >= 6) {
      setPassword(inpValue);
    }
  };

  const checkIfAdmin = async (userEmail) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("email", userEmail)
        .single();

      if (error) {
        console.error("❌ خطأ في جلب بيانات المستخدم:", error.message);
        return false;
      } else {
        if (data && data.role === "admin") {
          console.log("مرحبًا Admin! سيتم توجيهك إلى لوحة التحكم");
        }
      }

      return data.role === "admin";
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const handleLogin = async (e, email, password) => {
    setLoadingBtn(true);
    e.preventDefault();
    try {
      const { data: user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("خطأ في تسجيل الدخول:", error.message);
        alertify.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        return;
      }

      const admin = await checkIfAdmin(email);
      setTimeout(() => {
        setLoadingBtn(true);
      }, 1000);
      if (admin) {
        console.log("مرحبًا Admin! سيتم توجيهك إلى لوحة التحكم");
        alertify.success("تم تسجيل الدخول بنجاح!");
        navigate("/admin");
      } else {
        alertify.warning("أنت لست Admin.");
      }
    } catch (err) {
      console.error("خطأ غير متوقع:", err);
      alertify.error("حدث خطأ غير متوقع أثناء محاولة تسجيل الدخول.");
    }
  };

  const handlePasswordToggle = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLoading_Btn = () => {
    if (loading_Btn) return <div className="loader"></div>;
    return isRegisterForm ? "إنشاء حساب" : "تسجيل الدخول";
  };

  const resetInputs = () => {
    emailRef.current.value = "";
    passwordRef.current.value = "";
    setEmail("");
    setPassword("");
    setShowPassword(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>
          {isRegisterForm
            ? "جاري تحميل صفحة إنشاء الحساب..."
            : "جاري تحميل صفحة تسجيل الدخول..."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="login-wrapper">
        <div className="login-container">
          <h2>{isRegisterForm ? "إنشاء حساب جديد" : "تسجيل الدخول"}</h2>

          <form
            className="login-form"
            onSubmit={(e) => handleLogin(e, email, password)}
          >
            {isRegisterForm && (
              <div className="form-group">
                <label htmlFor="fullName">الاسم الكامل:</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="أدخل اسمك الكامل"
                  required
                />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="email">البريد الإلكتروني:</label>
              <input
                type="email"
                id="email"
                name="InputEmail"
                ref={emailRef}
                placeholder="أدخل بريدك الإلكتروني"
                required
                onChange={handleInput}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">كلمة المرور:</label>
              <div className="password-box">
                <input
                  type="password"
                  id="password"
                  name="InputPassword"
                  defaultValue={password}
                  placeholder="أدخل كلمة المرور"
                  required
                  ref={passwordRef}
                  onChange={handleInput}
                />
                <div
                  className="password-icon-box"
                  onClick={handlePasswordToggle}
                >
                  {showPassword ? (
                    <BiShowAlt className="password-icon" />
                  ) : (
                    <GrFormViewHide className="password-icon" />
                  )}
                </div>
              </div>
            </div>
            <button type="submit" className="submit-button">
              {handleLoading_Btn()}
            </button>
          </form>
          <p className="signup-link">
            {isRegisterForm ? (
              <>
                لديك حساب بالفعل؟ <Link to="/login">تسجيل الدخول</Link>
              </>
            ) : (
              <>
                ليس لديك حساب؟ <Link to="/register">أنشئ حسابًا جديدًا</Link>
              </>
            )}
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
