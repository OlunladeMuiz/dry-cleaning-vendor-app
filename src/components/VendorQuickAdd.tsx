import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle, Copy } from "lucide-react";

const SAMPLE_VENDORS = [
  {
    email: "premiumcleaners@cleanu.local",
    password: "Vendor123!",
    name: "Premium Cleaners Sabo",
    description: "Professional dry cleaning and laundry services with same-day delivery available",
    address: "12 Sabo Road, Sabo, Yaba, Lagos",
    phone: "+234 803 123 4567",
    latitude: "6.5250",
    longitude: "3.3795",
  },
  {
    email: "expresscleaners@cleanu.local",
    password: "Vendor123!",
    name: "Express Dry Cleaners",
    description: "Fast and reliable dry cleaning service with student discounts",
    address: "45 Herbert Macaulay Way, Sabo, Lagos",
    phone: "+234 807 234 5678",
    latitude: "6.5238",
    longitude: "3.3788",
  },
  {
    email: "quickclean@cleanu.local",
    password: "Vendor123!",
    name: "QuickClean Sabo",
    description: "Budget-friendly dry cleaning perfect for students",
    address: "23 Ajayi Road, Sabo, Lagos",
    phone: "+234 810 456 7890",
    latitude: "6.5242",
    longitude: "3.3785",
  },
];

export function VendorQuickAdd() {
  const [copied, setCopied] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Add - Sample Vendors</CardTitle>
        <CardDescription>
          Copy these sample vendor details from Sabo, Lagos to quickly populate your app
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {SAMPLE_VENDORS.map((vendor, index) => (
          <Card key={index} className="border-2">
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{vendor.name}</h3>
                  <Badge variant="secondary">Vendor #{index + 1}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {vendor.email}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(vendor.email, index * 10 + 1)}
                      >
                        {copied === index * 10 + 1 ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-500">Password:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {vendor.password}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(vendor.password, index * 10 + 2)}
                      >
                        {copied === index * 10 + 2 ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <p className="text-xs">{vendor.phone}</p>
                  </div>
                  
                  <div>
                    <span className="text-gray-500">Location:</span>
                    <p className="text-xs">{vendor.latitude}, {vendor.longitude}</p>
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-500 text-sm">Address:</span>
                  <p className="text-sm">{vendor.address}</p>
                </div>
                
                <div>
                  <span className="text-gray-500 text-sm">Description:</span>
                  <p className="text-sm">{vendor.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-blue-900">Sample Services to Add:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Shirt Laundry - ₦800</li>
            <li>• Suit Dry Clean - ₦2,500</li>
            <li>• Dress Dry Clean - ₦2,000</li>
            <li>• Trouser Press - ₦700</li>
            <li>• Jeans - ₦1,000</li>
          </ul>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            <strong>💡 Pro Tip:</strong> After adding these vendors, you can sign in as a vendor using 
            any of the email/password combinations above to manage that vendor's profile!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
