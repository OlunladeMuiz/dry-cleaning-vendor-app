import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { apiRequest } from "../utils/api";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  MapPin,
  Calendar,
  DollarSign,
  Star,
  AlertCircle,
  MessageCircle,
  Phone
} from "lucide-react";
import type { Order } from "../types";

interface EnhancedOrderTrackingProps {
  userId: string;
}

export function EnhancedOrderTracking({ userId }: EnhancedOrderTrackingProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const fetchOrders = async () => {
    try {
      const data = await apiRequest(`/orders/student/${userId}`, {}, true);
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]); // Set empty array on error to prevent UI issues
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "ready":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "delivered":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "processing":
        return <Package className="w-4 h-4" />;
      case "ready":
        return <CheckCircle2 className="w-4 h-4" />;
      case "delivered":
        return <Truck className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getOrderProgress = (status: string) => {
    switch (status) {
      case "pending":
        return 25;
      case "processing":
        return 50;
      case "ready":
        return 75;
      case "delivered":
        return 100;
      default:
        return 0;
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    if (filter === "active") return order.status !== "delivered";
    if (filter === "completed") return order.status === "delivered";
    return true;
  });

  const activeOrdersCount = orders.filter((o) => o.status !== "delivered").length;

  return (
    <div className="pb-24 px-4 max-w-6xl mx-auto overflow-x-hidden">
      <div className="space-y-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl mb-1">My Orders</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track and manage your dry cleaning orders
            </p>
          </div>
          <Badge variant="secondary" className="px-3 py-1.5">
            {activeOrdersCount} Active
          </Badge>
        </div>

        {/* Filter Tabs */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                className="flex-1"
              >
                All Orders ({orders.length})
              </Button>
              <Button
                variant={filter === "active" ? "default" : "outline"}
                onClick={() => setFilter("active")}
                className="flex-1"
              >
                Active ({activeOrdersCount})
              </Button>
              <Button
                variant={filter === "completed" ? "default" : "outline"}
                onClick={() => setFilter("completed")}
                className="flex-1"
              >
                Completed
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {isLoading ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading your orders...</p>
            </CardContent>
          </Card>
        ) : filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg mb-2">No Orders Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Start by finding a vendor and placing your first order
              </p>
              <Button>Browse Vendors</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                        <Badge className={getStatusColor(order.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {order.vendorName || "Vendor"}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                      <p className="text-xl">${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Order Progress</span>
                      <span>{getOrderProgress(order.status)}%</span>
                    </div>
                    <Progress value={getOrderProgress(order.status)} />
                  </div>

                  {/* Order Timeline */}
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {["pending", "processing", "ready", "delivered"].map((status, index) => {
                      const isCompleted = getOrderProgress(order.status) > index * 25;
                      const isCurrent = order.status === status;
                      return (
                        <div key={status} className="space-y-1">
                          <div
                            className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center transition-all ${
                              isCompleted || isCurrent
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                            } ${isCurrent ? "ring-4 ring-blue-200 dark:ring-blue-800" : ""}`}
                          >
                            {isCompleted && !isCurrent ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              getStatusIcon(status)
                            )}
                          </div>
                          <p className="text-xs capitalize">{status}</p>
                        </div>
                      );
                    })}
                  </div>

                  <Separator />

                  {/* Order Items */}
                  <div className="space-y-2">
                    <p className="font-medium text-sm">Items</p>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.quantity}x</span>
                            <span>{item.serviceName}</span>
                          </div>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Phone className="w-4 h-4 mr-2" />
                      Contact Vendor
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Support
                    </Button>
                    {order.status === "delivered" && (
                      <Button className="flex-1">
                        <Star className="w-4 h-4 mr-2" />
                        Review
                      </Button>
                    )}
                  </div>

                  {/* Delivery Info */}
                  {order.status !== "pending" && order.status !== "delivered" && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-blue-900 dark:text-blue-100">
                            Estimated Delivery
                          </p>
                          <p className="text-blue-700 dark:text-blue-300">
                            {order.estimatedDelivery
                              ? new Date(order.estimatedDelivery).toLocaleDateString()
                              : "To be determined"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}