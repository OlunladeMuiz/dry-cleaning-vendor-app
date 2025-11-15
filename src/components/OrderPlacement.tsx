import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { apiRequest } from "../utils/api";
import { ArrowLeft, Plus, Minus, Loader2 } from "lucide-react";
import type { Vendor, Service } from "../types";

interface OrderPlacementProps {
  vendor: Vendor;
  onBack: () => void;
  onOrderSuccess: (orderId: string) => void;
}

interface ServiceQuantity extends Service {
  quantity: number;
}

export function OrderPlacement({ vendor, onBack, onOrderSuccess }: OrderPlacementProps) {
  const [selectedServices, setSelectedServices] = useState<ServiceQuantity[]>([]);
  const [pickupAddress, setPickupAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const addService = (service: Service) => {
    const existing = selectedServices.find((s) => s.name === service.name);
    if (existing) {
      setSelectedServices(
        selectedServices.map((s) =>
          s.name === service.name ? { ...s, quantity: s.quantity + 1 } : s
        )
      );
    } else {
      setSelectedServices([...selectedServices, { ...service, quantity: 1 }]);
    }
  };

  const updateQuantity = (serviceName: string, delta: number) => {
    setSelectedServices(
      selectedServices
        .map((s) =>
          s.name === serviceName ? { ...s, quantity: Math.max(0, s.quantity + delta) } : s
        )
        .filter((s) => s.quantity > 0)
    );
  };

  const calculateTotal = () => {
    return selectedServices.reduce((sum, s) => sum + s.price * s.quantity, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (selectedServices.length === 0) {
      setError("Please select at least one service");
      setIsLoading(false);
      return;
    }

    if (!paymentMethod) {
      setError("Please select a payment method");
      setIsLoading(false);
      return;
    }

    try {
      const result = await apiRequest(
        "/order",
        {
          method: "POST",
          body: JSON.stringify({
            vendorId: vendor.id,
            services: selectedServices,
            pickupAddress,
            deliveryAddress,
            pickupTime,
            paymentMethod,
            notes,
          }),
        },
        true
      );

      if (result.success) {
        onOrderSuccess(result.order.id);
      }
    } catch (err: any) {
      console.error("Order placement error:", err);
      setError(err.message || "Failed to place order. Please try again.");
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
            Back to Vendor
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vendor Info */}
          <Card>
            <CardHeader>
              <CardTitle>Ordering from {vendor.name}</CardTitle>
            </CardHeader>
          </Card>

          {/* Select Services */}
          <Card>
            <CardHeader>
              <CardTitle>Select Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {vendor.services.map((service, idx) => {
                  const selected = selectedServices.find((s) => s.name === service.name);
                  return (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4>{service.name}</h4>
                        {service.description && (
                          <p className="text-sm text-gray-600">{service.description}</p>
                        )}
                        <p className="text-sm">${service.price.toFixed(2)}</p>
                      </div>
                      {selected ? (
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(service.name, -1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center">{selected.quantity}</span>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(service.name, 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button type="button" size="sm" onClick={() => addService(service)}>
                          Add
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>

              {selectedServices.length > 0 && (
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span>Total</span>
                    <span className="text-xl">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pickup & Delivery Details */}
          <Card>
            <CardHeader>
              <CardTitle>Pickup & Delivery Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pickup-address">Pickup Address</Label>
                <Input
                  id="pickup-address"
                  placeholder="Where should we pick up your items?"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery-address">Delivery Address</Label>
                <Input
                  id="delivery-address"
                  placeholder="Where should we deliver your items?"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickup-time">Preferred Pickup Time</Label>
                <Input
                  id="pickup-time"
                  type="datetime-local"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Special Instructions (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special instructions for pickup or delivery?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash on Delivery</SelectItem>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="mobile">Mobile Payment</SelectItem>
                  <SelectItem value="campus">Campus Card</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="sticky bottom-0 bg-white border-t p-4 -mx-4">
            <div className="max-w-4xl mx-auto">
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  `Place Order - $${calculateTotal().toFixed(2)}`
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
