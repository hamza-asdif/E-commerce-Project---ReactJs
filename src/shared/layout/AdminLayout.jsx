import { useEffect, useState, useCallback } from "react";
import { Navigate, Outlet } from "react-router-dom";
import supabase from "../../lib/supabaseClient";
import alertify from "alertifyjs";

const ADMIN_CACHE_KEY = "admin_role_cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const AdminLayout = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,
  });

  // Check if user is admin with caching
  const checkAdminRole = useCallback(async (user) => {
    if (!user?.email) return false;

    // Check cache first
    const cachedData = localStorage.getItem(ADMIN_CACHE_KEY);
    if (cachedData) {
      const { email, isAdmin, timestamp } = JSON.parse(cachedData);
      if (email === user.email && Date.now() - timestamp < CACHE_DURATION) {
        return isAdmin;
      }
    }

    try {
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("email", user.email)
        .single();

      if (error) throw error;

      const isAdmin = data?.role === "admin";

      // Cache the result
      localStorage.setItem(
        ADMIN_CACHE_KEY,
        JSON.stringify({
          email: user.email,
          isAdmin,
          timestamp: Date.now(),
        })
      );

      return isAdmin;
    } catch (error) {
      alertify.error("فشل التحقق من صلاحيات المسؤول");
      return false;
    }
  }, []);

  // Initialize and manage auth state
  useEffect(() => {
    let mounted = true;
    let retryTimeout = null;

    const initializeAuth = async (retryCount = 0) => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const { data: userData } = await supabase.auth.getUser();

        if (!mounted) return;

        if (!sessionData.session || !userData.user) {
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            error: null,
          });
          return;
        }

        const isAdmin = await checkAdminRole(userData.user);

        if (!mounted) return;

        if (!isAdmin) {
          alertify.error("ليس لديك صلاحية الوصول إلى لوحة التحكم");
        }

        setAuthState({
          isAuthenticated: isAdmin,
          isLoading: false,
          user: userData.user,
          error: null,
        });
      } catch (error) {
        if (!mounted) return;

        // Retry up to 3 times with exponential backoff
        if (retryCount < 3) {
          retryTimeout = setTimeout(
            () => {
              initializeAuth(retryCount + 1);
            },
            Math.pow(2, retryCount) * 1000
          );
        } else {
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            error: "Failed to initialize authentication",
          });
        }
      }
    };

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === "SIGNED_OUT") {
          localStorage.removeItem(ADMIN_CACHE_KEY);
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            error: null,
          });
        } else if (event === "SIGNED_IN" && session) {
          initializeAuth();
        }
      }
    );

    initializeAuth();

    // Cleanup
    return () => {
      mounted = false;
      if (retryTimeout) clearTimeout(retryTimeout);
      authListener.subscription?.unsubscribe();
    };
  }, [checkAdminRole]);

  // Show loading state
  if (authState.isLoading) {
    return (
      <div className="admin-auth-loading">
        <div className="spinner"></div>
        <p>جاري التحقق من الصلاحيات...</p>
        {authState.error && <p className="error-message">{authState.error}</p>}
        <style>{`
          .admin-auth-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background-color: #f8f9fa;
          }
          .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-left: 4px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          .error-message {
            color: #dc3545;
            margin-top: 10px;
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated and is an admin
  return <Outlet />;
};

export default AdminLayout;
