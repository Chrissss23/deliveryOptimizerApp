import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import OrderList from "./OrderList";
import DeliveryMap from "./DeliveryMap";
import RouteStatistics from "./RouteStatistics";
import DriverAssignment from "./DriverAssignment";

const Home = () => {
  // Mock state for selected orders and route data
  const [selectedOrders, setSelectedOrders] = React.useState<string[]>([]);
  const [routeGenerated, setRouteGenerated] = React.useState(false);
  const [routeData, setRouteData] = React.useState({
    totalDistance: 0,
    estimatedTime: 0,
    sequence: [],
  });

  // Handler for order selection
  const handleOrderSelection = (orderId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId));
    }
  };

  // Handler for route generation
  const handleGenerateRoute = () => {
    // In a real implementation, this would call the TSP algorithm
    // For now, we'll just simulate a route being generated
    setRouteGenerated(true);
    setRouteData({
      totalDistance: 15.7, // miles
      estimatedTime: 45, // minutes
      sequence: selectedOrders,
    });
  };

  // Handler for route adjustment
  const handleRouteAdjustment = (params: {
    prioritizeDistance: number;
    prioritizeWaitTime: number;
  }) => {
    // In a real implementation, this would recalculate the route with new parameters
    console.log("Adjusting route with params:", params);
    // Simulate updated route data
    setRouteData({
      ...routeData,
      totalDistance:
        routeData.totalDistance * (1 + params.prioritizeDistance * 0.1),
      estimatedTime:
        routeData.estimatedTime * (1 - params.prioritizeDistance * 0.1),
    });
  };

  // Handler for driver assignment
  const handleDriverAssignment = (driverId: string) => {
    // In a real implementation, this would assign the route to the selected driver
    console.log(`Assigned route to driver ${driverId}`);
    // Reset for next route planning
    setSelectedOrders([]);
    setRouteGenerated(false);
  };

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
          Restaurant Delivery Route Optimizer
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Generate optimal delivery routes for your drivers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Order List Panel */}
        <div className="lg:col-span-3">
          <OrderList
            onOrderSelect={handleOrderSelection}
            onGenerateRoute={handleGenerateRoute}
            selectedOrders={selectedOrders}
          />
        </div>

        {/* Interactive Map */}
        <div className="lg:col-span-6">
          <Card>
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl">
                Delivery Route Map
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4">
              <DeliveryMap />
            </CardContent>
          </Card>
        </div>

        {/* Route Statistics Panel */}
        <div className="lg:col-span-3">
          <RouteStatistics
            totalDistance={routeData.totalDistance}
            totalTime={routeData.estimatedTime}
            deliverySequence={[]}
            onAdjustParameters={handleRouteAdjustment}
            onApproveRoute={() => console.log("Route approved")}
            onRecalculateRoute={() => console.log("Recalculating route")}
          />
        </div>
      </div>

      {/* Driver Assignment Section */}
      {routeGenerated && (
        <div className="mt-4 sm:mt-6">
          <DriverAssignment onAssign={handleDriverAssignment} />
        </div>
      )}
    </div>
  );
};

export default Home;
