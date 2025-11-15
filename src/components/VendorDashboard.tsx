import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { apiRequest } from "../utils/api";
import { LogOut, Plus, Trash2, Save, Package, Star } from "lucide-react";
import type { Order, Vendor, Service } from "../types";
import { TrinityLogo } from "./TrinityLogo";
import { ThemeToggle } from "./ThemeToggle";

interface VendorDashboardProps {
  userId: string;
  onLogout: () => void;
}

export function VendorDashboard({ userId, onLogout }: VendorDashboardProps) {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Vendor profile fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchVendorData();
    fetchOrders();
  }, [userId]);

  const fetchVendorData = async () => {
    try {
      const data = await apiRequest(`/vendor/${userId}`, {}, false);
      if (data.vendor) {
        setVendor(data.vendor);
        setName(data.vendor.name);
        setDescription(data.vendor.description);
        setAddress(data.vendor.address);
        setPhone(data.vendor.phone);
        setLatitude(data.vendor.location.latitude.toString());
        setLongitude(data.vendor.location.longitude.toString());
        setServices(data.vendor.services);
      }
    } catch (error) {
      console.error("Failed to fetch vendor data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await apiRequest(`/orders/vendor/${userId}`, {}, true);
      setOrders((data.orders || []).sort((a: Order, b: Order) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const handleCreateVendorProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const result = await apiRequest(
        "/vendor",
        {
          method: "POST",
          body: JSON.stringify({
            name,
            description,
            address,
            phone,
            latitude: parseFloat(latitude) || 0,
            longitude: parseFloat(longitude) || 0,
            services,
          }),
        },
        true
      );

      if (result.success) {
        setVendor(result.vendor);
        alert("Vendor profile created successfully!");
      }
    } catch (error) {
      console.error("Failed to create vendor profile:", error);
      alert("Failed to create vendor profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateVendorProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const result = await apiRequest(
        `/vendor/${userId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name,
            description,
            address,
            phone,
            location: {
              latitude: parseFloat(latitude) || 0,
              longitude: parseFloat(longitude) || 0,
            },
            services,
          }),
        },
        true
      );

      if (result.success) {
        setVendor(result.vendor);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const addService = () => {
    setServices([...services, { name: "", price: 0, description: "" }]);
  };

  const updateService = (index: number, field: keyof Service, value: string | number) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await apiRequest(
        `/order/${orderId}/status`,
        {
          method: "PUT",
          body: JSON.stringify({ status: newStatus }),
        },
        true
      );
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status");
    }
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrinityLogo variant="full" size="sm" />
              <Badge variant="secondary" className="text-xs">Vendor</Badge>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <Tabs defaultValue="orders">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="profile">Profile & Services</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Incoming Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id}>
                        <CardContent className="pt-6 space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>

                          <div>
                            <h4 className="mb-2">Services</h4>
                            <div className="space-y-1">
                              {order.services.map((service, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span>{service.name} x {service.quantity}</span>
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
                              <p className="text-gray-500">Pickup</p>
                              <p>{order.pickupAddress}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Delivery</p>
                              <p>{order.deliveryAddress}</p>
                            </div>
                          </div>

                          <div className="text-sm">
                            <p className="text-gray-500">Pickup Time</p>
                            <p>{new Date(order.pickupTime).toLocaleString()}</p>
                          </div>

                          {order.notes && (
                            <div className="text-sm">
                              <p className="text-gray-500">Notes</p>
                              <p>{order.notes}</p>
                            </div>
                          )}

                          <div>
                            <Label htmlFor={`status-${order.id}`} className="text-sm">Update Status</Label>
                            <Select
                              value={order.status}
                              onValueChange={(value) => handleUpdateOrderStatus(order.id, value as Order['status'])}
                            >
                              <SelectTrigger id={`status-${order.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4 mt-6">
            {vendor ? (
              <form onSubmit={handleUpdateVendorProfile} className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Business Information</CardTitle>
                        {vendor.rating > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{vendor.rating.toFixed(1)}</span>
                            <span className="text-sm text-gray-500">
                              ({vendor.reviewCount} reviews)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Business Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input
                          id="latitude"
                          type="number"
                          step="any"
                          value={latitude}
                          onChange={(e) => setLatitude(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input
                          id="longitude"
                          type="number"
                          step="any"
                          value={longitude}
                          onChange={(e) => setLongitude(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Services & Pricing</CardTitle>
                      <Button type="button" onClick={addService} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Service
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {services.length === 0 ? (
                      <p className="text-center text-gray-500 py-6">
                        No services added yet. Click "Add Service" to get started.
                      </p>
                    ) : (
                      services.map((service, index) => (
                        <Card key={index}>
                          <CardContent className="pt-6 space-y-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 space-y-3">
                                <div className="space-y-2">
                                  <Label htmlFor={`service-name-${index}`}>Service Name</Label>
                                  <Input
                                    id={`service-name-${index}`}
                                    value={service.name}
                                    onChange={(e) =>
                                      updateService(index, "name", e.target.value)
                                    }
                                    placeholder="e.g., Shirt Washing"
                                    required
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`service-price-${index}`}>Price ($)</Label>
                                  <Input
                                    id={`service-price-${index}`}
                                    type="number"
                                    step="0.01"
                                    value={service.price}
                                    onChange={(e) =>
                                      updateService(index, "price", parseFloat(e.target.value))
                                    }
                                    required
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`service-desc-${index}`}>Description (Optional)</Label>
                                  <Input
                                    id={`service-desc-${index}`}
                                    value={service.description}
                                    onChange={(e) =>
                                      updateService(index, "description", e.target.value)
                                    }
                                    placeholder="Brief description"
                                  />
                                </div>
                              </div>
                              
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeService(index)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </CardContent>
                </Card>

                <Button type="submit" className="w-full" disabled={isSaving}>
                  {isSaving ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleCreateVendorProfile} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Create Your Vendor Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Business Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input
                          id="latitude"
                          type="number"
                          step="any"
                          value={latitude}
                          onChange={(e) => setLatitude(e.target.value)}
                          placeholder="29.4241"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input
                          id="longitude"
                          type="number"
                          step="any"
                          value={longitude}
                          onChange={(e) => setLongitude(e.target.value)}
                          placeholder="-98.4936"
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSaving}>
                      {isSaving ? "Creating..." : "Create Vendor Profile"}
                    </Button>
                  </CardContent>
                </Card>
              </form>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}