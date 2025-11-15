import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { apiRequest } from "../utils/api";
import { ArrowLeft, MapPin, Phone, Star, Clock } from "lucide-react";
import type { Vendor, Review } from "../types";

interface VendorDetailProps {
  vendor: Vendor;
  onBack: () => void;
  onPlaceOrder: (vendor: Vendor) => void;
}

export function VendorDetail({ vendor, onBack, onPlaceOrder }: VendorDetailProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVendorDetails();
  }, [vendor.id]);

  const fetchVendorDetails = async () => {
    try {
      const data = await apiRequest(`/vendor/${vendor.id}`, {}, false);
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Failed to fetch vendor details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Vendors
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Vendor Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3 flex-1">
                <div>
                  <CardTitle className="text-2xl mb-2">{vendor.name}</CardTitle>
                  <p className="text-gray-600">{vendor.description || "Professional dry cleaning services"}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{vendor.address}</span>
                  </div>
                  {vendor.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{vendor.phone}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg">
                      {vendor.rating > 0 ? vendor.rating.toFixed(1) : "New"}
                    </span>
                    {vendor.reviewCount > 0 && (
                      <span className="text-sm text-gray-500">
                        ({vendor.reviewCount} reviews)
                      </span>
                    )}
                  </div>
                  <Badge>Open</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Services */}
        <Card>
          <CardHeader>
            <CardTitle>Services & Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            {vendor.services.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No services listed yet</p>
            ) : (
              <div className="space-y-3">
                {vendor.services.map((service, idx) => (
                  <div key={idx}>
                    <div className="flex items-start justify-between py-3">
                      <div className="space-y-1">
                        <h4>{service.name}</h4>
                        {service.description && (
                          <p className="text-sm text-gray-600">{service.description}</p>
                        )}
                      </div>
                      <div className="text-lg">${service.price.toFixed(2)}</div>
                    </div>
                    {idx < vendor.services.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-gray-500 text-center py-6">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && <p className="text-gray-700">{review.comment}</p>}
                    <Separator />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Place Order Button */}
        <div className="sticky bottom-0 bg-white border-t p-4 -mx-4">
          <div className="max-w-4xl mx-auto">
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => onPlaceOrder(vendor)}
            >
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
