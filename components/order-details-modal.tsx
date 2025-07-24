"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  CalendarDays,
  CreditCard,
  MapPin,
  Phone,
  User,
  Clock,
  ChefHat,
  Car,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react"

interface OrderDetailsModalProps {
  order: any
  isOpen: boolean
  onClose: () => void
  onUpdatePaymentStatus: (orderId: string, status: string) => void
  onUpdateConfirmationStatus: (orderId: string, status: string) => void
  getStatusBadge: (status: string) => string
  getPaymentStatusBadge: (status: string) => string
}

export function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  onUpdatePaymentStatus,
  onUpdateConfirmationStatus,
  getStatusBadge,
  getPaymentStatusBadge,
}: OrderDetailsModalProps) {
  if (!order) return null

  const getOrderTypeIcon = (type: string) => {
    switch (type) {
      case "delivery":
        return <Car className="h-4 w-4" />
      case "takeaway":
        return <ShoppingBag className="h-4 w-4" />
      case "dinein":
        return <UtensilsCrossed className="h-4 w-4" />
      default:
        return null
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const calculateSubtotal = () => {
    return order.cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getOrderTypeIcon(order.orderType)}
            Order Details - {order.orderId}
          </DialogTitle>
          <DialogDescription>
            View and manage order information, payment status, and confirmation details.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Order Type</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {getOrderTypeIcon(order.orderType)}
                    <span className="capitalize font-medium">{order.orderType}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <Badge className={getStatusBadge(order.status)}>{order.status}</Badge>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Created At</Label>
                <div className="flex items-center gap-2 mt-1">
                  <CalendarDays className="h-4 w-4" />
                  <span>{formatDate(order.createdAt)}</span>
                </div>
              </div>

              {order.orderType === "dinein" ? (
                <div className="space-y-2">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Table Number</Label>
                    <p className="font-medium">{order.tableNo}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Employee</Label>
                    <p>
                      {order.empName} (ID: {order.empId})
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Customer Name</Label>
                    <p className="font-medium">{order.formData?.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Contact</Label>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{order.formData?.phone}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.formData?.email}</p>
                    </div>
                  </div>
                  {order.orderType === "delivery" && order.formData?.address && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Delivery Address</Label>
                      <div className="flex items-start gap-2 mt-1">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        <div>
                          <p>{order.formData.address}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.formData.city} {order.formData.postalCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {order.orderType === "takeaway" && order.formData?.pickupTime && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Pickup Time</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-4 w-4" />
                        <span>{order.formData.pickupTime}</span>
                      </div>
                    </div>
                  )}
                  {order.formData?.instructions && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Special Instructions</Label>
                      <p className="text-sm bg-muted p-2 rounded-md mt-1">{order.formData.instructions}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment & Status Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment & Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Payment Method</Label>
                <p className="font-medium capitalize mt-1">{order.paymentMethod}</p>
              </div>

              <div>
                <Label htmlFor="payment-status" className="text-sm font-medium">
                  Payment Status
                </Label>
                <Select
                  value={order.billing?.paymentStatus || "Unpaid"}
                  onValueChange={(value) => onUpdatePaymentStatus(order.orderId, value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {order.formData && (
                <div>
                  <Label htmlFor="confirmation-status" className="text-sm font-medium">
                    Confirmation Status
                  </Label>
                  <Select
                    value={order.formData.confirmation || "pending"}
                    onValueChange={(value) => onUpdateConfirmationStatus(order.orderId, value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Current Payment Status:</span>
                  <Badge className={getPaymentStatusBadge(order.billing?.paymentStatus || "Unpaid")}>
                    {order.billing?.paymentStatus || "Unpaid"}
                  </Badge>
                </div>
                {order.formData && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium text-muted-foreground">Confirmation Status:</span>
                    <Badge className={getStatusBadge(order.formData.confirmation || "pending")}>
                      {order.formData.confirmation || "pending"}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-4 w-4" />
              Order Items ({order.cart.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.cart.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                    )}
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                        {item.category && ` • ${item.category}`}
                      </p>
                      {item.selectedItems && item.selectedItems.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {item.selectedItems.map((selected: any, idx: number) => (
                            <div key={idx}>
                              {selected.flavour && `Flavour: ${selected.flavour}`}
                              {selected.option && `Option: ${selected.option}`}
                              {selected.mealType && `Type: ${selected.mealType}`}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${item.price.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">${(item.price * item.quantity).toFixed(2)} total</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Order Summary */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              {order.billing?.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-${order.billing.discountAmount.toFixed(2)}</span>
                </div>
              )}
              {order.billing?.taxAmount > 0 && (
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${order.billing.taxAmount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${order.billing?.totalAmount?.toFixed(2) || calculateSubtotal().toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
