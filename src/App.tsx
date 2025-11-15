import { useState, useEffect } from "react";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { AuthScreen } from "./components/AuthScreen";
import { StudentHome } from "./components/StudentHome";
import { VendorDetail } from "./components/VendorDetail";
import { OrderPlacement } from "./components/OrderPlacement";
import { OrderTracking } from "./components/OrderTracking";
import { VendorDashboard } from "./components/VendorDashboard";
import { ProfileManagement } from "./components/ProfileManagement";
import { VendorOnboarding } from "./components/VendorOnboarding";
import { AdminUsersDashboard } from "./components/AdminUsersDashboard";
import { ThemeProvider } from "./contexts/ThemeContext";
import type { UserRole, Vendor } from "./types";
import { supabase } from "./utils/supabase/client";

type Screen = 
  | "welcome" 
  | "auth" 
  | "student-home" 
  | "vendor-detail" 
  | "order-placement" 
  | "order-tracking"
  | "vendor-dashboard"
  | "profile"
  | "vendor-onboarding"
  | "admin-users";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    checkExistingSession();
    
    // Add keyboard shortcut to access vendor onboarding (Ctrl+Shift+V)
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'V') {
        setShowAdminPanel(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const checkExistingSession = async () => {
    const storedToken = localStorage.getItem("access_token");
    const storedUserId = localStorage.getItem("user_id");
    const storedRole = localStorage.getItem("user_role") as UserRole;

    if (storedToken && storedUserId && storedRole) {
      try {
        const { data, error } = await supabase.auth.getUser(storedToken);
        if (!error && data.user) {
          setUserId(storedUserId);
          setUserRole(storedRole);
          setCurrentScreen(storedRole === "vendor" ? "vendor-dashboard" : "student-home");
        } else {
          // Invalid session, clear storage
          handleLogout();
        }
      } catch (error) {
        console.error("Session check failed:", error);
        handleLogout();
      }
    }
  };

  const handleAuthSuccess = (id: string, role: UserRole) => {
    setUserId(id);
    setUserRole(role);
    
    if (role === "vendor") {
      setCurrentScreen("vendor-dashboard");
    } else {
      setCurrentScreen("student-home");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_role");
    setUserId(null);
    setUserRole(null);
    setSelectedVendor(null);
    setCurrentScreen("welcome");
    supabase.auth.signOut();
  };

  const handleVendorSelect = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setCurrentScreen("vendor-detail");
  };

  const handlePlaceOrder = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setCurrentScreen("order-placement");
  };

  const handleOrderSuccess = () => {
    setCurrentScreen("order-tracking");
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        {/* Floating Admin Access Button - Shows on all screens */}
        <button
          onClick={() => setShowAdminPanel(true)}
          className="fixed bottom-4 right-4 z-40 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
          title="Add Vendor (or press Ctrl+Shift+V)"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>

        {/* Admin Panel Overlay - Access with Ctrl+Shift+V or click floating button */}
        {showAdminPanel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
              <VendorOnboarding 
                onComplete={() => {
                  setShowAdminPanel(false);
                  // Optionally refresh vendors list or navigate somewhere
                }} 
              />
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  💡 Tip: Press <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+Shift+V</kbd> to toggle this panel anytime
                </p>
                <button
                  onClick={() => setShowAdminPanel(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg"
                >
                  Close Admin Panel
                </button>
              </div>
            </div>
          </div>
        )}

        {currentScreen === "welcome" && (
          <WelcomeScreen 
            onGetStarted={() => setCurrentScreen("auth")} 
            onAdminAccess={() => setShowAdminPanel(true)}
            onViewUsers={() => setCurrentScreen("admin-users")}
          />
        )}

        {currentScreen === "auth" && (
          <AuthScreen
            onBack={() => setCurrentScreen("welcome")}
            onAuthSuccess={handleAuthSuccess}
          />
        )}

        {currentScreen === "student-home" && userId && (
          <StudentHome
            userId={userId}
            onVendorSelect={handleVendorSelect}
            onViewOrders={() => setCurrentScreen("order-tracking")}
            onViewProfile={() => setCurrentScreen("profile")}
            onLogout={handleLogout}
          />
        )}

        {currentScreen === "vendor-detail" && selectedVendor && (
          <VendorDetail
            vendor={selectedVendor}
            onBack={() => setCurrentScreen("student-home")}
            onPlaceOrder={handlePlaceOrder}
          />
        )}

        {currentScreen === "order-placement" && selectedVendor && userId && (
          <OrderPlacement
            vendor={selectedVendor}
            onBack={() => setCurrentScreen("vendor-detail")}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {currentScreen === "order-tracking" && userId && (
          <OrderTracking
            userId={userId}
            onBack={() => setCurrentScreen("student-home")}
          />
        )}

        {currentScreen === "vendor-dashboard" && userId && (
          <VendorDashboard
            userId={userId}
            onLogout={handleLogout}
          />
        )}

        {currentScreen === "profile" && userId && (
          <ProfileManagement
            userId={userId}
            onBack={() => setCurrentScreen("student-home")}
          />
        )}

        {currentScreen === "vendor-onboarding" && userId && (
          <VendorOnboarding
            userId={userId}
            onBack={() => setCurrentScreen("vendor-dashboard")}
          />
        )}

        {currentScreen === "admin-users" && (
          <AdminUsersDashboard
            onClose={() => setCurrentScreen("welcome")}
          />
        )}
      </div>
    </ThemeProvider>
  );
}