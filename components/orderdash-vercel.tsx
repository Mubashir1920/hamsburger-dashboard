"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Car, ShoppingBag, UtensilsCrossed, Search, Filter, Package2 } from "lucide-react"
import { OrderDetailsModal } from "./order-details-modal"

// Mock data based on the schema
const mockOrders = [
    {
        _id: "686cf13f9d4f02c738a3458c",
        orderType: "delivery",
        orderId: "ORD-1751970111557",
        status: "pending",
        formData: {
            fullName: "Mubashir",
            email: "iamu7564@gmail.com",
            phone: "03071742",
            confirmation: "pending",
        },
        paymentMethod: "cod",
        billing: {
            paymentStatus: "Unpaid",
            totalAmount: 156.84,
        },
        cart: [
            { name: "Chicken Burger", quantity: 1, price: 9.98 },
            { name: "Double Beef Cheeseburger", quantity: 3, price: 26.97 },
            { name: "Veggie Pizza", quantity: 1, price: 17.99 },
        ],
        createdAt: new Date("2025-07-08T10:21:51.831Z"),
    },
    {
        _id: "686cf13f9d4f02c738a3458d",
        orderType: "takeaway",
        orderId: "ORD-1751970111558",
        status: "confirmed",
        formData: {
            fullName: "Sarah Johnson",
            email: "sarah@email.com",
            phone: "03071743",
            confirmation: "confirmed",
            pickupTime: "2:30 PM",
        },
        paymentMethod: "card",
        billing: {
            paymentStatus: "Paid",
            totalAmount: 45.5,
        },
        cart: [
            { name: "BBQ Chicken Pizza", quantity: 1, price: 25.98 },
            { name: "French Fries", quantity: 2, price: 5.98 },
        ],
        createdAt: new Date("2025-07-08T11:15:30.000Z"),
    },
    {
        _id: "686cf13f9d4f02c738a3458e",
        orderType: "dinein",
        orderId: "ORD-1751970111559",
        status: "preparing",
        empId: "EMP001",
        empName: "John Doe",
        tableNo: "T-05",
        billing: {
            paymentStatus: "Unpaid",
            totalAmount: 78.9,
        },
        cart: [
            { name: "Family Feast Box", quantity: 1, price: 27.99 },
            { name: "Chicken Wings", quantity: 2, price: 11.98 },
        ],
        createdAt: new Date("2025-07-08T12:00:00.000Z"),
    },
    {
        _id: "686cf13f9d4f02c738a3458f",
        orderType: "delivery",
        orderId: "ORD-1751970111560",
        status: "delivered",
        formData: {
            fullName: "Mike Wilson",
            email: "mike@email.com",
            phone: "03071744",
            confirmation: "confirmed",
            address: "123 Main St",
        },
        paymentMethod: "online",
        billing: {
            paymentStatus: "Paid",
            totalAmount: 32.47,
        },
        cart: [
            { name: "Butcher Beef", quantity: 1, price: 11.98 },
            { name: "Snack Attack Box", quantity: 1, price: 8.49 },
        ],
        createdAt: new Date("2025-07-08T09:30:00.000Z"),
    },
]

const orderTypeConfig = {
    delivery: {
        label: "Delivery Orders",
        icon: Car,
        color: "bg-blue-500",
    },
    takeaway: {
        label: "Takeaway Orders",
        icon: ShoppingBag,
        color: "bg-green-500",
    },
    dinein: {
        label: "Dine-in Orders",
        icon: UtensilsCrossed,
        color: "bg-purple-500",
    },
}

export function OrderDashboard() {
    const [selectedOrderType, setSelectedOrderType] = useState<string>("all")
    const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all")
    const [confirmationFilter, setConfirmationFilter] = useState<string>("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedOrder, setSelectedOrder] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [orders, setOrders] = useState(mockOrders)

    const filteredOrders = orders.filter((order) => {
        const matchesOrderType = selectedOrderType === "all" || order.orderType === selectedOrderType
        const matchesPaymentStatus = paymentStatusFilter === "all" || order.billing?.paymentStatus === paymentStatusFilter
        const matchesConfirmation =
            confirmationFilter === "all" ||
            order.formData?.confirmation === confirmationFilter ||
            (confirmationFilter === "confirmed" && order.status === "confirmed")
        const matchesSearch =
            searchTerm === "" ||
            order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.formData?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.empName?.toLowerCase().includes(searchTerm.toLowerCase())

        return matchesOrderType && matchesPaymentStatus && matchesConfirmation && matchesSearch
    })

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: "bg-yellow-100 text-yellow-800",
            confirmed: "bg-blue-100 text-blue-800",
            preparing: "bg-orange-100 text-orange-800",
            delivered: "bg-green-100 text-green-800",
            cancelled: "bg-red-100 text-red-800",
        }
        return statusConfig[status as keyof typeof statusConfig] || "bg-gray-100 text-gray-800"
    }

    const getPaymentStatusBadge = (status: string) => {
        return status === "Paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
    }

    const updatePaymentStatus = (orderId: string, newStatus: string) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.orderId === orderId
                    ? {
                        ...order,
                        billing: { ...order.billing, paymentStatus: newStatus },
                    }
                    : order,
            ),
        )
        if (selectedOrder && selectedOrder.orderId === orderId) {
            setSelectedOrder({
                ...selectedOrder,
                billing: { ...selectedOrder.billing, paymentStatus: newStatus },
            })
        }
    }

    const updateConfirmationStatus = (orderId: string, newStatus: string) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.orderId === orderId
                    ? {
                        ...order,
                        formData: order.formData ? { ...order.formData, confirmation: newStatus } : undefined,
                        status: newStatus === "confirmed" ? "confirmed" : order.status,
                    }
                    : order,
            ),
        )
        if (selectedOrder && selectedOrder.orderId === orderId) {
            setSelectedOrder({
                ...selectedOrder,
                formData: selectedOrder.formData ? { ...selectedOrder.formData, confirmation: newStatus } : undefined,
                status: newStatus === "confirmed" ? "confirmed" : selectedOrder.status,
            })
        }
    }

    const openOrderModal = (order: any) => {
        setSelectedOrder(order)
        setIsModalOpen(true)
    }

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <Sidebar>
                    <SidebarHeader className="border-b">
                        <div className="flex items-center gap-2 px-2 py-2">
                            <Package2 className="h-6 w-6" />
                            <span className="font-semibold">Order Management</span>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Order Types</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            onClick={() => setSelectedOrderType("all")}
                                            isActive={selectedOrderType === "all"}
                                        >
                                            <Package2 className="h-4 w-4" />
                                            <span>All Orders</span>
                                            <Badge variant="secondary" className="ml-auto">
                                                {orders.length}
                                            </Badge>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    {Object.entries(orderTypeConfig).map(([type, config]) => {
                                        const count = orders.filter((order) => order.orderType === type).length
                                        const Icon = config.icon
                                        return (
                                            <SidebarMenuItem key={type}>
                                                <SidebarMenuButton
                                                    onClick={() => setSelectedOrderType(type)}
                                                    isActive={selectedOrderType === type}
                                                >
                                                    <Icon className="h-4 w-4" />
                                                    <span>{config.label}</span>
                                                    <Badge variant="secondary" className="ml-auto">
                                                        {count}
                                                    </Badge>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        )
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>

                        <SidebarGroup>
                            <SidebarGroupLabel>Filters</SidebarGroupLabel>
                            <SidebarGroupContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Payment Status</label>
                                    <Button variant="outline" className="w-full justify-between bg-transparent">
                                        {paymentStatusFilter === "all" ? "All Payments" : paymentStatusFilter}
                                        <Filter className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Confirmation</label>
                                    <Button variant="outline" className="w-full justify-between bg-transparent">
                                        {confirmationFilter === "all" ? "All Status" : confirmationFilter}
                                        <Filter className="h-4 w-4" />
                                    </Button>
                                </div>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                </Sidebar>

                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                        <SidebarTrigger className="-ml-1" />
                        <div className="flex flex-1 items-center gap-4">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search orders, customers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 space-y-4 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    {selectedOrderType === "all"
                                        ? "All Orders"
                                        : orderTypeConfig[selectedOrderType as keyof typeof orderTypeConfig]?.label}
                                </h1>
                                <p className="text-muted-foreground">{filteredOrders.length} orders found</p>
                            </div>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Orders</CardTitle>
                                <CardDescription>Manage and track all your orders in one place</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order ID</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Customer/Table</TableHead>
                                            <TableHead>Items</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Payment</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredOrders.map((order) => {
                                            const config = orderTypeConfig[order.orderType as keyof typeof orderTypeConfig]
                                            const Icon = config.icon
                                            return (
                                                <TableRow
                                                    key={order._id}
                                                    className="cursor-pointer hover:bg-muted/50"
                                                    onClick={() => openOrderModal(order)}
                                                >
                                                    <TableCell className="font-medium">{order.orderId}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-2 h-2 rounded-full ${config.color}`} />
                                                            <Icon className="h-4 w-4" />
                                                            <span className="capitalize">{order.orderType}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {order.orderType === "dinein" ? (
                                                            <div>
                                                                <div className="font-medium">{order.tableNo}</div>
                                                                <div className="text-sm text-muted-foreground">{order.empName}</div>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <div className="font-medium">{order.formData?.fullName}</div>
                                                                <div className="text-sm text-muted-foreground">{order.formData?.phone}</div>
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm">
                                                            {order.cart.slice(0, 2).map((item, idx) => (
                                                                <div key={idx}>
                                                                    {item.quantity}x {item.name}
                                                                </div>
                                                            ))}
                                                            {order.cart.length > 2 && (
                                                                <div className="text-muted-foreground">+{order.cart.length - 2} more</div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium">${order.billing?.totalAmount?.toFixed(2)}</TableCell>
                                                    <TableCell>
                                                        <Badge className={getPaymentStatusBadge(order.billing?.paymentStatus || "Unpaid")}>
                                                            {order.billing?.paymentStatus || "Unpaid"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={getStatusBadge(order.status)}>{order.status}</Badge>
                                                    </TableCell>
                                                    <TableCell>{order.createdAt.toLocaleDateString()}</TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </main>
                </SidebarInset>
            </div>
            <OrderDetailsModal
                order={selectedOrder}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUpdatePaymentStatus={updatePaymentStatus}
                onUpdateConfirmationStatus={updateConfirmationStatus}
                getStatusBadge={getStatusBadge}
                getPaymentStatusBadge={getPaymentStatusBadge}
            />
        </SidebarProvider>
    )
}