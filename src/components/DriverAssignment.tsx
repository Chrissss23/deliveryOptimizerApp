import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Check, UserCheck } from "lucide-react";

interface Driver {
  id: string;
  name: string;
  status: "available" | "busy" | "offline";
  avatar?: string;
  deliveriesCompleted?: number;
  rating?: number;
}

interface DriverAssignmentProps {
  drivers?: Driver[];
  onAssign?: (driverId: string) => void;
  optimizedRoute?: {
    totalDistance: number;
    estimatedTime: number;
    deliveryCount: number;
  };
}

const DriverAssignment = ({
  drivers = [
    {
      id: "1",
      name: "Tommy Sullivan",
      status: "available",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tommy",
      deliveriesCompleted: 187,
      rating: 4.9,
    },
    {
      id: "2",
      name: "Maria Santos",
      status: "available",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
      deliveriesCompleted: 143,
      rating: 4.7,
    },
    {
      id: "3",
      name: "Kevin Murphy",
      status: "busy",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kevin",
      deliveriesCompleted: 201,
      rating: 4.8,
    },
    {
      id: "4",
      name: "Lisa Rodriguez",
      status: "available",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
      deliveriesCompleted: 98,
      rating: 4.6,
    },
    {
      id: "5",
      name: "Brian Kelly",
      status: "offline",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=brian",
      deliveriesCompleted: 76,
      rating: 4.4,
    },
  ],
  onAssign = () => {},
  optimizedRoute = {
    totalDistance: 12.5,
    estimatedTime: 45,
    deliveryCount: 5,
  },
}: DriverAssignmentProps) => {
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [assignmentComplete, setAssignmentComplete] = useState(false);

  const handleDriverSelect = (driverId: string) => {
    setSelectedDriverId(driverId);
    setAssignmentComplete(false);
  };

  const handleAssignRoute = () => {
    if (selectedDriverId) {
      onAssign(selectedDriverId);
      setAssignmentComplete(true);
    }
  };

  const getStatusColor = (status: Driver["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "busy":
        return "bg-amber-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Driver Assignment</span>
          <div className="flex items-center space-x-2 text-sm font-normal">
            <span>Route Summary:</span>
            <Badge variant="outline">
              {optimizedRoute.deliveryCount} Deliveries
            </Badge>
            <Badge variant="outline">
              {optimizedRoute.totalDistance.toFixed(1)} miles
            </Badge>
            <Badge variant="outline">
              ~{optimizedRoute.estimatedTime} mins
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {drivers.map((driver) => (
            <div
              key={driver.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${driver.status !== "available" ? "opacity-60" : ""} ${selectedDriverId === driver.id ? "border-primary ring-2 ring-primary/20" : "border-gray-200 hover:border-gray-300"}`}
              onClick={() =>
                driver.status === "available" && handleDriverSelect(driver.id)
              }
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={driver.avatar} alt={driver.name} />
                    <AvatarFallback>
                      {driver.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${getStatusColor(driver.status)} border-2 border-white`}
                  ></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{driver.name}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Badge variant="secondary" className="mr-2">
                      {driver.status}
                    </Badge>
                    {driver.rating && (
                      <span className="text-amber-500">★ {driver.rating}</span>
                    )}
                  </div>
                </div>
                {selectedDriverId === driver.id && (
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Check size={16} />
                  </div>
                )}
              </div>
              {driver.deliveriesCompleted && (
                <div className="mt-2 text-xs text-gray-500">
                  {driver.deliveriesCompleted} deliveries completed
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleAssignRoute}
            disabled={!selectedDriverId || assignmentComplete}
            className="flex items-center"
          >
            <UserCheck className="mr-2 h-4 w-4" />
            {assignmentComplete ? "Route Assigned" : "Assign Route"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverAssignment;
