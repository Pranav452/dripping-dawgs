'use client'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { User, Calendar, CreditCard, MapPin, Bell, Settings, ShoppingBag, Edit, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from 'framer-motion'
import { toast } from "sonner"

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success("Signed out successfully")
      router.push('/login')
    } catch (error) {
      toast.error("Error signing out")
      console.error("Sign out error:", error)
    }
  }

  const mockUserData = {
    name: "John Doe",
    email: user?.email,
    memberSince: user ? new Date(user.created_at).toLocaleDateString() : '',
    recentOrders: [
      { id: "ORD-001", date: "2024-01-15", status: "Delivered", amount: 159.99, items: 3 },
      { id: "ORD-002", date: "2024-01-28", status: "In Transit", amount: 89.99, items: 2 },
      { id: "ORD-003", date: "2024-02-05", status: "Processing", amount: 199.99, items: 4 },
    ],
    address: "123 Fashion Street, Style City, ST 12345",
    paymentMethods: [
      { type: "Visa", last4: "4242", expiry: "12/25", isDefault: true },
      { type: "Mastercard", last4: "8888", expiry: "09/26", isDefault: false }
    ],
    preferences: {
      notifications: {
        orders: true,
        promotions: true,
        newsletter: false,
        reminders: true
      },
      sizes: {
        tops: "L",
        bottoms: "32",
        shoes: "UK 9"
      },
      favoriteCategories: ["Hoodies", "T-Shirts", "Sneakers"]
    }
  }

  if (!user) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-8 w-64 mx-auto mb-8" />
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold">Account Overview</h1>
            <p className="text-gray-600">Manage your profile and preferences</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" /> Edit Profile
            </Button>
            <Button 
              variant="destructive" 
              className="flex items-center gap-2"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="h-full">
              <CardHeader className="border-b bg-gray-50">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div>
                  <p className="text-lg font-semibold">{mockUserData.name}</p>
                  <p className="text-gray-600">{mockUserData.email}</p>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Member since {mockUserData.memberSince}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader className="border-b bg-gray-50">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-green-500" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {mockUserData.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${order.amount}</p>
                        <p className="text-sm text-gray-600">{order.items} items</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader className="border-b bg-gray-50">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-red-500" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">{mockUserData.address}</p>
                <Button variant="outline" size="sm" className="w-full">
                  Update Address
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader className="border-b bg-gray-50">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-purple-500" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {mockUserData.paymentMethods.map((method) => (
                  <div key={method.last4} className="flex justify-between items-center mb-4 p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="text-lg">
                        {method.type === 'Visa' ? '💳' : '💳'}
                      </div>
                      <div>
                        <p className="font-medium">{method.type} •••• {method.last4}</p>
                        <p className="text-sm text-gray-600">Expires {method.expiry}</p>
                      </div>
                    </div>
                    {method.isDefault && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Card className="h-full">
              <CardHeader className="border-b bg-gray-50">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-orange-500" />
                  Size Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {Object.entries(mockUserData.preferences.sizes).map(([category, size]) => (
                    <div key={category} className="flex justify-between items-center">
                      <p className="capitalize text-gray-600">{category}</p>
                      <span className="font-medium">{size}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <p className="text-sm font-medium mb-2">Favorite Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {mockUserData.preferences.favoriteCategories.map((cat) => (
                      <span key={cat} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Card className="h-full">
              <CardHeader className="border-b bg-gray-50">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-indigo-500" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {Object.entries(mockUserData.preferences.notifications).map(([type, enabled]) => (
                    <div key={type} className="flex justify-between items-center">
                      <p className="capitalize text-gray-600">{type}</p>
                      <span className={`text-sm font-medium ${enabled ? 'text-green-600' : 'text-red-600'}`}>
                        {enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}