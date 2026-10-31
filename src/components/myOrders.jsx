
import { useEffect, useState } from "react";

import api from "../utils/api";
import getFormattedPrice from "../utils/priceFormatter";
import LoadingScreen from "./loadingScreen";
import { formatDateTime } from "../utils/timeFormatter";
import OrderDataModel from "./orderDataModel";

export default function MyOrders() {
     
      const [orders, setOrders] = useState([]);
      const [loading, setLoading] = useState(true);
      const [pageNumber, setPageNumber] = useState(1);
      const [pageSize, setPageSize] = useState(10);
      const [totalOrders, setTotalOrders] = useState(0);
      const [totalPages, setTotalPages] = useState(1);
      //load the date forom backend
      useEffect(() => {
            const token = localStorage.getItem("token");

            setLoading(true);

            api.get(`/orders/${pageNumber}/${pageSize}`, {
                  headers: {
                        Authorization: `Bearer ${token}`
                  }
            })
            .then((res) => {
                  setOrders(res.data.orders || []);
                  setTotalOrders(res.data.totalOrders);
                  setTotalPages(res.data.totalPages);
            })
            .catch((err) => {
                  console.error(err);
            })
            .finally(() => {
                  setLoading(false);
            });

      }, [pageNumber, pageSize]);
    
      
    return (

      <div className = "w-full min-h-full flex flex-col items-center ">

            <div className="w-full min-h-[90px] bg-white shadow-lg rounded-2xl flex items-center justify-between px-6 py-4 border border-gray-100">
            
                  <div>
                        <p className="text-sm text-gray-500 font-medium">My Orders</p>
                        <h1 className="text-2xl font-bold text-accent mt-1">{orders.length} Orders</h1>
                  </div>

                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
                        <span className="text-2xl font-bold text-accent">{orders.length}</span>
                  </div>

            </div>

            {
            loading && <LoadingScreen />
            }

            <div className="w-full overflow-x-auto mt-6 rounded-2xl shadow-lg border border-gray-200 bg-white">
                  <table className="w-full text-sm text-left">
                        <thead className="bg-accent text-white uppercase text-xs">
                              <tr className="h-14">
                                    <th className="px-4 py-3 text-center">Order Id</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">City </th>
                                    <th className="px-4 py-3">Phone</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Total Amount</th>
                                    <th className="px-4 py-3 text-center">Action</th>
                              </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                              {orders.map((order) => (
                              <tr key={order.orderId} className="bg-white hover:bg-gray-50 transition-colors duration-200">
                                    
                                    <td className="px-4 py-3 text-center font-semibold text-gray-700"> {order.orderId} </td>
                                    <td className="px-4 py-3 font-medium text-gray-700">{order.email}</td>
                                    <td className="px-4 py-3 font-semibold text-gray-800">{order.firstName + " " + order.lastName}</td>
                                    <td className="px-4 py-3 font-semibold text-gray-800">{order.city}</td>
                                    <td className="px-4 py-3 text-gray-600 ">{order.phone}</td>
                                    <td className="px-4 py-3 text-gray-600">{order.status}</td>
                                    <td className="px-4 py-3 text-gray-600">{formatDateTime(order.date)}</td> 
                                    <td className="px-4 py-3 text-center font-semibold text-gray-700">{getFormattedPrice(order.totalAmount)}</td>
                                    <td className="px-4 py-3 text-center">
                                         <OrderDataModel
                                                isAdmin = {false}
                                                order={order}
                                                onStatusChange={(orderId, newStatus) => {
                                                      setOrders((previousOrders) =>
                                                            previousOrders.map((item) =>
                                                                  item.orderId === orderId
                                                                        ? { ...item, status: newStatus }
                                                                        : item
                                                            )
                                                      );
                                                }}
                                          />
                                    </td>

                                                                        
                              </tr>
                              ))}
                        </tbody>
                  </table>
            </div>




            {/* page navigation bar */}

            <div className="fixed bottom-5 z-40 bg-white border border-gray-200 shadow-lg rounded-xl px-4 py-3 flex items-center gap-5">
                  <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 font-medium">Show</span>

                        <select value={pageSize} onChange={(e) => {
                                                                  setPageSize(Number(e.target.value));
                                                                  setPageNumber(1);
                                                            }}
                              className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium bg-white text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                              <option value={2}>2</option>
                              <option value={5}>5</option>
                              <option value={10}>10</option>
                              <option value={20}>20</option>
                        </select>

                        <span className="text-sm text-gray-500">per page</span>
                  </div>

                  <div className="h-7 w-px bg-gray-200"></div>

                  <div className="flex items-center gap-3">
                        <button
                              disabled={pageNumber === 1}
                              onClick={() => setPageNumber(pageNumber - 1)}
                              className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                              Previous
                        </button>

                        <div className="px-3 text-sm font-medium text-gray-600">
                              Page
                              <span className="mx-1 text-blue-600 font-bold">{pageNumber}</span>
                              of
                              <span className="ml-1 font-bold text-gray-800">{totalPages}</span>
                        </div>

                        <button
                              disabled={pageNumber === totalPages}
                              onClick={() => setPageNumber(pageNumber + 1)}
                              className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                              Next
                        </button>
                  </div>
            </div>
        

      </div>
        
        
    )
} 