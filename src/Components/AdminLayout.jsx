import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import supabase from "../supabaseClient";

const AdminLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: userData } = await supabase
            .from("users")
            .select("role")
            .eq("email", user.email)
            .single();

          setIsAuthenticated(userData?.role === "admin");
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setIsAuthenticated(false);
      } else if (event === "SIGNED_IN" && session) {
        const { data: userData } = await supabase
          .from("users")
          .select("role")
          .eq("email", session.user.email)
          .single();

        setIsAuthenticated(userData?.role === "admin");
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="admin-loading-spinner"></div>
        <p>جاري التحقق من الصلاحيات...</p>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminLayout;
