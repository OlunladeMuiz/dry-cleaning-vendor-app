import { Home, BookOpen, Package, User } from "lucide-react";

interface BottomNavProps {
  activeTab: "home" | "study" | "orders" | "profile";
  onTabChange: (tab: "home" | "study" | "orders" | "profile") => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: "home" as const, label: "Home", icon: Home },
    { id: "study" as const, label: "Study", icon: BookOpen },
    { id: "orders" as const, label: "Orders", icon: Package },
    { id: "profile" as const, label: "Profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t-2 dark:border-gray-700 shadow-lg z-50 safe-area-inset-bottom">
      <div className="max-w-md mx-auto px-2">
        <div className="grid grid-cols-4 gap-1 py-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                <Icon
                  className={`w-6 h-6 mb-1 transition-all duration-200 ${
                    isActive ? "scale-110" : ""
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={`text-xs ${isActive ? "font-semibold" : "font-medium"}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
