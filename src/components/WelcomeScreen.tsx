import { Button } from "./ui/button";
import { Settings, Users } from "lucide-react";
import { TrinityLogo } from "./TrinityLogo";
import { ThemeToggle } from "./ThemeToggle";

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onAdminAccess?: () => void;
  onViewUsers?: () => void;
}

export function WelcomeScreen({ onGetStarted, onAdminAccess, onViewUsers }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 dark:from-blue-900 dark:via-purple-900 dark:to-gray-900 flex flex-col items-center justify-center p-4 sm:p-6 text-white overflow-y-auto relative">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle variant="ghost" className="text-white hover:bg-white/20" />
      </div>
      
      <div className="max-w-md w-full text-center space-y-4 sm:space-y-8 py-6 sm:py-0">
        <div className="space-y-3 sm:space-y-6">
          <div className="flex justify-center">
            <TrinityLogo variant="wordmark" size="xl" />
          </div>
          
          <div>
            <h1 
              className="font-display tracking-tight"
              style={{ 
                fontSize: 'clamp(28px, 8vw, 48px)', 
                fontWeight: 800, 
                lineHeight: 1.1 
              }}
            >
              Your Campus Dry Cleaning Marketplace
            </h1>
            <p className="text-base sm:text-xl text-blue-100 mt-2 sm:mt-4">
              Connecting Trinity students with local vendors
            </p>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 space-y-2 sm:space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-white/20 rounded-full p-2 mt-1">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-base sm:text-lg">Find Nearby Vendors</h3>
                <p className="text-xs sm:text-sm text-blue-100">Discover dry cleaners around campus</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-white/20 rounded-full p-2 mt-1">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-base sm:text-lg">Compare Prices</h3>
                <p className="text-xs sm:text-sm text-blue-100">Get the best deals for your budget</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-white/20 rounded-full p-2 mt-1">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-base sm:text-lg">Fast Delivery</h3>
                <p className="text-xs sm:text-sm text-blue-100">Affordable pickup and delivery service</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={onGetStarted}
            className="w-full bg-white text-blue-600 hover:bg-blue-50 py-4 sm:py-6 text-base sm:text-lg"
            size="lg"
          >
            Get Started
          </Button>

          {onAdminAccess && (
            <Button 
              onClick={onAdminAccess}
              variant="outline"
              className="w-full border-2 border-white/30 text-white hover:bg-white/10 hover:text-white py-3 sm:py-4"
              size="lg"
            >
              <Settings className="w-4 h-4 mr-2" />
              Add Vendors (Admin)
            </Button>
          )}

          {onViewUsers && (
            <Button 
              onClick={onViewUsers}
              variant="outline"
              className="w-full border-2 border-white/30 text-white hover:bg-white/10 hover:text-white py-3 sm:py-4"
              size="lg"
            >
              <Users className="w-4 h-4 mr-2" />
              View Users (Admin)
            </Button>
          )}
        </div>

        <p className="text-xs sm:text-sm text-blue-100">
          Made for Trinity University Students
        </p>
      </div>
    </div>
  );
}