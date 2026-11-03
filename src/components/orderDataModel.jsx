import { useEffect, useRef, useState } from "react";
import { FaEye, FaTimes, FaCopy, FaCheck, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaBoxOpen, FaUser } from "react-icons/fa";

import getFormattedPrice from "../utils/priceFormatter";
import api from "../utils/api";
import toast from "react-hot-toast";


import OrderStatusBadge from "./orderStatusBadge";


export default function OrderDataModel({ isAdmin, order, onStatusChange  }) {

      const [isModelOpen, setModelOpen] = useState(false);
      const [copied, setCopied] = useState(false);
      const [status, setStatus] = useState(order.status || "pending");
      const [statusUpdating, setStatusUpdating] = useState(false);

      const closeRef = useRef(null);


      const items = order.items || [];


      // Total number of product units
      const itemCount = items.reduce((total, item) => {
            return total + Number(item.qty || 0);
      }, 0);


      // Total price of all items
      const itemsTotal = items.reduce((total, item) => {
            return total + Number(item.product.price) * Number(item.qty);
      }, 0);


      // Other charges
      const otherCharges = Number(order.totalAmount) - itemsTotal;




      // Update local status when order prop changes
      useEffect(() => {
            setStatus(order.status || "pending");
      }, [order.status]);


      // Modal Escape key + page scroll lock
      useEffect(() => {

            if (!isModelOpen) return;

            const closeOnEscape = (e) => {
                  if (e.key === "Escape") {
                        setModelOpen(false);
                  }
            };

            document.addEventListener("keydown", closeOnEscape);

            const previousOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";

            closeRef.current?.focus();

            return () => {
                  document.removeEventListener("keydown", closeOnEscape);
                  document.body.style.overflow = previousOverflow;
            };

      }, [isModelOpen]);


      // Copy order ID
      async function copyOrderId() {

            try {

                  await navigator.clipboard.writeText(order.orderId);

                  setCopied(true);

                  setTimeout(() => {
                        setCopied(false);
                  }, 1500);

            } catch (error) {
                  console.error(error);
            }

      }


      // Update order status
      async function updateOrderStatus(newStatus) {

      if (newStatus === status) return;

      const token = localStorage.getItem("token");
      const previousStatus = status;

      setStatus(newStatus);
      setStatusUpdating(true);

      try {

            await api.put(
                  `/orders/${order.orderId}`,
                  {
                        status: newStatus
                  },
                  {
                        headers: {
                              Authorization: `Bearer ${token}`
                        }
                  }
            );

            // Update status in AdminOrdersPage
            if (onStatusChange) {
                  onStatusChange(order.orderId, newStatus);
            }

            toast.success("Status updated successfully");

      } catch (error) {

            console.error(error);

            // Restore old status if backend update failed
            setStatus(previousStatus);

            toast.error("Failed to update order status");

      } finally {

            setStatusUpdating(false);

      }
}


      return (
            <>

                  {/* View Button */}
                  <button aria-label={`View details for order ${order.orderId}`} title="View order details" onClick={() => setModelOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-lg bg-accent/10 text-accent hover:bg-accent hover:text-white transition duration-200 cursor-pointer">
                        <FaEye />
                  </button>


                  {/* Modal */}
                  {isModelOpen && (

                        <div onMouseDown={(e) => e.target === e.currentTarget && setModelOpen(false)} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">


                              {/* Modal Container */}
                              <div className="w-full max-w-[950px] max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">


                                    {/* Header */}
                                    <div className="bg-accent px-6 py-5 flex items-center justify-between">


                                          {/* Order ID */}
                                          <div>

                                                <p className="text-white/70 text-sm font-medium">
                                                      Order Details
                                                </p>


                                                <div className="flex flex-wrap items-center gap-3 mt-1">

                                                      <h2 className="text-white text-2xl font-bold">
                                                            {order.orderId}
                                                      </h2>


                                                      {/* Copy Button */}
                                                      <button onClick={copyOrderId} title="Copy Order ID" className="w-7 h-7 flex items-center justify-center rounded-md bg-white/10 text-white hover:bg-white hover:text-accent transition cursor-pointer">

                                                            {copied ? (
                                                                  <FaCheck size={12} />
                                                            ) : (
                                                                  <FaCopy size={12} />
                                                            )}

                                                      </button>


                                                      {/* Status Badge */}
                                                      <OrderStatusBadge status={status} />

                                                </div>

                                          </div>


                                          {/* Close */}
                                          <button ref={closeRef} onClick={() => setModelOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-accent transition cursor-pointer">
                                                <FaTimes />
                                          </button>

                                    </div>



                                    {/* Body */}
                                    <div className="flex-1 overflow-y-auto">

                                          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr]">


                                                {/* LEFT SIDE */}
                                                {/* Customer Information */}
                                                <div className="bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200 p-6">


                                                      {/* Customer */}
                                                      <div className="space-y-6">


                                                            <div className="grid grid-cols-[42px_1fr] gap-4 items-center">

                                                                  <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                                                                        <FaUser />
                                                                  </div>

                                                                  <div className="min-w-0 text-left">

                                                                        <p className="text-xs text-gray-400 uppercase font-semibold">
                                                                              Customer
                                                                        </p>

                                                                        <p className="text-sm text-gray-900 font-bold mt-1">
                                                                              {order.firstName} {order.lastName}
                                                                        </p>

                                                                  </div>

                                                            </div>



                                                            {/* Email */}
                                                            <div className="grid grid-cols-[42px_1fr] gap-4 items-center">

                                                                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 text-accent flex items-center justify-center">
                                                                        <FaEnvelope size={13} />
                                                                  </div>

                                                                  <div className="min-w-0 text-left">

                                                                        <p className="text-xs text-gray-400 uppercase font-semibold">
                                                                              Email
                                                                        </p>

                                                                        <a href={`mailto:${order.email}`} className="block text-sm text-gray-700 font-medium mt-1 break-all hover:text-accent">
                                                                              {order.email}
                                                                        </a>

                                                                  </div>

                                                            </div>



                                                            {/* Phone */}
                                                            <div className="grid grid-cols-[42px_1fr] gap-4 items-center">

                                                                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 text-accent flex items-center justify-center">
                                                                        <FaPhoneAlt size={12} />
                                                                  </div>

                                                                  <div className="min-w-0 text-left">

                                                                        <p className="text-xs text-gray-400 uppercase font-semibold">
                                                                              Phone
                                                                        </p>

                                                                        <a href={`tel:${order.phone}`} className="block text-sm text-gray-700 font-medium mt-1 hover:text-accent">
                                                                              {order.phone}
                                                                        </a>

                                                                  </div>

                                                            </div>



                                                            {/* Delivery Address */}
                                                            <div className="grid grid-cols-[42px_1fr] gap-4 items-start">

                                                                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 text-accent flex items-center justify-center">
                                                                        <FaMapMarkerAlt size={13} />
                                                                  </div>


                                                                  <div className="min-w-0 text-left">

                                                                        <p className="text-xs text-gray-400 uppercase font-semibold">
                                                                              Delivery Address
                                                                        </p>


                                                                        <div className="text-sm text-gray-700 font-medium leading-6 mt-1 text-left">

                                                                              <p>
                                                                                    {order.addressLine1}
                                                                              </p>

                                                                              {order.addressLine2 && (
                                                                                    <p>
                                                                                          {order.addressLine2}
                                                                                    </p>
                                                                              )}

                                                                              <p>
                                                                                    {order.city}
                                                                              </p>

                                                                        </div>

                                                                  </div>

                                                            </div>

                                                      </div>



                                                      {/* Order Information */}
                                                      <div className="mt-7 pt-5 border-t border-gray-200">


                                                            <div className="flex items-center justify-between text-sm mb-3">

                                                                  <span className="text-gray-500">
                                                                        Products
                                                                  </span>

                                                                  <span className="font-semibold text-gray-900">
                                                                        {items.length}
                                                                  </span>

                                                            </div>


                                                            <div className="flex items-center justify-between text-sm mb-5">

                                                                  <span className="text-gray-500">
                                                                        Total Units
                                                                  </span>

                                                                  <span className="font-semibold text-gray-900">
                                                                        {itemCount}
                                                                  </span>

                                                            </div>



                                                            {/* Update Status */}
                                                            <div>

                                                                  <label className="block text-xs text-gray-400 uppercase font-semibold mb-2">
                                                                        Order Status
                                                                  </label>
                                                                  
                                                                  {isAdmin && 
                                                                  
                                                                  
                                                                  
                                                                  <select value={status} disabled={statusUpdating} onChange={(e) => updateOrderStatus(e.target.value)} className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">

                                                                        <option value="pending">
                                                                              Pending
                                                                        </option>

                                                                        <option value="processing">
                                                                              Processing
                                                                        </option>

                                                                        <option value="shipped">
                                                                              Shipped
                                                                        </option>

                                                                        <option value="delivered">
                                                                              Delivered
                                                                        </option>

                                                                        <option value="completed">
                                                                              Completed
                                                                        </option>

                                                                        <option value="cancelled">
                                                                              Cancelled
                                                                        </option>

                                                                        <option value="returned">
                                                                              Returned
                                                                        </option>

                                                                  </select>}


                                                                  {statusUpdating && (
                                                                        <p className="text-xs text-gray-400 mt-2">
                                                                              Updating status...
                                                                        </p>
                                                                  )}

                                                            </div>

                                                      </div>

                                                </div>



                                                {/* RIGHT SIDE */}
                                                {/* Order Items */}
                                                <div className="p-6">


                                                      {/* Title */}
                                                      <div className="flex items-center justify-between mb-5">

                                                            <div className="flex items-center gap-2">

                                                                  <FaBoxOpen className="text-accent" />

                                                                  <h3 className="font-bold text-gray-900">
                                                                        Order Items
                                                                  </h3>

                                                            </div>


                                                            <span className="text-sm text-gray-500">

                                                                  {itemCount}

                                                                  {itemCount === 1 ? " item" : " items"}

                                                            </span>

                                                      </div>



                                                      {/* No Items */}
                                                      {items.length === 0 && (

                                                            <div className="w-full py-12 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400">

                                                                  <FaBoxOpen size={30} />

                                                                  <p className="mt-3 text-sm">
                                                                        No products in this order
                                                                  </p>

                                                            </div>

                                                      )}



                                                      {/* Product List */}
                                                      <div className="space-y-3">

                                                            {items.map((item) => (

                                                                  <div key={item.product.productId} className="w-full border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:border-accent/30 hover:shadow-md transition">


                                                                        {/* Product Image */}
                                                                        <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover border border-gray-200 bg-gray-50 shrink-0" />



                                                                        {/* Product Details */}
                                                                        <div className="flex-1 min-w-0">

                                                                              <h4 className="font-semibold text-gray-900 truncate">
                                                                                    {item.product.name}
                                                                              </h4>

                                                                              <p className="text-xs text-gray-400 mt-1">
                                                                                    ID: {item.product.productId}
                                                                              </p>


                                                                              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">

                                                                                    <span>
                                                                                          Qty:
                                                                                          <span className="font-semibold text-gray-800 ml-1">
                                                                                                {item.qty}
                                                                                          </span>
                                                                                    </span>

                                                                                    <span>
                                                                                          ×
                                                                                    </span>

                                                                                    <span>
                                                                                          {getFormattedPrice(item.product.price)}
                                                                                    </span>

                                                                              </div>

                                                                        </div>



                                                                        {/* Product Total */}
                                                                        <div className="text-right shrink-0">

                                                                              <p className="text-xs text-gray-400">
                                                                                    Subtotal
                                                                              </p>

                                                                              <p className="font-bold text-gray-900 mt-1">
                                                                                    {getFormattedPrice(item.product.price * item.qty)}
                                                                              </p>

                                                                        </div>

                                                                  </div>

                                                            ))}

                                                      </div>

                                                </div>

                                          </div>

                                    </div>



                                    {/* Footer */}
                                    <div className="border-t border-gray-200 bg-white px-6 py-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">


                                          {/* Payment Summary */}
                                          <div className="w-full sm:w-[360px]">


                                                <div className="flex justify-between text-sm text-gray-500 mb-2">

                                                      <span>
                                                            Items Subtotal
                                                      </span>

                                                      <span>
                                                            {getFormattedPrice(itemsTotal)}
                                                      </span>

                                                </div>



                                                {otherCharges > 0 && (

                                                      <div className="flex justify-between text-sm text-gray-500 mb-2">

                                                            <span>
                                                                  Delivery / Other Charges
                                                            </span>

                                                            <span>
                                                                  {getFormattedPrice(otherCharges)}
                                                            </span>

                                                      </div>

                                                )}



                                                <div className="flex justify-between items-center border-t border-gray-200 pt-3">

                                                      <span className="font-bold text-gray-900">
                                                            Total Amount
                                                      </span>

                                                      <span className="text-2xl font-bold text-accent">
                                                            {getFormattedPrice(order.totalAmount)}
                                                      </span>

                                                </div>

                                          </div>



                                          {/* Close */}
                                          <button onClick={() => setModelOpen(false)} className="px-7 py-2.5 rounded-lg bg-accent text-white font-semibold hover:opacity-90 transition cursor-pointer">
                                                Close
                                          </button>

                                    </div>

                              </div>

                        </div>

                  )}

            </>
      );
}
