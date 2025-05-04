"use client"

import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface SystemMetrics {
  uptime: number;
  responseTime: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
}

const SystemPerformance = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    uptime: 99.9,
    responseTime: 150,
    errorRate: 0.1,
    cpuUsage: 45,
    memoryUsage: 60
  });

  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        responseTime: Math.random() * 200 + 100,
        errorRate: Math.random() * 0.5,
        cpuUsage: Math.random() * 100,
        memoryUsage: Math.random() * 100
      }));

      // Generate alerts based on thresholds
      const newAlerts: string[] = [];
      if (metrics.responseTime > 300) newAlerts.push('High response time detected');
      if (metrics.errorRate > 0.2) newAlerts.push('Error rate exceeded threshold');
      if (metrics.cpuUsage > 80) newAlerts.push('High CPU usage detected');
      if (metrics.memoryUsage > 85) newAlerts.push('High memory usage detected');
      
      setAlerts(newAlerts);
    }, 5000);

    return () => clearInterval(interval);
  }, [metrics]);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">System Performance Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">System Uptime</h3>
          <div className="text-3xl font-bold">{metrics.uptime}%</div>
          <Progress value={metrics.uptime} className="mt-2" />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Response Time</h3>
          <div className="text-3xl font-bold">{metrics.responseTime.toFixed(2)}ms</div>
          <Progress 
            value={(metrics.responseTime / 500) * 100} 
            className="mt-2"
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Error Rate</h3>
          <div className="text-3xl font-bold">{(metrics.errorRate * 100).toFixed(2)}%</div>
          <Progress 
            value={metrics.errorRate * 100} 
            className="mt-2"
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">CPU Usage</h3>
          <div className="text-3xl font-bold">{metrics.cpuUsage.toFixed(1)}%</div>
          <Progress 
            value={metrics.cpuUsage} 
            className="mt-2"
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Memory Usage</h3>
          <div className="text-3xl font-bold">{metrics.memoryUsage.toFixed(1)}%</div>
          <Progress 
            value={metrics.memoryUsage} 
            className="mt-2"
          />
        </Card>
      </div>

      {alerts.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Active Alerts</h2>
          {alerts.map((alert, index) => (
            <Alert key={index} variant="destructive" className="mb-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Alert</AlertTitle>
              <AlertDescription>{alert}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
};

export default SystemPerformance; 