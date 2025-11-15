import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Plus, Trash2, MapPin, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { apiRequest } from "../utils/api";
import { supabase } from "../utils/supabase/client";
import { VendorQuickAdd } from "./VendorQuickAdd";

interface Service {
  name: string;
  price: number;
  description: string;
}

interface VendorFormData {
  email: string;
  password: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  latitude: string;
  longitude: string;
  image: string;
}

export function VendorOnboarding({ onComplete }: { onComplete?: () => void }) {
  const [formData, setFormData] = useState<VendorFormData>({
    email: "",
    password: "",
    name: "",
    description: "",
    address: "",
    phone: "",
    latitude: "6.5244",
    longitude: "3.3792",
    image: "",
  });

  const [services, setServices] = useState<Service[]>([
    { name: "Shirt Laundry", price: 800, description: "Professional shirt cleaning and pressing" }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const updateForm = (field: keyof VendorFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addService = () => {
    setServices(prev => [...prev, { name: "", price: 0, description: "" }]);
  };

  const updateService = (index: number, field: keyof Service, value: string | number) => {
    setServices(prev => prev.map((service, i) => 
      i === index ? { ...service, [field]: value } : service
    ));
  };

  const removeService = (index: number) => {
    setServices(prev => prev.filter((_, i) => i !== index));
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateForm("latitude", position.coords.latitude.toString());
          updateForm("longitude", position.coords.longitude.toString());
          setResult({ type: 'success', message: 'Location updated!' });
        },
        (error) => {
          setResult({ type: 'error', message: 'Could not get location: ' + error.message });
        }
      );
    } else {
      setResult({ type: 'error', message: 'Geolocation not supported by browser' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      // Step 1: Create vendor account
      const signupData = await apiRequest("/signup", {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: "vendor",
          phone: formData.phone,
          address: formData.address,
        }),
      }, false);

      console.log("Signup successful:", signupData);

      // Step 2: Sign in to get access token
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        throw new Error("Failed to sign in: " + authError.message);
      }

      // Step 3: Create vendor profile
      const vendorData = await apiRequest("/vendor", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          address: formData.address,
          phone: formData.phone,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          services: services.filter(s => s.name && s.price > 0),
          image: formData.image || "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800",
        }),
      }, true);

      console.log("Vendor profile created:", vendorData);

      setResult({
        type: 'success',
        message: `✅ Successfully created vendor: ${formData.name}! The vendor is now live in the app.`
      });

      // Reset form
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 2000);

    } catch (error: any) {
      console.error("Error creating vendor:", error);
      setResult({
        type: 'error',
        message: `❌ Failed to create vendor: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Add New Vendor to CleanU</CardTitle>
            <CardDescription>
              Register a dry cleaning vendor from Sabo, Lagos to the marketplace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="form" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="form">Add Vendor Form</TabsTrigger>
                <TabsTrigger value="samples">Sample Data</TabsTrigger>
              </TabsList>
              
              <TabsContent value="form" className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Account Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg">Account Information</h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateForm("email", e.target.value)}
                          placeholder="vendor@example.com"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password *</Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => updateForm("password", e.target.value)}
                          placeholder="Min. 6 characters"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg">Business Information</h3>

                    <div className="space-y-2">
                      <Label htmlFor="name">Business Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateForm("name", e.target.value)}
                        placeholder="Premium Cleaners Sabo"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => updateForm("description", e.target.value)}
                        placeholder="Brief description of your services..."
                        rows={3}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => updateForm("phone", e.target.value)}
                          placeholder="+234 803 123 4567"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="image">Image URL</Label>
                        <Input
                          id="image"
                          value={formData.image}
                          onChange={(e) => updateForm("image", e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Full Address *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => updateForm("address", e.target.value)}
                        placeholder="12 Sabo Road, Sabo, Yaba, Lagos"
                        required
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg">Location (Coordinates)</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleGetCurrentLocation}
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        Use Current Location
                      </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="latitude">Latitude *</Label>
                        <Input
                          id="latitude"
                          value={formData.latitude}
                          onChange={(e) => updateForm("latitude", e.target.value)}
                          placeholder="6.5244"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="longitude">Longitude *</Label>
                        <Input
                          id="longitude"
                          value={formData.longitude}
                          onChange={(e) => updateForm("longitude", e.target.value)}
                          placeholder="3.3792"
                          required
                        />
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">
                      💡 Tip: Right-click on Google Maps → "What's here?" to get coordinates
                    </p>
                  </div>

                  {/* Services */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg">Services & Pricing</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addService}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Service
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {services.map((service, index) => (
                        <Card key={index}>
                          <CardContent className="pt-4">
                            <div className="flex gap-3">
                              <div className="flex-1 space-y-3">
                                <Input
                                  placeholder="Service name (e.g., Shirt Laundry)"
                                  value={service.name}
                                  onChange={(e) => updateService(index, "name", e.target.value)}
                                />
                                <div className="grid gap-3 md:grid-cols-2">
                                  <Input
                                    type="number"
                                    placeholder="Price (₦)"
                                    value={service.price || ""}
                                    onChange={(e) => updateService(index, "price", parseInt(e.target.value) || 0)}
                                  />
                                  <Input
                                    placeholder="Description"
                                    value={service.description}
                                    onChange={(e) => updateService(index, "description", e.target.value)}
                                  />
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeService(index)}
                                disabled={services.length === 1}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Result Message */}
                  {result && (
                    <div className={`p-4 rounded-lg flex items-start gap-3 ${
                      result.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}>
                      {result.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 mt-0.5" />
                      )}
                      <p className="text-sm">{result.message}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Creating Vendor...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Create Vendor Account
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="samples" className="space-y-6">
                <VendorQuickAdd />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Quick Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p>📍 <strong>Sabo, Lagos center:</strong> Lat 6.5244, Lng 3.3792</p>
            <p>💰 <strong>Typical prices:</strong> Shirt ₦500-1000, Suit ₦2000-3500</p>
            <p>🗺️ <strong>Get coordinates:</strong> Google Maps → Right-click → "What's here?"</p>
            <p>📸 <strong>Images:</strong> Use Unsplash or real vendor photos</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}