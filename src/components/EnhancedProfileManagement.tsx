import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { apiRequest } from "../utils/api";
import { 
  Save, 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Shield, 
  Bell,
  CreditCard,
  Award,
  TrendingUp
} from "lucide-react";
import type { User as UserType } from "../types";

interface EnhancedProfileManagementProps {
  userId: string;
}

export function EnhancedProfileManagement({ userId }: EnhancedProfileManagementProps) {
  const [user, setUser] = useState<UserType | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const data = await apiRequest(`/user/${userId}`, {}, true);
      setUser(data.user);
      setName(data.user.name);
      setPhone(data.user.phone);
      setAddress(data.user.address);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setError("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const result = await apiRequest(
        `/user/${userId}`,
        {
          method: "PUT",
          body: JSON.stringify({ name, phone, address }),
        },
        true
      );

      if (result.success) {
        setUser(result.user);
        setSuccess("Profile updated successfully! 🎉");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const stats = [
    { label: "Total Orders", value: "12", icon: TrendingUp, color: "blue" },
    { label: "Loyalty Points", value: "240", icon: Award, color: "purple" },
    { label: "Saved ($)", value: "$85", icon: CreditCard, color: "green" },
  ];

  return (
    <div className="pb-24 overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Header Card */}
        <Card className="shadow-lg overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          <CardContent className="relative pt-0 pb-6">
            <div className="flex flex-col items-center -mt-12">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-white dark:border-gray-800 shadow-lg">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                    {user ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors shadow-lg">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h2 className="mt-4 text-2xl">{user?.name || "User"}</h2>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              <Badge variant="secondary" className="mt-2 capitalize">
                {user?.role || "Student"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 dark:from-${stat.color}-900/20 dark:to-${stat.color}-800/20 border-${stat.color}-200 dark:border-${stat.color}-800`}
              >
                <CardContent className="pt-6 text-center">
                  <Icon className={`w-6 h-6 mx-auto mb-2 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  <p className="text-2xl mb-1">{stat.value}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Profile Information */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              <CardTitle>Personal Information</CardTitle>
            </div>
            <CardDescription>Update your profile details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-gray-100 dark:bg-gray-800"
                />
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Email cannot be changed for security reasons
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  Delivery Address
                </Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St, San Antonio, TX"
                  className="h-11"
                />
                <p className="text-xs text-gray-500">
                  Used for pickup and delivery of your dry cleaning orders
                </p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-lg flex items-start gap-2">
                  <div className="shrink-0 mt-0.5">⚠️</div>
                  <div>{error}</div>
                </div>
              )}

              {success && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 p-4 rounded-lg flex items-start gap-2">
                  <div className="shrink-0 mt-0.5">✅</div>
                  <div>{success}</div>
                </div>
              )}

              <Button type="submit" className="w-full h-11" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Settings */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              Quick Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium">Order Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get updates about your orders
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium">Payment Methods</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage your payment options
                </p>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium">Privacy & Security</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Control your account security
                </p>
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}