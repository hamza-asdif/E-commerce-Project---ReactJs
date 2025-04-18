import React, { useEffect, useState } from "react";
import "./Login.css";
import { GrFormViewHide } from "react-icons/gr";
import { BiShowAlt } from "react-icons/bi";
import { FiUser } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import supabase from "../../supabaseClient";
import alertify from "alertifyjs";

const Login = () => {
  const [loading, setLoading] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const isAdmin = await checkIfAdmin(user.email);
          if (isAdmin) {
            navigate("/admin");
            return;
          }
        }
      } catch (error) {
        alertify.error("خطأ في التحقق من الجلسة");
      } finally {
        setLoading(false);
      }
    };

    checkExistingSession();
  }, [navigate]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === "InputEmail") {
      setEmail(value.trim());
    } else if (name === "InputPassword") {
      setPassword(value);
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
        alertify.error("خطأ في التحقق من صلاحيات المستخدم");
        return false;
      }

      return data?.role === "admin";
    } catch (err) {
      alertify.error("خطأ غير متوقع");
      return false;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoadingBtn(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alertify.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        return;
      }

      const isAdmin = await checkIfAdmin(email);
      if (!isAdmin) {
        await supabase.auth.signOut();
        alertify.error("عذراً، هذا الحساب ليس لديه صلاحيات الادمن");
        return;
      }

      localStorage.setItem(
        "adminSession",
        JSON.stringify({
          email: data.user.email,
          timestamp: new Date().getTime(),
        })
      );

      alertify.success("تم تسجيل الدخول بنجاح!");

      const from = location.state?.from?.pathname || "/admin";
      navigate(from, { replace: true });
    } catch (err) {
      alertify.error("حدث خطأ غير متوقع");
    } finally {
      setLoadingBtn(false);
    }
  };

  const handlePasswordToggle = () => {
    setShowPassword((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="admin-loading-spinner"></div>
        <p>جاري تحميل صفحة تسجيل الدخول...</p>
      </div>
    );
  }

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <FiUser className="admin-login-icon" />
          <h2>تسجيل دخول الادمن</h2>
          <p>قم بتسجيل الدخول للوصول إلى لوحة التحكم</p>
        </div>

        <form className="admin-login-form" onSubmit={handleLogin}>
          <div className="admin-form-group">
            <label htmlFor="email">البريد الإلكتروني:</label>
            <input
              type="email"
              id="email"
              name="InputEmail"
              placeholder="أدخل بريدك الإلكتروني"
              required
              onChange={handleInput}
              value={email}
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="password">كلمة المرور:</label>
            <div className="admin-password-box">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="InputPassword"
                placeholder="أدخل كلمة المرور"
                required
                onChange={handleInput}
                value={password}
              />
              <button
                type="button"
                className="admin-password-toggle"
                onClick={handlePasswordToggle}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <BiShowAlt className="admin-password-icon" />
                ) : (
                  <GrFormViewHide className="admin-password-icon" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="admin-submit-button"
            disabled={loadingBtn}
          >
            {loadingBtn ? (
              <div className="admin-button-loader"></div>
            ) : (
              "تسجيل الدخول"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
