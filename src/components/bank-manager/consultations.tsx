"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

const mockClients = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Bob Wilson" },
];

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

export function Consultations() {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSchedule = async () => {
    if (!selectedClient || !selectedTime) {
      toast({
        title: "Error",
        description: "Please select both client and time slot",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Success",
        description: "Consultation scheduled successfully",
      });
      setSelectedClient("");
      setSelectedTime("");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Schedule Consultation</h1>
      
      <div className="space-y-4 max-w-md">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Client</label>
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a client" />
            </SelectTrigger>
            <SelectContent>
              {mockClients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Select Time Slot</label>
          <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a time slot" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSchedule}
          disabled={loading || !selectedClient || !selectedTime}
          className="w-full"
        >
          {loading ? "Scheduling..." : "Schedule Consultation"}
        </Button>
      </div>
    </div>
  );
} 