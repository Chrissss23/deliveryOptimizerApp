import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Navigation,
  MapPin,
  Clock,
  Phone,
  CheckCircle,
  AlertCircle,
  Car,
  Route,
  Lightbulb,
  Plus,
  Minus,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface DeliveryOrder {
  id: string;
  address: string;
  customerName: string;
  customerPhone: string;
  orderItems: string[];
  estimatedTime: string;
  status: "available" | "selected" | "in-progress" | "delivered";
  waitTime: number; // in minutes
  distance: number; // in miles from restaurant
}

interface MobileDriverAppProps {
  driverName?: string;
  availableOrders?: DeliveryOrder[];
  onStartDelivery?: (orderId: string) => void;
  onCompleteDelivery?: (orderId: string) => void;
  onCallCustomer?: (phone: string) => void;
}

const MobileDriverApp = ({
  driverName = "John Doe",
  availableOrders = [
    {
      id: "1",
      address: "15 Water St, Plymouth, MA 02360",
      customerName: "Sarah Mitchell",
      customerPhone: "+1-508-555-0123",
      orderItems: ["2x Margherita Pizza", "1x Caesar Salad", "2x Coke"],
      estimatedTime: "11:15 AM",
      status: "available",
      waitTime: 15,
      distance: 2.1,
    },
    {
      id: "2",
      address: "234 Sandwich St, Plymouth, MA 02360",
      customerName: "Mike O'Connor",
      customerPhone: "+1-508-555-0456",
      orderItems: ["1x Pepperoni Pizza", "1x Garlic Bread", "2x Sprite"],
      estimatedTime: "11:30 AM",
      status: "available",
      waitTime: 20,
      distance: 1.8,
    },
    {
      id: "3",
      address: "89 Summer St, Kingston, MA 02364",
      customerName: "Jennifer Walsh",
      customerPhone: "+1-508-555-0789",
      orderItems: ["1x Supreme Pizza", "1x Buffalo Wings", "1x Diet Coke"],
      estimatedTime: "11:45 AM",
      status: "available",
      waitTime: 25,
      distance: 4.2,
    },
    {
      id: "4",
      address: "123 School St, Duxbury, MA 02332",
      customerName: "David Chen",
      customerPhone: "+1-508-555-0321",
      orderItems: ["2x Hawaiian Pizza", "1x Greek Salad", "2x Lemonade"],
      estimatedTime: "12:00 PM",
      status: "available",
      waitTime: 30,
      distance: 3.5,
    },
    {
      id: "5",
      address: "456 Main St, Carver, MA 02330",
      customerName: "Lisa Rodriguez",
      customerPhone: "+1-508-555-0654",
      orderItems: ["1x Meat Lovers Pizza", "1x Breadsticks", "1x Pepsi"],
      estimatedTime: "12:15 PM",
      status: "available",
      waitTime: 35,
      distance: 5.1,
    },
    {
      id: "6",
      address: "67 Washington St, Hanover, MA 02339",
      customerName: "Tom Wilson",
      customerPhone: "+1-508-555-0987",
      orderItems: ["1x Veggie Pizza", "1x Garden Salad", "2x Water"],
      estimatedTime: "12:30 PM",
      status: "available",
      waitTime: 40,
      distance: 6.3,
    },
  ],
  onStartDelivery = () => {},
  onCompleteDelivery = () => {},
  onCallCustomer = () => {},
}: MobileDriverAppProps) => {
  const [orders, setOrders] = useState<DeliveryOrder[]>(availableOrders);
  const [currentView, setCurrentView] = useState<
    "selection" | "route" | "delivery"
  >("selection");
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [suggestedRoute, setSuggestedRoute] = useState<string[]>([]);
  const [customRoute, setCustomRoute] = useState<string[]>([]);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [routeStarted, setRouteStarted] = useState(false);
  const [usingSuggestedRoute, setUsingSuggestedRoute] = useState(false);

  // Generate suggested route based on distance and wait time
  const generateSuggestedRoute = (orderIds: string[]) => {
    const selectedOrders = orders.filter((order) =>
      orderIds.includes(order.id),
    );

    // Simple optimization: prioritize by wait time first, then distance
    const optimized = [...selectedOrders].sort((a, b) => {
      const waitTimeWeight = 0.7;
      const distanceWeight = 0.3;

      const scoreA = a.waitTime * waitTimeWeight + a.distance * distanceWeight;
      const scoreB = b.waitTime * waitTimeWeight + b.distance * distanceWeight;

      return scoreB - scoreA; // Higher score = higher priority
    });

    return optimized.map((order) => order.id);
  };

  // Handle order selection
  const handleOrderSelect = (orderId: string) => {
    const newSelectedIds = selectedOrderIds.includes(orderId)
      ? selectedOrderIds.filter((id) => id !== orderId)
      : [...selectedOrderIds, orderId];

    setSelectedOrderIds(newSelectedIds);

    // Update order status
    setOrders((prev) =>
      prev.map((order) => ({
        ...order,
        status: newSelectedIds.includes(order.id) ? "selected" : "available",
      })),
    );

    // Generate suggested route
    if (newSelectedIds.length > 0) {
      const suggested = generateSuggestedRoute(newSelectedIds);
      setSuggestedRoute(suggested);
      setCustomRoute(suggested); // Initialize custom route with suggested
    } else {
      setSuggestedRoute([]);
      setCustomRoute([]);
    }
  };

  // Move order up in custom route
  const moveOrderUp = (orderId: string) => {
    const currentIndex = customRoute.indexOf(orderId);
    if (currentIndex > 0) {
      const newRoute = [...customRoute];
      [newRoute[currentIndex], newRoute[currentIndex - 1]] = [
        newRoute[currentIndex - 1],
        newRoute[currentIndex],
      ];
      setCustomRoute(newRoute);
    }
  };

  // Move order down in custom route
  const moveOrderDown = (orderId: string) => {
    const currentIndex = customRoute.indexOf(orderId);
    if (currentIndex < customRoute.length - 1) {
      const newRoute = [...customRoute];
      [newRoute[currentIndex], newRoute[currentIndex + 1]] = [
        newRoute[currentIndex + 1],
        newRoute[currentIndex],
      ];
      setCustomRoute(newRoute);
    }
  };

  // Start the route
  const handleStartRoute = (usesSuggested: boolean = false) => {
    setUsingSuggestedRoute(usesSuggested);
    setCurrentView("delivery");
    setRouteStarted(true);

    const routeToUse = usesSuggested ? suggestedRoute : customRoute;
    if (routeToUse.length > 0) {
      setActiveOrderId(routeToUse[0]);
      setOrders((prev) =>
        prev.map((order) => ({
          ...order,
          status: order.id === routeToUse[0] ? "in-progress" : order.status,
        })),
      );
      onStartDelivery(routeToUse[0]);
    }
  };

  // Complete delivery
  const handleCompleteDelivery = (orderId: string) => {
    onCompleteDelivery(orderId);

    // Update order status
    setOrders((prev) =>
      prev.map((order) => ({
        ...order,
        status: order.id === orderId ? "delivered" : order.status,
      })),
    );

    // Find next order in route
    const routeToUse = usingSuggestedRoute ? suggestedRoute : customRoute;
    const currentIndex = routeToUse.indexOf(orderId);
    const nextOrderId = routeToUse[currentIndex + 1];

    if (nextOrderId) {
      setActiveOrderId(nextOrderId);
      setOrders((prev) =>
        prev.map((order) => ({
          ...order,
          status: order.id === nextOrderId ? "in-progress" : order.status,
        })),
      );
      onStartDelivery(nextOrderId);
    } else {
      setActiveOrderId(null);
      setRouteStarted(false);
    }
  };

  // Reset to selection view
  const handleNewRoute = () => {
    setCurrentView("selection");
    setSelectedOrderIds([]);
    setSuggestedRoute([]);
    setCustomRoute([]);
    setActiveOrderId(null);
    setRouteStarted(false);
    setUsingSuggestedRoute(false);

    // Reset all orders to available (except delivered ones)
    setOrders((prev) =>
      prev.map((order) => ({
        ...order,
        status: order.status === "delivered" ? "delivered" : "available",
      })),
    );
  };

  const selectedOrders = orders.filter((order) =>
    selectedOrderIds.includes(order.id),
  );
  const completedDeliveries = orders.filter(
    (order) => order.status === "delivered",
  ).length;
  const totalDistance = selectedOrders.reduce(
    (sum, order) => sum + order.distance,
    0,
  );
  const estimatedTime = selectedOrders.length * 8 + totalDistance * 3; // 8 min per delivery + 3 min per mile

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
            {currentView !== "selection" && (
              <Button variant="outline" size="sm" onClick={handleNewRoute}>
                New Route
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Selection View */}
      {currentView === "selection" && (
        <>
          <Card className="mb-4 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Available Deliveries</span>
                <Badge variant="outline">
                  {selectedOrderIds.length} selected
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Select the deliveries you want to include in your route
              </p>

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {orders
                  .filter((order) => order.status !== "delivered")
                  .map((order) => (
                    <div
                      key={order.id}
                      className={`p-3 border rounded-lg transition-colors ${
                        order.status === "selected"
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={order.status === "selected"}
                          onCheckedChange={() => handleOrderSelect(order.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">
                              {order.customerName}
                            </h3>
                            <div className="flex gap-1">
                              <Badge variant="outline" className="text-xs">
                                {order.waitTime}min wait
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {order.distance}mi
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{order.address}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Est: {order.estimatedTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {selectedOrderIds.length > 0 && (
            <Card className="mb-4 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
                  Route Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {selectedOrderIds.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Deliveries</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {totalDistance.toFixed(1)}
                    </p>
                    <p className="text-xs text-muted-foreground">Miles</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {Math.round(estimatedTime)}
                    </p>
                    <p className="text-xs text-muted-foreground">Minutes</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => setCurrentView("route")}
                    className="w-full"
                    size="lg"
                  >
                    Plan Route
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Route Planning View */}
      {currentView === "route" && (
        <>
          <Card className="mb-4 bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center text-amber-800">
                <Lightbulb className="h-5 w-5 mr-2" />
                Suggested Route
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-amber-700 mb-3">
                Optimized for wait time and distance
              </p>
              <div className="space-y-2 mb-4">
                {suggestedRoute.map((orderId, index) => {
                  const order = orders.find((o) => o.id === orderId);
                  return (
                    <div
                      key={orderId}
                      className="flex items-center p-2 bg-white rounded border"
                    >
                      <Badge
                        variant="outline"
                        className="mr-2 h-6 w-6 rounded-full flex items-center justify-center"
                      >
                        {index + 1}
                      </Badge>
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {order?.customerName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order?.address}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button
                onClick={() => handleStartRoute(true)}
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                Use Suggested Route
              </Button>
            </CardContent>
          </Card>

          <Card className="mb-4 bg-white">
            <CardHeader>
              <CardTitle>Custom Route</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Arrange deliveries in your preferred order
              </p>
              <div className="space-y-2 mb-4">
                {customRoute.map((orderId, index) => {
                  const order = orders.find((o) => o.id === orderId);
                  return (
                    <div
                      key={orderId}
                      className="flex items-center p-2 border rounded"
                    >
                      <Badge
                        variant="outline"
                        className="mr-2 h-6 w-6 rounded-full flex items-center justify-center"
                      >
                        {index + 1}
                      </Badge>
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {order?.customerName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order?.address}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveOrderUp(orderId)}
                          disabled={index === 0}
                          className="h-8 w-8 p-0"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveOrderDown(orderId)}
                          disabled={index === customRoute.length - 1}
                          className="h-8 w-8 p-0"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button
                onClick={() => handleStartRoute(false)}
                className="w-full"
              >
                Start Custom Route
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {/* Delivery View */}
      {currentView === "delivery" && (
        <>
          {routeStarted && (
            <Card className="mb-4 bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                    <span className="font-medium">
                      {usingSuggestedRoute ? "Suggested" : "Custom"} Route
                      Active
                    </span>
                  </div>
                  <Badge variant="secondary">
                    {completedDeliveries}/{selectedOrderIds.length} Complete
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {(usingSuggestedRoute ? suggestedRoute : customRoute).map(
              (orderId, index) => {
                const order = orders.find((o) => o.id === orderId);
                if (!order) return null;

                const isActive = activeOrderId === order.id;
                const isCompleted = order.status === "delivered";
                const isPending = !isActive && !isCompleted;

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
                              index + 1
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {order.customerName}
                            </h3>
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
                          {order.orderItems.map((item, itemIndex) => (
                            <Badge
                              key={itemIndex}
                              variant="outline"
                              className="text-xs"
                            >
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
              },
            )}
          </div>

          {/* Route Complete */}
          {routeStarted && completedDeliveries === selectedOrderIds.length && (
            <Card className="mt-4 bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-green-700 mb-1">
                  Route Complete!
                </h3>
                <p className="text-sm text-green-600 mb-4">
                  All deliveries have been completed successfully.
                </p>
                <Button onClick={handleNewRoute} className="w-full">
                  Plan New Route
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default MobileDriverApp;
