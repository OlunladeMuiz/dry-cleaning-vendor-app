import { useState } from "react";
import { EnhancedStudentHome } from "./EnhancedStudentHome";
import { StudyHub } from "./StudyHub";
import { EnhancedOrderTracking } from "./EnhancedOrderTracking";
import { EnhancedProfileManagement } from "./EnhancedProfileManagement";
import { BottomNav } from "./BottomNav";
import { TrinityLogo } from "./TrinityLogo";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import type { Vendor } from "../types";

interface StudentDashboardProps {
  userId: string;
  onVendorSelect: (vendor: Vendor) => void;
  onLogout: () => void;
}

export function StudentDashboard({ userId, onVendorSelect, onLogout }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<"home" | "study" | "orders" | "profile">("home");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      {/* Top Header - Only shown when not on home tab */}
      {activeTab !== "home" && (
        <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-20 shadow-sm overflow-x-hidden">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <TrinityLogo variant="full" size="md" />
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button variant="ghost" size="sm" onClick={onLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="pb-20 overflow-x-hidden">
        {activeTab === "home" && (
          <EnhancedStudentHome userId={userId} onVendorSelect={onVendorSelect} />
        )}
        {activeTab === "study" && <StudyHub />}
        {activeTab === "orders" && <EnhancedOrderTracking userId={userId} />}
        {activeTab === "profile" && <EnhancedProfileManagement userId={userId} />}
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}