import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Navigation,
  MapPin,
  Clock,
  Phone,
  CheckCircle,
  AlertCircle,
  Car,
  Route,
} from "lucide-react";

interface DeliveryOrder {
  id: string;
  address: string;
  customerName: string;
  customerPhone: string;
  orderItems: string[];
  estimatedTime: string;
  status: "pending" | "in-progress" | "delivered";
  sequenceNumber: number;
}

interface MobileDriverAppProps {
  driverName?: string;
  currentRoute?: DeliveryOrder[];
  onStartDelivery?: (orderId: string) => void;
  onCompleteDelivery?: (orderId: string) => void;
  onCallCustomer?: (phone: string) => void;
}

const MobileDriverApp = ({
  driverName = "John Doe",
  currentRoute = [
    {
      id: "1",
      address: "123 Main St, Anytown, USA",
      customerName: "Alice Johnson",
      customerPhone: "+1-555-0123",
      orderItems: ["2x Burger", "1x Fries", "1x Coke"],
      estimatedTime: "11:15 AM",
      status: "pending",
      sequenceNumber: 1,
    },
    {
      id: "2",
      address: "456 Oak Ave, Anytown, USA",
      customerName: "Bob Smith",
      customerPhone: "+1-555-0456",
      orderItems: ["1x Pizza", "2x Soda"],
      estimatedTime: "11:30 AM",
      status: "pending",
      sequenceNumber: 2,
    },
    {
      id: "3",
      address: "789 Pine Rd, Anytown, USA",
      customerName: "Carol Davis",
      customerPhone: "+1-555-0789",
      orderItems: ["3x Tacos", "1x Salad"],
      estimatedTime: "11:45 AM",
      status: "pending",
      sequenceNumber: 3,
    },
  ],
  onStartDelivery = () => {},
  onCompleteDelivery = () => {},
  onCallCustomer = () => {},
}: MobileDriverAppProps) => {
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [routeStarted, setRouteStarted] = useState(false);

  const handleStartRoute = () => {
    setRouteStarted(true);
    if (currentRoute.length > 0) {
      setActiveOrderId(currentRoute[0].id);
      onStartDelivery(currentRoute[0].id);
    }
  };

  const handleCompleteDelivery = (orderId: string) => {
    onCompleteDelivery(orderId);

    // Find next pending order
    const currentIndex = currentRoute.findIndex(
      (order) => order.id === orderId,
    );
    const nextOrder = currentRoute.find(
      (order, index) => index > currentIndex && order.status === "pending",
    );

    if (nextOrder) {
      setActiveOrderId(nextOrder.id);
      onStartDelivery(nextOrder.id);
    } else {
      setActiveOrderId(null);
      setRouteStarted(false);
    }
  };

  const getStatusColor = (status: DeliveryOrder["status"]) => {
    switch (status) {
      case "delivered":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      default:
        return "bg-gray-400";
    }
  };

  const completedDeliveries = currentRoute.filter(
    (order) => order.status === "delivered",
  ).length;
  const totalDeliveries = currentRoute.length;

  return (
    <div className="min-h-screen bg-background p-4 max-w-md mx-auto">
      {/* Driver Header */}
      <Card className="mb-4 bg-white">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${driverName}`}
              />
              <AvatarFallback>
                {driverName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{driverName}</h2>
              <div className="flex items-center text-sm text-muted-foreground">
                <Car className="h-4 w-4 mr-1" />
                <span>Driver Dashboard</span>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50">
              {completedDeliveries}/{totalDeliveries} Complete
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Route Status */}
      {!routeStarted ? (
        <Card className="mb-4 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Route className="h-5 w-5 mr-2" />
              Today's Route
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">
                You have {totalDeliveries} deliveries scheduled
              </p>
              <Button onClick={handleStartRoute} className="w-full" size="lg">
                Start Route
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-4 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                <span className="font-medium">Route Active</span>
              </div>
              <Badge variant="secondary">
                {completedDeliveries}/{totalDeliveries} Delivered
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delivery Orders */}
      <div className="space-y-3">
        {currentRoute.map((order) => {
          const isActive = activeOrderId === order.id;
          const isCompleted = order.status === "delivered";

          return (
            <Card
              key={order.id}
              className={`bg-white transition-all ${
                isActive ? "ring-2 ring-blue-500 bg-blue-50" : ""
              } ${isCompleted ? "opacity-75" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        isCompleted
                          ? "bg-green-500"
                          : isActive
                            ? "bg-blue-500"
                            : "bg-gray-400"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle size={16} />
                      ) : (
                        order.sequenceNumber
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{order.customerName}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{order.estimatedTime}</span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      isCompleted
                        ? "default"
                        : isActive
                          ? "secondary"
                          : "outline"
                    }
                    className={isCompleted ? "bg-green-500" : ""}
                  >
                    {isCompleted
                      ? "Delivered"
                      : isActive
                        ? "Active"
                        : "Pending"}
                  </Badge>
                </div>

                <div className="flex items-start space-x-2 mb-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-sm">{order.address}</span>
                </div>

                <div className="mb-3">
                  <p className="text-sm font-medium mb-1">Order Items:</p>
                  <div className="flex flex-wrap gap-1">
                    {order.orderItems.map((item, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                {isActive && !isCompleted && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        window.open(
                          `https://maps.google.com/maps?daddr=${encodeURIComponent(order.address)}`,
                          "_blank",
                        )
                      }
                    >
                      <Navigation className="h-4 w-4 mr-1" />
                      Navigate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCallCustomer(order.customerPhone)}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleCompleteDelivery(order.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Complete
                    </Button>
                  </div>
                )}

                {isCompleted && (
                  <div className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>Delivery completed</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Route Complete */}
      {routeStarted && completedDeliveries === totalDeliveries && (
        <Card className="mt-4 bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-green-700 mb-1">
              Route Complete!
            </h3>
            <p className="text-sm text-green-600">
              All deliveries have been completed successfully.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MobileDriverApp;
