import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import getFormattedPrice from "../utils/priceFormatter";
import { formatDateTime } from "../utils/timeFormatter";
import OrderDataModel from "./orderDataModel";

export default function MyOrders() {
  const token = localStorage.getItem("token");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    api.get(`/orders/me/${page}/${pageSize}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    }).then(({ data }) => {
      if (controller.signal.aborted) return;
      if (page > Math.max(1, data.totalPages)) {
        setPage(Math.max(1, data.totalPages));
        return;
      }
      setResult({ data });
    }).catch((error) => {
      if (!controller.signal.aborted) {
        setResult({ error: error.response?.status === 401 ? "login" : "failed" });
      }
    });
    return () => controller.abort();
  }, [token, page, pageSize, attempt]);

  const data = result?.data;
  const buttonClass = "rounded border border-zinc-600 px-4 py-2 text-sm font-semibold hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <section className="min-h-dvh w-full bg-[#090b10] px-4 py-12 text-white sm:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-7 border-b border-white/15 pb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-cyan-400">Your account</p>
          <h1 className="text-3xl font-semibold">My orders</h1>
          {data && <p className="mt-2 text-sm text-zinc-400">{data.totalOrders} {data.totalOrders === 1 ? "order" : "orders"}</p>}
        </header>

        {!token || result?.error === "login" ? (
          <p>Please <Link to="/login" className="text-cyan-400 underline">sign in</Link> to see your orders.</p>
        ) : result?.error ? (
          <div role="alert">
            <p className="mb-4">Your orders couldn’t be loaded.</p>
            <button className={buttonClass} onClick={() => { setResult(null); setAttempt(attempt + 1); }}>Try again</button>
          </div>
        ) : !data ? (
          <p role="status">Loading your orders…</p>
        ) : data.orders.length === 0 ? (
          <div>
            <h2 className="mb-3 text-xl font-semibold">No orders yet</h2>
            <Link to="/products" className="text-cyan-400 underline">Browse products</Link>
          </div>
        ) : (
          <>
            <ul className="space-y-3">
              {data.orders.map((order) => (
                <li key={order.orderId} className="flex flex-wrap items-center justify-between gap-4 rounded border border-white/10 bg-[#111318] p-5">
                  <div>
                    <h2 className="font-semibold">Order {order.orderId}</h2>
                    <p className="mt-1 text-sm text-zinc-400">{formatDateTime(order.date)}</p>
                  </div>
                  <span className="rounded bg-cyan-400/10 px-3 py-1 text-sm capitalize text-cyan-300">{order.status}</span>
                  <div className="flex items-center gap-4">
                    <strong>{getFormattedPrice(order.totalAmount)}</strong>
                    <div className="rounded-lg bg-white text-zinc-900">
                      <OrderDataModel order={order} isAdmin={false} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <nav aria-label="Order history pages" className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm">
              <label>Orders per page{" "}
                <select value={pageSize} className="rounded border border-zinc-600 bg-zinc-900 p-2" onChange={(event) => {
                  setResult(null);
                  setPage(1);
                  setPageSize(Number(event.target.value));
                }}>
                  {[2, 5, 10, 20].map((size) => <option key={size}>{size}</option>)}
                </select>
              </label>
              <div className="flex items-center gap-3">
                <button className={buttonClass} disabled={page <= 1} onClick={() => { setResult(null); setPage(page - 1); }}>Previous</button>
                <span>Page {page} of {data.totalPages}</span>
                <button className={buttonClass} disabled={page >= data.totalPages} onClick={() => { setResult(null); setPage(page + 1); }}>Next</button>
              </div>
            </nav>
          </>
        )}
      </div>
    </section>
  );
}
