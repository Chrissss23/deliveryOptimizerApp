import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, Route, MapPin, ArrowRight, RefreshCw } from "lucide-react";

interface DeliveryStop {
  id: string;
  address: string;
  orderTime: string;
  estimatedDeliveryTime: string;
  sequenceNumber: number;
}

interface RouteStatisticsProps {
  totalDistance: number;
  totalTime: number;
  deliverySequence: DeliveryStop[];
  onAdjustParameters: (
    distancePriority: number,
    waitTimePriority: number,
  ) => void;
  onApproveRoute: () => void;
  onRecalculateRoute: () => void;
}

const RouteStatistics = ({
  totalDistance = 12.5,
  totalTime = 45,
  deliverySequence = [
    {
      id: "1",
      address: "123 Main St, Anytown",
      orderTime: "10:30 AM",
      estimatedDeliveryTime: "11:05 AM",
      sequenceNumber: 1,
    },
    {
      id: "2",
      address: "456 Oak Ave, Anytown",
      orderTime: "10:35 AM",
      estimatedDeliveryTime: "11:15 AM",
      sequenceNumber: 2,
    },
    {
      id: "3",
      address: "789 Pine Rd, Anytown",
      orderTime: "10:40 AM",
      estimatedDeliveryTime: "11:25 AM",
      sequenceNumber: 3,
    },
  ],
  onAdjustParameters = () => {},
  onApproveRoute = () => {},
  onRecalculateRoute = () => {},
}: RouteStatisticsProps) => {
  const [distancePriority, setDistancePriority] = React.useState<number>(50);
  const [waitTimePriority, setWaitTimePriority] = React.useState<number>(50);

  const handleDistanceChange = (value: number[]) => {
    setDistancePriority(value[0]);
  };

  const handleWaitTimeChange = (value: number[]) => {
    setWaitTimePriority(value[0]);
  };

  const handleApplyParameters = () => {
    onAdjustParameters(distancePriority, waitTimePriority);
    onRecalculateRoute();
  };

  return (
    <Card className="w-full h-full bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Route Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg">
            <Route className="h-6 w-6 text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Total Distance</p>
            <p className="text-2xl font-bold">{totalDistance} mi</p>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg">
            <Clock className="h-6 w-6 text-primary mb-2" />
            <p className="text-sm text-muted-foreground">
              Est. Completion Time
            </p>
            <p className="text-2xl font-bold">{totalTime} min</p>
          </div>
        </div>

        <Separator />

        {/* Delivery Sequence */}
        <div>
          <h3 className="text-md font-semibold mb-3">Delivery Sequence</h3>
          <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
            {deliverySequence.map((stop) => (
              <div
                key={stop.id}
                className="flex items-center p-3 bg-slate-50 rounded-lg"
              >
                <Badge
                  variant="outline"
                  className="h-6 w-6 rounded-full flex items-center justify-center mr-3"
                >
                  {stop.sequenceNumber}
                </Badge>
                <div className="flex-1">
                  <p className="text-sm font-medium">{stop.address}</p>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <span>Order: {stop.orderTime}</span>
                    <ArrowRight className="h-3 w-3 mx-1" />
                    <span>Delivery: {stop.estimatedDeliveryTime}</span>
                  </div>
                </div>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Route Parameters */}
        <div>
          <h3 className="text-md font-semibold mb-3">Route Parameters</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm">Distance Priority</label>
                <span className="text-sm font-medium">{distancePriority}%</span>
              </div>
              <Slider
                value={[distancePriority]}
                onValueChange={handleDistanceChange}
                max={100}
                step={5}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm">Wait Time Priority</label>
                <span className="text-sm font-medium">{waitTimePriority}%</span>
              </div>
              <Slider
                value={[waitTimePriority]}
                onValueChange={handleWaitTimeChange}
                max={100}
                step={5}
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleApplyParameters}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Apply Parameters
            </Button>
          </div>
        </div>

        <div className="pt-4">
          <Button className="w-full" onClick={onApproveRoute}>
            Approve Route
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteStatistics;
