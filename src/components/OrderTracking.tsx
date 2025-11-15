import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { apiRequest } from "../utils/api";
import { ArrowLeft, Package, CheckCircle2, Clock, Truck, Star } from "lucide-react";
import type { Order, Vendor } from "../types";

interface OrderTrackingProps {
  userId: string;
  onBack: () => void;
}

export function OrderTracking({ userId, onBack }: OrderTrackingProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [vendors, setVendors] = useState<Record<string, Vendor>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [reviewingOrder, setReviewingOrder] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const fetchOrders = async () => {
    try {
      const data = await apiRequest(`/orders/student/${userId}`, {}, true);
      const ordersList = data.orders || [];
      setOrders(ordersList.sort((a: Order, b: Order) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));

      // Fetch vendor details for each order
      const vendorIds = [...new Set(ordersList.map((o: Order) => o.vendorId))];
      const vendorData: Record<string, Vendor> = {};
      
      await Promise.all(
        vendorIds.map(async (vendorId) => {
          try {
            const result = await apiRequest(`/vendor/${vendorId}`, {}, false);
            vendorData[vendorId] = result.vendor;
          } catch (error) {
            console.error(`Failed to fetch vendor ${vendorId}:`, error);
          }
        })
      );
      
      setVendors(vendorData);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'in_progress':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'out_for_delivery':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: Order['status']) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'out_for_delivery':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmitReview = async (orderId: string, vendorId: string) => {
    try {
      await apiRequest(
        "/review",
        {
          method: "POST",
          body: JSON.stringify({
            vendorId,
            orderId,
            rating,
            comment,
          }),
        },
        true
      );

      setReviewingOrder(null);
      setRating(5);
      setComment("");
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl mb-2">Your Orders</h1>
          <p className="text-gray-600">Track and manage your dry cleaning orders</p>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="text-center py-12 text-gray-500">
              Loading orders...
            </CardContent>
          </Card>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
              <Button onClick={onBack}>Find Vendors</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const vendor = vendors[order.vendorId];
              return (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle>
                          {vendor ? vendor.name : "Loading..."}
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                          Order ID: {order.id}
                        </p>
                        <p className="text-sm text-gray-500">
                          Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="mb-2">Services</h4>
                      <div className="space-y-1">
                        {order.services.map((service, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>
                              {service.name} x {service.quantity}
                            </span>
                            <span>${(service.price * (service.quantity || 1)).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between">
                        <span>Total</span>
                        <span className="text-lg">${order.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Pickup Address</p>
                        <p>{order.pickupAddress}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Delivery Address</p>
                        <p>{order.deliveryAddress}</p>
                      </div>
                    </div>

                    <div className="text-sm">
                      <p className="text-gray-500">Pickup Time</p>
                      <p>{new Date(order.pickupTime).toLocaleString()}</p>
                    </div>

                    {order.notes && (
                      <div className="text-sm">
                        <p className="text-gray-500">Special Instructions</p>
                        <p>{order.notes}</p>
                      </div>
                    )}

                    {order.status === 'delivered' && reviewingOrder !== order.id && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setReviewingOrder(order.id)}
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Leave a Review
                      </Button>
                    )}

                    {reviewingOrder === order.id && (
                      <div className="space-y-3 pt-3 border-t">
                        <div>
                          <p className="text-sm mb-2">Rating</p>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="focus:outline-none"
                              >
                                <Star
                                  className={`w-6 h-6 ${
                                    star <= rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm mb-2">Comment (Optional)</p>
                          <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience..."
                            rows={3}
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleSubmitReview(order.id, order.vendorId)}
                            className="flex-1"
                          >
                            Submit Review
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setReviewingOrder(null);
                              setRating(5);
                              setComment("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
