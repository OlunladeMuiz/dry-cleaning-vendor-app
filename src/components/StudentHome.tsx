import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { apiRequest } from "../utils/api";
import { Search, MapPin, Star, Filter, User, LogOut, Package, Map } from "lucide-react";
import type { Vendor } from "../types";
import { TrinityLogo } from "./TrinityLogo";
import { VendorMap, VendorMapFallback } from "./VendorMap";
import { ThemeToggle } from "./ThemeToggle";

interface StudentHomeProps {
  userId: string;
  onVendorSelect: (vendor: Vendor) => void;
  onViewOrders: () => void;
  onViewProfile: () => void;
  onLogout: () => void;
}

export function StudentHome({ userId, onVendorSelect, onViewOrders, onViewProfile, onLogout }: StudentHomeProps) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

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

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Rating filter
    if (ratingFilter !== "all") {
      const minRating = parseFloat(ratingFilter);
      filtered = filtered.filter((v) => v.rating >= minRating);
    }

    // Price filter (based on average service price)
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <TrinityLogo variant="full" size="sm" />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={onViewOrders}>
                <Package className="w-4 h-4 mr-2" />
                Orders
              </Button>
              <Button variant="ghost" size="sm" onClick={onViewProfile}>
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Find Dry Cleaners Near You</CardTitle>
            <CardDescription>
              Discover the best dry cleaning services around Trinity University
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or location..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Filters:</span>
              </div>
              
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="low">$ (Under $10)</SelectItem>
                  <SelectItem value="medium">$$ ($10-$20)</SelectItem>
                  <SelectItem value="high">$$$ ($20+)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                  <SelectItem value="2">2+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Vendors List with Map View */}
        <Tabs defaultValue="list" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl">Available Vendors</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {filteredVendors.length} {filteredVendors.length === 1 ? "vendor" : "vendors"} found
              </span>
              <TabsList>
                <TabsTrigger value="list">
                  <Package className="w-4 h-4 mr-2" />
                  List
                </TabsTrigger>
                <TabsTrigger value="map">
                  <Map className="w-4 h-4 mr-2" />
                  Map
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="list" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12 text-gray-500">Loading vendors...</div>
            ) : filteredVendors.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">No vendors found matching your criteria.</p>
                  <Button
                    variant="link"
                    onClick={() => {
                      setSearchQuery("");
                      setPriceFilter("all");
                      setRatingFilter("all");
                    }}
                  >
                    Clear filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredVendors.map((vendor) => (
                  <Card
                    key={vendor.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => onVendorSelect(vendor)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <CardTitle className="text-lg">{vendor.name}</CardTitle>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-3 h-3 mr-1" />
                            {vendor.address}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {vendor.description || "Professional dry cleaning services"}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>
                            {vendor.rating > 0 ? vendor.rating.toFixed(1) : "New"}
                          </span>
                          {vendor.reviewCount > 0 && (
                            <span className="text-sm text-gray-500">
                              ({vendor.reviewCount})
                            </span>
                          )}
                        </div>
                        <Badge variant="secondary">
                          Avg: ${getAveragePrice(vendor).toFixed(2)}
                        </Badge>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        {vendor.services.slice(0, 2).map((service, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {service.name}
                          </Badge>
                        ))}
                        {vendor.services.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{vendor.services.length - 2} more
                          </Badge>
                        )}
                      </div>

                      <Button className="w-full" size="sm">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="map">
            <VendorMapFallback
              vendors={filteredVendors}
              onVendorSelect={onVendorSelect}
              height="600px"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
