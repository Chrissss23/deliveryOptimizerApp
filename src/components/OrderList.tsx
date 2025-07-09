import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Clock, MapPin } from "lucide-react";

interface Order {
  id: string;
  address: string;
  timePlaced: string;
  estimatedDeliveryTime: string;
  waitTime: string;
}

interface OrderListProps {
  orders?: Order[];
  onGenerateRoute?: (selectedOrderIds: string[]) => void;
}

const OrderList = ({
  orders = [
    {
      id: "1",
      address: "123 Main St, Anytown, USA",
      timePlaced: "10:30 AM",
      estimatedDeliveryTime: "11:15 AM",
      waitTime: "15 min",
    },
    {
      id: "2",
      address: "456 Oak Ave, Anytown, USA",
      timePlaced: "10:35 AM",
      estimatedDeliveryTime: "11:20 AM",
      waitTime: "20 min",
    },
    {
      id: "3",
      address: "789 Pine Rd, Anytown, USA",
      timePlaced: "10:40 AM",
      estimatedDeliveryTime: "11:25 AM",
      waitTime: "25 min",
    },
    {
      id: "4",
      address: "101 Maple Dr, Anytown, USA",
      timePlaced: "10:45 AM",
      estimatedDeliveryTime: "11:30 AM",
      waitTime: "30 min",
    },
    {
      id: "5",
      address: "202 Elm St, Anytown, USA",
      timePlaced: "10:50 AM",
      estimatedDeliveryTime: "11:35 AM",
      waitTime: "35 min",
    },
  ],
  onGenerateRoute = () => {},
}: OrderListProps) => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrders((prev) => {
      if (prev.includes(orderId)) {
        return prev.filter((id) => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  const handleGenerateRoute = () => {
    onGenerateRoute(selectedOrders);
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((order) => order.id));
    }
  };

  return (
    <Card className="w-full h-full bg-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Incoming Orders</CardTitle>
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            {selectedOrders.length === orders.length
              ? "Deselect All"
              : "Select All"}
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {selectedOrders.length} of {orders.length} orders selected
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className={`p-4 border rounded-lg transition-colors ${selectedOrders.includes(order.id) ? "border-primary bg-primary/5" : "border-border"}`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedOrders.includes(order.id)}
                    onCheckedChange={() => handleOrderSelect(order.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">Order #{order.id}</h3>
                      <Badge variant="outline" className="ml-2">
                        {order.waitTime}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{order.address}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Placed: {order.timePlaced}</span>
                      </div>
                      <div className="text-muted-foreground">
                        Est. Delivery: {order.estimatedDeliveryTime}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="mt-4">
          <Button
            className="w-full"
            disabled={selectedOrders.length === 0}
            onClick={handleGenerateRoute}
          >
            Generate Optimal Route
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderList;
