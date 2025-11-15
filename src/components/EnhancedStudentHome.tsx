import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { apiRequest } from "../utils/api";
import { Search, MapPin, Star, Filter, Sparkles, TrendingUp, Clock, Package, Map as MapIcon } from "lucide-react";
import type { Vendor } from "../types";
import { TrinityLogo } from "./TrinityLogo";
import { VendorMapFallback } from "./VendorMap";
import { ThemeToggle } from "./ThemeToggle";

interface EnhancedStudentHomeProps {
  userId: string;
  onVendorSelect: (vendor: Vendor) => void;
}

export function EnhancedStudentHome({ userId, onVendorSelect }: EnhancedStudentHomeProps) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    filterVendors();
  }, [searchQuery, priceFilter, ratingFilter, vendors]);

  const fetchVendors = async () => {
    try {
      const data = await apiRequest("/vendors", {}, false);
      setVendors(data.vendors || []);
      setFilteredVendors(data.vendors || []);
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterVendors = () => {
    let filtered = [...vendors];

    if (searchQuery) {
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (ratingFilter !== "all") {
      const minRating = parseFloat(ratingFilter);
      filtered = filtered.filter((v) => v.rating >= minRating);
    }

    if (priceFilter !== "all") {
      filtered = filtered.filter((v) => {
        const avgPrice =
          v.services.reduce((sum, s) => sum + s.price, 0) / (v.services.length || 1);
        if (priceFilter === "low") return avgPrice < 10;
        if (priceFilter === "medium") return avgPrice >= 10 && avgPrice < 20;
        if (priceFilter === "high") return avgPrice >= 20;
        return true;
      });
    }

    setFilteredVendors(filtered);
  };

  const getAveragePrice = (vendor: Vendor) => {
    if (vendor.services.length === 0) return 0;
    return vendor.services.reduce((sum, s) => sum + s.price, 0) / vendor.services.length;
  };

  const featuredServices = [
    { name: "Express Cleaning", icon: TrendingUp, color: "blue" },
    { name: "Same-Day Service", icon: Clock, color: "purple" },
    { name: "Premium Care", icon: Sparkles, color: "pink" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 overflow-x-hidden">
      {/* Enhanced Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <TrinityLogo variant="full" size="md" />
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-lg overflow-hidden">
          <h1 className="text-2xl mb-2">Welcome to CleanU! 👋</h1>
          <p className="opacity-90">
            Trinity University's premier dry cleaning marketplace
          </p>
        </div>

        {/* Featured Services */}
        <div className="grid grid-cols-3 gap-4">
          {featuredServices.map((service) => {
            const Icon = service.icon;
            return (
              <Card
                key={service.name}
                className={`cursor-pointer hover:scale-105 transition-transform bg-gradient-to-br from-${service.color}-50 to-${service.color}-100 dark:from-${service.color}-900/20 dark:to-${service.color}-800/20 border-${service.color}-200 dark:border-${service.color}-800`}
              >
                <CardContent className="pt-6 text-center">
                  <Icon className={`w-8 h-8 mx-auto mb-2 text-${service.color}-600 dark:text-${service.color}-400`} />
                  <p className="text-sm">{service.name}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enhanced Search */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              Find Your Perfect Cleaner
            </CardTitle>
            <CardDescription>
              Discover top-rated dry cleaning services near you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by name or location..."
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-3 flex-wrap items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Filters:</span>
              </div>
              
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="low">💰 Budget ($)</SelectItem>
                  <SelectItem value="medium">💰💰 Mid-range ($$)</SelectItem>
                  <SelectItem value="high">💰💰💰 Premium ($$$)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="4">⭐ 4+ Stars</SelectItem>
                  <SelectItem value="3">⭐ 3+ Stars</SelectItem>
                  <SelectItem value="2">⭐ 2+ Stars</SelectItem>
                </SelectContent>
              </Select>

              <div className="ml-auto flex gap-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <Package className="w-4 h-4 mr-1" />
                  List
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("map")}
                >
                  <MapIcon className="w-4 h-4 mr-1" />
                  Map
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl">
            {filteredVendors.length} {filteredVendors.length === 1 ? "Vendor" : "Vendors"} Available
          </h2>
          {filteredVendors.length > 0 && (
            <Badge variant="secondary" className="px-3 py-1">
              Showing best matches
            </Badge>
          )}
        </div>

        {/* Vendors Display */}
        {viewMode === "list" ? (
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Loading vendors...</p>
              </div>
            ) : filteredVendors.length === 0 ? (
              <Card className="shadow-lg">
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="mb-2">No vendors found</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Try adjusting your filters to see more results
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setPriceFilter("all");
                      setRatingFilter("all");
                    }}
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {filteredVendors.map((vendor) => (
                  <Card
                    key={vendor.id}
                    className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
                    onClick={() => onVendorSelect(vendor)}
                  >
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <CardHeader>
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                            {vendor.name}
                          </CardTitle>
                          <Badge
                            variant="secondary"
                            className="shrink-0 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          >
                            ${getAveragePrice(vendor).toFixed(2)}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
                          <span className="line-clamp-1">{vendor.address}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {vendor.description || "Professional dry cleaning services with quality guarantee"}
                      </p>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">
                            {vendor.rating > 0 ? vendor.rating.toFixed(1) : "New"}
                          </span>
                          {vendor.reviewCount > 0 && (
                            <span className="text-sm text-gray-500">
                              ({vendor.reviewCount})
                            </span>
                          )}
                        </div>
                        <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {vendor.services.length} services
                        </span>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        {vendor.services.slice(0, 3).map((service, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {service.name}
                          </Badge>
                        ))}
                        {vendor.services.length > 3 && (
                          <Badge variant="outline" className="text-xs bg-gray-50 dark:bg-gray-800">
                            +{vendor.services.length - 3}
                          </Badge>
                        )}
                      </div>

                      <Button className="w-full group-hover:bg-blue-600 transition-colors">
                        View Details & Book
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <Card className="shadow-lg overflow-hidden">
            <VendorMapFallback
              vendors={filteredVendors}
              onVendorSelect={onVendorSelect}
              height="600px"
            />
          </Card>
        )}
      </div>
    </div>
  );
}