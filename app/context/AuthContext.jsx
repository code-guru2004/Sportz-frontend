// app/context/AuthContext.jsx (Updated with cookie storage)
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from 'js-cookie';

const API_BASE_URL = "http://localhost:5000/api";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const router = useRouter();

  // Set up axios interceptor for token
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = accessToken || Cookies.get("accessToken");
  
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
  
        return config;
      },
      (error) => Promise.reject(error)
    );
  
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
    
      async (error) => {
        const originalRequest = error.config;
    
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url.includes("/auth/refresh-token")
        ) {
          originalRequest._retry = true;
    
          try {
            const refreshResponse = await axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh-token`,
              {},
              { withCredentials: true }
            );
    
            if (refreshResponse.data.success) {
              const newAccessToken = refreshResponse.data.accessToken;
    
              setAccessToken(newAccessToken);
    
              Cookies.set("accessToken", newAccessToken, {
                expires: 1 / 96,
                path: "/",
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
              });
    
              originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;
    
              return axios(originalRequest);
            }
          } catch (refreshError) {
            setUser(null);
            setProfile(null);
            setAccessToken(null);
    
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
    
            router.push("/login");
    
            return Promise.reject(refreshError);
          }
        }
    
        return Promise.reject(error);
      }
    );
  
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
   // console.log("========== CHECK AUTH START ==========");
  
    try {
      const refreshToken = Cookies.get("refreshToken");
      const accessTokenFromCookie = Cookies.get("accessToken");
  
      // console.log("Access Token:", accessTokenFromCookie ? "EXISTS" : "MISSING");
      // console.log("Refresh Token:", refreshToken ? "EXISTS" : "MISSING");
  
      if (!accessTokenFromCookie) {
        try {
          console.log("Trying refresh because access token missing");
      
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh-token`,
            {},
            { withCredentials: true }
          );
      
          
      
          if (response.data.success) {
            const newAccessToken = response.data.accessToken;
      
            setAccessToken(newAccessToken);
      
            Cookies.set("accessToken", newAccessToken, {
              expires: 1 / 96,
              path: "/",
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
            });
          }
        } catch (error) {
          console.log("Refresh failed");
          setLoading(false);
          return;
        }
      }
  
      if (accessTokenFromCookie) {

        try {
          const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${accessTokenFromCookie}`,
            },
            withCredentials: true,
          });
  
        
          if (userResponse.data.success) {
            setAccessToken(accessTokenFromCookie);
            setUser(userResponse.data.user);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.log("/auth/me failed:", error.response?.data || error.message);
        }
      }
  
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh-token`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        const newAccessToken = response.data.accessToken;
  
 
        setAccessToken(newAccessToken);
  
        Cookies.set("accessToken", newAccessToken, {
          expires: 1 / 96,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
  
        const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
          withCredentials: true,
        });
  
        
        if (userResponse.data.success) {
          setUser(userResponse.data.user);

          redirectToDashboard(userResponse.data.user.role);
        }
      }
    } catch (error) {

      console.error(error.response?.data || error.message);
  
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
     // console.log("Registering user with data:", userData);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, userData, {
        withCredentials: true,
      });

      if (response.data.success) {
        sessionStorage.setItem("pendingVerificationEmail", userData.email);
        return { success: true, data: response.data };
      }
      
      return { success: false, error: response.data.message };
    } catch (error) {
      console.error("Register error:", error);
      return { 
        success: false, 
        error: error.response?.data?.message || "Registration failed" 
      };
    }
  };

  const verifyEmail = async (email, otp) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-email`, { email, otp }, {
        withCredentials: true,
      });

      if (response.data.success) {
        sessionStorage.removeItem("pendingVerificationEmail");
        return { success: true, data: response.data };
      }
      
      return { success: false, error: response.data.message };
    } catch (error) {
      console.error("Verify email error:", error);
      return { 
        success: false, 
        error: error.response?.data?.message || "Verification failed" 
      };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, { email, password }, {
        withCredentials: true,
      });

      if (response.data.success) {
        console.log("Login successful:", response.data);
        
        // Store access token in cookie
        Cookies.set('accessToken', response.data.accessToken, { 
          expires: 1/96, // 15 minutes
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
        
        setAccessToken(response.data.accessToken);
        setUser(response.data.user);
        
        //console.log("User role:", response.data.user.role);
        
        // Check profile completion status
        if (!response.data.user.profileCompleted) {
          router.push("/complete-profile");
        } else if (!response.data.user.approvalStatus || response.data.user.approvalStatus === "PENDING") {
          router.push("/waiting-approval");
        } else {
          // Redirect based on role
          //console.log("Redirecting to dashboard for role:", response.data.user.role);
          redirectToDashboard(response.data.user.role);
        }
        
        return { success: true, data: response.data };
      }
      
      return { success: false, error: response.data.message };
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        error: error.response?.data?.message || "Login failed" 
      };
    }
  };

  const redirectToDashboard = (role) => {
    switch(role) {
      case "ADMIN":
        router.push("/admin/dashboard");
        break;
      case "COACH":
        router.push("/coach/dashboard");
        break;
      case "ATHLETE":
        router.push("/athlete/dashboard");
        break;
      default:
        router.push("/dashboard");
    }
  };

// app/context/AuthContext.jsx (Update completeProfile function)

const completeProfile = async (profileData) => {
  try {
    //console.log("Completing profile with data:", profileData);
    const token = accessToken || Cookies.get('accessToken');
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/complete`, profileData, {
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      withCredentials: true,
    });

    if (response.data.success) {
      setUser(prev => ({ ...prev, ...response.data.user, profileCompleted: true }));
      setProfile(response.data.profile);
      router.push("/waiting-approval");
      return { success: true, data: response.data };
    }
    
    return { success: false, error: response.data.message };
  } catch (error) {
    console.error("Complete profile error:", error);
    return { 
      success: false, 
      error: error.response?.data?.message || "Failed to complete profile" 
    };
  }
};

const getProfile = async () => {
  try {
    const token = accessToken || Cookies.get('accessToken');
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/me`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    if (response.data.success) {
      setProfile(response.data.profile);
      return { success: true, data: response.data.profile };
    }

    return { success: false, error: response.data.message };
  } catch (error) {
    console.error("Get profile error:", error);
    return { 
      success: false, 
      error: error.response?.data?.message || "Failed to fetch profile" 
    };
  }
};

  const logout = async () => {
    try {
      const token = accessToken || Cookies.get('accessToken');
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {}, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUser(null);
      setProfile(null);
      setAccessToken(null);
      
      // Remove cookies
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local state even if API call fails
      setUser(null);
      setProfile(null);
      setAccessToken(null);
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      router.push("/login");
    }
  };

  const value = {
    user,
    profile,
    loading,
    accessToken,
    register,
    verifyEmail,
    login,
    completeProfile,
    getProfile,
    logout,
    checkAuth,
    redirectToDashboard,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};