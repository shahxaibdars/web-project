import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserRoleManagement from '@/components/admin/UserRoleManagement';
import SystemPerformance from '@/components/admin/SystemPerformance';
import SecurityLogs from '@/components/admin/SecurityLogs';

const AdminDashboard = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="roles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="roles">User Roles</TabsTrigger>
          <TabsTrigger value="performance">System Performance</TabsTrigger>
          <TabsTrigger value="security">Security Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="roles">
          <UserRoleManagement />
        </TabsContent>

        <TabsContent value="performance">
          <SystemPerformance />
        </TabsContent>

        <TabsContent value="security">
          <SecurityLogs />
        </TabsContent>
        
      </Tabs>
    </div>
  );
};

export default AdminDashboard; 