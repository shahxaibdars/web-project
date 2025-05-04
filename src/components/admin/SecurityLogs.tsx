"use client"

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Download } from "lucide-react";

interface SecurityLog {
  id: string;
  timestamp: string;
  event: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  user: string;
  ipAddress: string;
  details: string;
}

const SecurityLogs = () => {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<SecurityLog[]>([]);
  const [severity, setSeverity] = useState<string>('all');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulated security logs data
    const dummyLogs: SecurityLog[] = [
      {
        id: '1',
        timestamp: '2024-04-21T10:30:00Z',
        event: 'Failed login attempt',
        severity: 'high',
        user: 'john.doe@example.com',
        ipAddress: '192.168.1.100',
        details: 'Multiple failed login attempts from same IP'
      },
      {
        id: '2',
        timestamp: '2024-04-21T09:15:00Z',
        event: 'Password changed',
        severity: 'low',
        user: 'jane.smith@example.com',
        ipAddress: '192.168.1.101',
        details: 'User changed their password'
      },
      {
        id: '3',
        timestamp: '2024-04-21T08:45:00Z',
        event: 'Suspicious activity',
        severity: 'critical',
        user: 'unknown',
        ipAddress: '192.168.1.102',
        details: 'Multiple rapid API calls detected'
      }
    ];
    setLogs(dummyLogs);
    setFilteredLogs(dummyLogs);
  }, []);

  useEffect(() => {
    let filtered = [...logs];

    // Filter by severity
    if (severity !== 'all') {
      filtered = filtered.filter(log => log.severity === severity);
    }

    // Filter by date
    if (date) {
      const dateStr = format(date, 'yyyy-MM-dd');
      filtered = filtered.filter(log => log.timestamp.startsWith(dateStr));
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress.includes(searchTerm) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  }, [logs, severity, date, searchTerm]);

  const handleExport = () => {
    const csvContent = [
      ['Timestamp', 'Event', 'Severity', 'User', 'IP Address', 'Details'],
      ...filteredLogs.map(log => [
        log.timestamp,
        log.event,
        log.severity,
        log.user,
        log.ipAddress,
        log.details
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Security Logs</h1>
        <Button onClick={handleExport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Logs
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <Select value={severity} onValueChange={setSeverity}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Input
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>User</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
              <TableCell>{log.event}</TableCell>
              <TableCell className={getSeverityColor(log.severity)}>
                {log.severity.charAt(0).toUpperCase() + log.severity.slice(1)}
              </TableCell>
              <TableCell>{log.user}</TableCell>
              <TableCell>{log.ipAddress}</TableCell>
              <TableCell>{log.details}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SecurityLogs; 