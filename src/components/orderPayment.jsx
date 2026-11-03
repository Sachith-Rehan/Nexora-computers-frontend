import { useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/api";
import formatPrice from "../utils/priceFormatter";

export default function OrderPayment({ order, isAdmin = false, onChange }) {
  const [saved, setSaved] = useState(order);
  const [reference, setReference] = useState(order.transferReference || "");
  const [busy, setBusy] = useState(false);
  if (saved.paymentMethod !== "bank_transfer") return <p>Payment method · Cash on delivery</p>;

  const paid = saved.paymentStatus === "paid";
  const active = !paid && saved.status === "pending" && order.status === "pending";
  const bank = saved.bankAccount;
  async function update(action) {
    setBusy(true);
    try {
      const { data } = await api.patch(`/orders/${order.orderId}/payment`, { action, reference }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setSaved(data.order);
      onChange?.();
      toast.success(action === "confirm" ? "Deposit confirmed. Order is processing." : "Transfer reference submitted.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update payment.");
    } finally {
      setBusy(false);
    }
  }
  async function uploadReceipt(event) {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 5 * 1024 * 1024 || !["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
      toast.error("Choose a JPG, PNG or PDF up to 5 MB.");
      return;
    }
    setBusy(true);
    try {
      const { data } = await api.put(`/orders/${order.orderId}/receipt`, file, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": file.type }
      });
      setSaved(data.order);
      toast.success("Receipt saved for verification.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save the receipt.");
    } finally {
      setBusy(false);
    }
  }

  async function downloadReceipt() {
    setBusy(true);
    try {
      const { data } = await api.get(`/orders/${order.orderId}/receipt`, {
        responseType: "blob", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      const extension = { "application/pdf": "pdf", "image/jpeg": "jpg", "image/png": "png" }[saved.receiptType];
      link.download = `${order.orderId}-receipt.${extension}`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      toast.error("Could not download the receipt.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="space-y-3 rounded-xl border border-current/20 p-4 text-left text-sm">
      <h3 className="font-semibold">Bank transfer · {paid ? "Paid" : saved.paymentStatus === "awaiting_verification" ? "Awaiting verification" : "Awaiting payment"}</h3>
      <p>Order amount <strong>{formatPrice(saved.totalAmount)}</strong></p>
      {active && bank && <>
        <p>{bank.bank}{bank.branch && ` · ${bank.branch}`}<br />{bank.holder}<br />Account number <strong>{bank.number}</strong></p>
        <p>Use <strong>{order.orderId}</strong> as the payment description.</p>
      </>}
      {saved.receiptType && <button type="button" disabled={busy} onClick={downloadReceipt} className="block underline">Download receipt</button>}
      {active && !isAdmin && (
        <label className="block">
          {saved.receiptType ? "Replace payment receipt" : "Upload payment slip or receipt"}
          <input type="file" accept="image/jpeg,image/png,application/pdf" disabled={busy} onChange={uploadReceipt} className="mt-1 block w-full text-sm file:mr-2 file:rounded file:border file:px-2 file:py-1" />
          <span className="text-xs">JPG, PNG or PDF, up to 5 MB. You can also submit a transaction reference below.</span>
        </label>
      )}
      {saved.transferReference && <p>Submitted reference · {saved.transferReference}</p>}
      {active && (isAdmin ? <>
        <p>Match the deposit amount and reference against the bank statement before confirming.</p>
        <button disabled={busy} onClick={() => update("confirm")} className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50">Confirm payment</button>
      </> : <form onSubmit={event => { event.preventDefault(); update("submit_reference"); }} className="flex flex-wrap items-end gap-2">
        <label>Bank transaction reference
          <input value={reference} onChange={e => setReference(e.target.value)} required maxLength={100} className="mt-1 block rounded border border-gray-400 bg-white px-2 py-1.5 text-gray-900" />
        </label>
        <button disabled={busy || !reference.trim()} className="rounded-lg bg-blue-600 px-3 py-2 text-white disabled:opacity-50">Submit reference</button>
      </form>)}
    </section>
  );
}
