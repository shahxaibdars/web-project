"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Send, Bell } from "lucide-react"
import type { Notification } from "@/types"

// Dummy data for notifications
const dummyNotifications: Notification[] = [
  {
    id: "1",
    title: "Loan Application Status Update",
    message: "Your loan application has been approved. Please check your account for details.",
    recipient: "John Doe",
    date: "2024-05-15T10:30:00",
    read: false,
  },
  {
    id: "2",
    title: "Tax Calculation Reminder",
    message: "Remember to calculate the tax for all approved loans before disbursement.",
    recipient: "All Users",
    date: "2024-05-14T15:45:00",
    read: true,
  },
  {
    id: "3",
    title: "System Maintenance",
    message: "The system will be down for maintenance on May 20th from 2-4 PM.",
    recipient: "All Users",
    date: "2024-05-13T09:15:00",
    read: true,
  },
]

// Dummy data for users
const dummyUsers = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
  { id: "3", name: "Robert Johnson", email: "robert@example.com" },
  { id: "4", name: "Emily Davis", email: "emily@example.com" },
]

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications)
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [recipient, setRecipient] = useState("all")
  const [isSending, setIsSending] = useState(false)

  const handleSendNotification = () => {
    if (!title.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)

    // Simulate sending notification
    setTimeout(() => {
      const newNotification: Notification = {
        id: (notifications.length + 1).toString(),
        title,
        message,
        recipient: recipient === "all" ? "All Users" : dummyUsers.find(u => u.id === recipient)?.name || "Unknown User",
        date: new Date().toISOString(),
        read: false,
      }

      setNotifications([newNotification, ...notifications])
      
      // Reset form
      setTitle("")
      setMessage("")
      setRecipient("all")
      
      toast({
        title: "Success",
        description: "Notification sent successfully",
      })
      
      setIsSending(false)
    }, 1000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Notification Center</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Send Notification Form */}
        <Card>
          <CardHeader>
            <CardTitle>Send Notification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <input
                  id="title"
                  className="w-full p-2 border rounded-md bg-charcoal border-emerald/20 text-off-white"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter notification title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  className="min-h-[120px] bg-charcoal border-emerald/20 text-off-white"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter notification message"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient</Label>
                <select
                  id="recipient"
                  className="w-full p-2 border rounded-md bg-charcoal border-emerald/20 text-off-white"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                >
                  <option value="all">All Users</option>
                  {dummyUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <Button 
                className="w-full bg-emerald text-navy hover:bg-emerald/90" 
                onClick={handleSendNotification}
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send Notification"}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification History */}
        <Card>
          <CardHeader>
            <CardTitle>Notification History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 rounded-lg border ${
                      notification.read 
                        ? "bg-charcoal border-emerald/10" 
                        : "bg-emerald/10 border-emerald/30"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-emerald">{notification.title}</h3>
                      <Bell className={`h-4 w-4 ${notification.read ? "text-muted-foreground" : "text-emerald"}`} />
                    </div>
                    <p className="mt-1 text-sm text-off-white/80">{notification.message}</p>
                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                      <span>To: {notification.recipient}</span>
                      <span>{formatDate(notification.date)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No notifications sent yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 