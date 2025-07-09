import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, LocateFixed, MapPin } from "lucide-react";
import { getRestaurantLocation } from "@/config/restaurant";

interface DeliveryMapProps {
  restaurantLocation?: { lat: number; lng: number; name: string };
  deliveryPoints?: Array<{
    id: string;
    address: string;
    lat: number;
    lng: number;
    sequenceNumber: number;
  }>;
  optimizedRoute?: Array<number>;
  onMarkerClick?: (id: string) => void;
}

const DeliveryMap = ({
  restaurantLocation = getRestaurantLocation(),
  deliveryPoints = [
    {
      id: "1",
      address: "15 Water St, Plymouth, MA",
      lat: 42.0584,
      lng: -70.6673,
      sequenceNumber: 1,
    },
    {
      id: "2",
      address: "234 Sandwich St, Plymouth, MA",
      lat: 42.0654,
      lng: -70.6598,
      sequenceNumber: 2,
    },
    {
      id: "3",
      address: "89 Summer St, Kingston, MA",
      lat: 42.0097,
      lng: -70.7264,
      sequenceNumber: 3,
    },
    {
      id: "4",
      address: "456 Main St, Carver, MA",
      lat: 41.8834,
      lng: -70.7598,
      sequenceNumber: 4,
    },
    {
      id: "5",
      address: "123 School St, Duxbury, MA",
      lat: 42.0417,
      lng: -70.6723,
      sequenceNumber: 5,
    },
  ],
  optimizedRoute = [0, 2, 3, 1, 0], // Indices of points in optimal order (starting and ending at restaurant)
  onMarkerClick = () => {},
}: DeliveryMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(
    null,
  );
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize Google Map
  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.google) return;

    const map = new google.maps.Map(mapRef.current, {
      center: restaurantLocation,
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    googleMapRef.current = map;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Add restaurant marker
    const restaurantMarker = new google.maps.Marker({
      position: restaurantLocation,
      map: map,
      title: restaurantLocation.name,
      icon: {
        url:
          "data:image/svg+xml;charset=UTF-8," +
          encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="12" fill="#ef4444" stroke="white" stroke-width="2"/>
            <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">R</text>
          </svg>
        `),
        scaledSize: new google.maps.Size(32, 32),
      },
    });
    markersRef.current.push(restaurantMarker);

    // Add delivery point markers
    deliveryPoints.forEach((point) => {
      const marker = new google.maps.Marker({
        position: { lat: point.lat, lng: point.lng },
        map: map,
        title: point.address,
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#3b82f6" stroke="white" stroke-width="2"/>
              <text x="16" y="20" text-anchor="middle" fill="white" font-size="10" font-weight="bold">${point.sequenceNumber}</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
        },
      });

      marker.addListener("click", () => {
        onMarkerClick(point.id);
      });

      markersRef.current.push(marker);
    });

    // Draw optimized route
    if (optimizedRoute.length > 1) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#4f46e5",
          strokeWeight: 3,
        },
      });

      directionsRendererRef.current = directionsRenderer;
      directionsRenderer.setMap(map);

      // Create waypoints from optimized route
      const waypoints: google.maps.DirectionsWaypoint[] = [];
      for (let i = 1; i < optimizedRoute.length - 1; i++) {
        const pointIndex = optimizedRoute[i];
        if (pointIndex > 0) {
          const point = deliveryPoints[pointIndex - 1];
          waypoints.push({
            location: { lat: point.lat, lng: point.lng },
            stopover: true,
          });
        }
      }

      directionsService.route(
        {
          origin: restaurantLocation,
          destination: restaurantLocation,
          waypoints: waypoints,
          optimizeWaypoints: false,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            directionsRenderer.setDirections(result);
          }
        },
      );
    }

    setMapLoaded(true);
  }, [restaurantLocation, deliveryPoints, optimizedRoute, onMarkerClick]);

  useEffect(() => {
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap();
      } else {
        setTimeout(checkGoogleMaps, 100);
      }
    };
    checkGoogleMaps();
  }, [initializeMap]);

  const handleZoomIn = () => {
    if (googleMapRef.current) {
      const currentZoom = googleMapRef.current.getZoom() || 14;
      googleMapRef.current.setZoom(Math.min(currentZoom + 1, 20));
    }
  };

  const handleZoomOut = () => {
    if (googleMapRef.current) {
      const currentZoom = googleMapRef.current.getZoom() || 14;
      googleMapRef.current.setZoom(Math.max(currentZoom - 1, 10));
    }
  };

  return (
    <Card className="w-full h-full bg-white shadow-md">
      <CardContent className="p-0 relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
        {!mapLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600">Loading map...</p>
            </div>
          </div>
        ) : null}

        {/* Google Maps container */}
        <div
          ref={mapRef}
          className="w-full h-full rounded-lg"
          style={{ minHeight: "300px" }}
        />

        {/* Map controls */}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex flex-col space-y-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            className="bg-white shadow-md h-8 w-8 sm:h-10 sm:w-10"
          >
            <ZoomIn size={16} className="sm:w-5 sm:h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            className="bg-white shadow-md h-8 w-8 sm:h-10 sm:w-10"
          >
            <ZoomOut size={16} className="sm:w-5 sm:h-5" />
          </Button>
        </div>

        {/* Map legend */}
        <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-white p-2 sm:p-3 rounded-md shadow-md">
          <h4 className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
            Legend
          </h4>
          <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
            <div className="bg-red-500 rounded-full w-3 h-3 sm:w-4 sm:h-4"></div>
            <span className="text-xs">Restaurant</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="bg-blue-500 rounded-full w-3 h-3 sm:w-4 sm:h-4"></div>
            <span className="text-xs">Delivery Point</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryMap;
