import { useEffect, useState } from "react";

import api from "../../utils/api";
import getFormattedPrice from "../../utils/priceFormatter";
import LoadingScreen from "../../components/loadingScreen";
import { formatDateTime } from "../../utils/timeFormatter";
import OrderDataModel from "../../components/orderDataModel";

export default function AdminOrdersPage() {
     
      const [orders, setOrders] = useState([]);
      const [loading, setLoading] = useState(true);
      const [pageNumber, setPageNumber] = useState(1);
      const [pageSize, setPageSize] = useState(10);
      const [totalOrders, setTotalOrders] = useState(0);
      const [totalPages, setTotalPages] = useState(1);
      const [draftSearch, setDraftSearch] = useState("");
      const [search, setSearch] = useState("");
      const [status, setStatus] = useState("");
      const [error, setError] = useState(false);
      const [refresh, setRefresh] = useState(0);
      useEffect(() => {
            const token = localStorage.getItem("token");

            const controller = new AbortController();
            setLoading(true);
            setError(false);

            api.get(`/orders/${pageNumber}/${pageSize}`, {
                  signal: controller.signal,
                  params: { search, status },
                  headers: {
                        Authorization: `Bearer ${token}`
                  }
            })
            .then((res) => {
                  if (controller.signal.aborted) return;
                  const lastPage = Math.max(1, res.data.totalPages);
                  if (pageNumber > lastPage) {
                        setPageNumber(lastPage);
                        return;
                  }
                  setOrders(res.data.orders || []);
                  setTotalOrders(res.data.totalOrders);
                  setTotalPages(res.data.totalPages);
            })
            .catch(() => {
                  if (!controller.signal.aborted) setError(true);
            })
            .finally(() => {
                  if (!controller.signal.aborted) setLoading(false);
            });

            return () => controller.abort();
      }, [pageNumber, pageSize, search, status, refresh]);
    
      
    return (

      <div className = "w-full min-h-full flex flex-col items-center ">

            <div className="w-full min-h-[90px] bg-white shadow-lg rounded-2xl flex items-center justify-between px-6 py-4 border border-gray-100">
            
                  <div>
                        <p className="text-sm text-gray-500 font-medium">Order Overview</p>
                        <h1 className="text-2xl font-bold text-accent mt-1">Orders</h1>
                  </div>

                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
                        <span className="text-2xl font-bold text-accent">{loading || error ? "—" : totalOrders}</span>
                  </div>

            </div>

            <form className="mt-4 flex w-full flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-white p-4"
                  onSubmit={(event) => {
                        event.preventDefault();
                        setSearch(draftSearch.trim());
                        setPageNumber(1);
                  }}>
                  <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm font-medium">
                        Search orders
                        <input type="search" value={draftSearch} maxLength={100}
                              onChange={(event) => setDraftSearch(event.target.value)}
                              placeholder="Order ID or customer email"
                              className="min-w-0 rounded-lg border border-gray-300 px-3 py-2" />
                  </label>
                  <label className="flex flex-col gap-1 text-sm font-medium">
                        Order status
                        <select value={status} className="rounded-lg border border-gray-300 px-3 py-2"
                              onChange={(event) => {
                                    setStatus(event.target.value);
                                    setSearch(draftSearch.trim());
                                    setPageNumber(1);
                              }}>
                              <option value="">All statuses</option>
                              {["pending", "processing", "shipped", "delivered", "completed", "cancelled"].map(value => (
                                    <option key={value} value={value}>{value[0].toUpperCase() + value.slice(1)}</option>
                              ))}
                        </select>
                  </label>
                  <button className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white">Search</button>
                  <button type="button" className="rounded-lg border border-gray-300 px-4 py-2 text-sm" onClick={() => {
                        setDraftSearch("");
                        setSearch("");
                        setStatus("");
                        setPageNumber(1);
                  }}>Clear filters</button>
            </form>

            {loading ? <LoadingScreen /> : error ? (
                  <p role="alert" className="py-8">Couldn’t load orders.{" "}
                        <button className="underline" onClick={() => setRefresh(value => value + 1)}>Try again</button>
                  </p>
            ) : !orders.length ? (
                  <p role="status" className="py-8">{status || search ? "No orders match these filters." : "No orders yet."}</p>
            ) : <>
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
                                                isAdmin={true}
                                                order={order}
                                                onStatusChange={() => setRefresh(value => value + 1)}
                                          />
                                    </td>

                                                                        
                              </tr>
                              ))}
                        </tbody>
                  </table>
            </div>




            {/* page navigation bar */}

            <nav aria-label="Order pagination" className="sticky bottom-0 z-20 mt-auto w-full shrink-0 pt-3">
              <div className="mx-auto flex w-fit max-w-full flex-wrap items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#10151F] [color-scheme:dark] px-2 py-3 shadow-lg sm:gap-5 sm:px-4">
                  <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-300 font-medium">Show</span>

                        <select value={pageSize} onChange={(e) => {
                                                                  setPageSize(Number(e.target.value));
                                                                  setPageNumber(1);
                                                            }}
                              className="border border-white/15 rounded-lg px-3 py-2 text-sm font-medium bg-[#10151F] text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                              <option value={2}>2</option>
                              <option value={5}>5</option>
                              <option value={10}>10</option>
                              <option value={20}>20</option>
                        </select>

                        <span className="text-sm text-slate-300">per page</span>
                  </div>

                  <div className="hidden h-7 w-px bg-white/10 sm:block"></div>

                  <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-3">
                        <button
                              disabled={pageNumber === 1}
                              onClick={() => setPageNumber(pageNumber - 1)}
                              className="px-4 py-2 rounded-lg text-sm font-semibold border border-white/10 text-slate-300 enabled:hover:bg-white/5 enabled:hover:text-white focus-visible:outline-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                              Previous
                        </button>

                        <div className="px-3 text-sm font-medium text-slate-400">
                              Page
                              <span className="mx-1 text-blue-400 font-bold">{pageNumber}</span>
                              of
                              <span className="ml-1 font-bold text-slate-100">{totalPages}</span>
                        </div>

                        <button
                              disabled={pageNumber === totalPages}
                              onClick={() => setPageNumber(pageNumber + 1)}
                              className="px-4 py-2 rounded-lg text-sm font-semibold border border-blue-500/20 bg-blue-500/15 text-blue-400 enabled:hover:bg-blue-500/25 focus-visible:outline-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                              Next
                        </button>
                  </div>
              </div>
            </nav>

            </>}
      </div>
    )
} 
