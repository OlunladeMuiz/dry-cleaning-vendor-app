import { useEffect, useRef, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { MapPin, Navigation } from "lucide-react";
import type { Vendor } from "../types";

interface VendorMapProps {
  vendors: Vendor[];
  selectedVendor?: Vendor | null;
  onVendorSelect?: (vendor: Vendor) => void;
  userLocation?: { latitude: number; longitude: number };
  height?: string;
}

export function VendorMap({ 
  vendors, 
  selectedVendor, 
  onVendorSelect, 
  userLocation,
  height = "400px" 
}: VendorMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your actual API key
    
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => {
      console.error("Failed to load Google Maps");
    };
    
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || map) return;

    const defaultCenter = userLocation || { latitude: 6.5244, longitude: 3.3792 }; // Sabo, Lagos

    const newMap = new google.maps.Map(mapRef.current, {
      center: { lat: defaultCenter.latitude, lng: defaultCenter.longitude },
      zoom: 14,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    setMap(newMap);
  }, [isLoaded, map, userLocation]);

  // Add user location marker
  useEffect(() => {
    if (!map || !userLocation) return;

    new google.maps.Marker({
      position: { lat: userLocation.latitude, lng: userLocation.longitude },
      map: map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#4F46E5",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 3,
      },
      title: "Your Location",
    });
  }, [map, userLocation]);

  // Add vendor markers
  useEffect(() => {
    if (!map || vendors.length === 0) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    // Create new markers
    const newMarkers = vendors.map((vendor) => {
      const marker = new google.maps.Marker({
        position: { lat: vendor.location.latitude, lng: vendor.location.longitude },
        map: map,
        title: vendor.name,
        icon: {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#3B82F6" stroke="white" stroke-width="3"/>
              <path d="M20 12L24 16H21V24H19V16H16L20 12Z" fill="white"/>
              <circle cx="20" cy="27" r="2" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(40, 40),
          anchor: new google.maps.Point(20, 40),
        },
      });

      // Add click listener
      marker.addListener("click", () => {
        if (onVendorSelect) {
          onVendorSelect(vendor);
        }
        
        // Center on marker
        map.panTo(marker.getPosition()!);
        map.setZoom(16);
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; font-family: system-ui;">
            <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
              ${vendor.name}
            </h3>
            <p style="margin: 0 0 4px 0; font-size: 13px; color: #6b7280;">
              ${vendor.address}
            </p>
            <div style="display: flex; align-items: center; gap: 4px; margin-top: 4px;">
              <span style="color: #f59e0b; font-size: 14px;">★</span>
              <span style="font-size: 13px; color: #1f2937;">
                ${vendor.rating > 0 ? vendor.rating.toFixed(1) : 'New'}
              </span>
              ${vendor.reviewCount > 0 ? `<span style="font-size: 12px; color: #9ca3af;">(${vendor.reviewCount})</span>` : ''}
            </div>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      return marker;
    });

    setMarkers(newMarkers);

    // Fit bounds to show all vendors
    if (vendors.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      vendors.forEach((vendor) => {
        bounds.extend({ lat: vendor.location.latitude, lng: vendor.location.longitude });
      });
      if (userLocation) {
        bounds.extend({ lat: userLocation.latitude, lng: userLocation.longitude });
      }
      map.fitBounds(bounds);
    }
  }, [map, vendors, onVendorSelect]);

  // Highlight selected vendor
  useEffect(() => {
    if (!map || !selectedVendor) return;

    map.panTo({
      lat: selectedVendor.location.latitude,
      lng: selectedVendor.location.longitude,
    });
    map.setZoom(16);
  }, [map, selectedVendor]);

  if (!isLoaded) {
    return (
      <Card className="flex items-center justify-center bg-gray-50" style={{ height }}>
        <div className="text-center space-y-2">
          <MapPin className="w-12 h-12 mx-auto text-gray-400 animate-pulse" />
          <p className="text-gray-500">Loading map...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        style={{ height, width: "100%" }}
        className="rounded-lg overflow-hidden shadow-md"
      />
      
      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
          <span className="text-gray-700">Vendors</span>
        </div>
        {userLocation && (
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 rounded-full bg-indigo-600 border-2 border-white"></div>
            <span className="text-gray-700">You</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Fallback component if Google Maps fails or API key is not configured
export function VendorMapFallback({ vendors, selectedVendor, onVendorSelect }: VendorMapProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="text-center space-y-4">
        <MapPin className="w-16 h-16 mx-auto text-blue-500" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Interactive Map View
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            To enable the map, add your Google Maps API key in the VendorMap component.
          </p>
          <Button variant="outline" size="sm" asChild>
            <a 
              href="https://developers.google.com/maps/documentation/javascript/get-api-key" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Get API Key
            </a>
          </Button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-700 mb-3 font-medium">
            Vendors in Sabo, Lagos ({vendors.length})
          </p>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
            {vendors.map((vendor) => (
              <button
                key={vendor.id}
                onClick={() => onVendorSelect?.(vendor)}
                className={`text-left p-3 rounded-lg border transition-colors ${
                  selectedVendor?.id === vendor.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {vendor.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {vendor.address}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
