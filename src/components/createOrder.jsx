
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FiX,
  FiMapPin,
  FiPhone,
  FiUser,
  FiShoppingBag,
  FiArrowRight,
  FiLock,
  FiLoader,
} from "react-icons/fi";

import api from "../utils/api";

const initialForm = {
  firstName: "",
  lastName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
};

export default function CreateOrder({ cart = [], expectedTotal, paymentMethod, onPlaced, children }) {
  const navigate = useNavigate();

  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const openButtonRef = useRef(null);
  const closeButtonRef = useRef(null);

  const inputClass =
    "h-12 w-full rounded-xl border border-white/10 bg-[#171c26] px-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-zinc-500 hover:border-white/20 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60";

  // Prevent background scrolling and manage modal keyboard focus.
  useEffect(() => {
    if (!isModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape" && !loading) {
        setModalOpen(false);
      }

      if (event.key === "Tab") {
        const modal = document.getElementById("create-order-dialog");
        if (!modal) return;

        const focusable = Array.from(
          modal.querySelectorAll(
            'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]'
          )
        );

        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === last
        ) {
          event.preventDefault();
          first.focus();
        } else if (!modal.contains(document.activeElement)) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      openButtonRef.current?.focus();
    };
  }, [isModalOpen, loading]);

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const closeModal = () => {
    if (!loading) {
      setModalOpen(false);
    }
  };

  async function placeOrder(event) {
    event.preventDefault();

    if (loading) return;

    const {
      firstName,
      lastName,
      phone,
      addressLine1,
      addressLine2,
      city,
    } = form;

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !addressLine1.trim() ||
      !city.trim() ||
      !phone.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const normalizedPhone = phone.replace(/[\s()-]/g, "");

    if (!/^(?:0\d{9}|\+94\d{9})$/.test(normalizedPhone)) {
      toast.error("Please enter a valid Sri Lankan phone number");
      return;
    }

    if (!cart.length) {
      toast.error("Your cart is empty");
      return;
    }

    const items = cart.map((item) => ({
      productId: item.product.productId,
      qty: Number(item.qty),
    }));

    if (
      items.some(
        (item) =>
          !item.productId ||
          !Number.isInteger(item.qty) ||
          item.qty < 1
      )
    ) {
      toast.error("Your cart contains invalid items");
      return;
    }

    const body = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim(),
      city: city.trim(),
      phone: normalizedPhone,
      items, expectedTotal, paymentMethod,
    };

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {};

      const { data } = await api.post("/orders", body, config);

      toast.success("Order placed successfully!");

      setModalOpen(false);
      setForm(initialForm);

      if (data.order?.paymentMethod === "bank_transfer") onPlaced(data.order);
      else navigate("/");
    } catch (error) {
      console.error("Error placing order:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* ORDER BUTTON */}
      <button
        ref={openButtonRef}
        type="button"
        onClick={() => setModalOpen(true)}
        disabled={!cart.length}
        className="group mt-7 flex min-h-[54px] w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 py-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
      >
        <FiShoppingBag className="text-lg" />
        Place Your Order

        <FiArrowRight className="text-lg transition-transform group-hover:translate-x-1" />
      </button>

      {/* MODAL RENDERED THROUGH REACT PORTAL */}
      {isModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-5"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeModal();
              }
            }}
          >
            <div
              id="create-order-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="order-modal-title"
              className="flex max-h-[92dvh] w-full max-w-[680px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#151922] text-white shadow-[0_25px_100px_rgba(0,0,0,0.65)]"
            >
              {/* MODAL HEADER */}
              <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-[#10141c] px-5 py-5 sm:px-8 sm:py-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-xl text-blue-400">
                    <FiShoppingBag />
                  </div>

                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-400">
                      Nexora Computers CHECKOUT
                    </p>

                    <h2
                      id="order-modal-title"
                      className="text-xl font-semibold tracking-tight sm:text-2xl"
                    >
                      Delivery Information
                    </h2>

                    <p className="mt-1 text-xs text-zinc-400">
                      Complete your details to place your order
                    </p>
                  </div>
                </div>

                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  aria-label="Close order form"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
                >
                  <FiX size={22} />
                </button>
              </div>

              {/* FORM */}
              <form
                id="create-order-form"
                onSubmit={placeOrder}
                className="min-h-0 flex-1 space-y-9 overflow-y-auto px-5 py-7 sm:px-8 sm:py-8"
              >
                {/* PERSONAL INFORMATION */}
                <section>
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-lg text-blue-400">
                      <FiUser />
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-white">
                        Personal Information
                      </h3>

                      <p className="mt-1 text-xs text-zinc-500">
                        Who should we contact about this order?
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* FIRST NAME */}
                    <div>
                      <label
                        htmlFor="order-first-name"
                        className="mb-2 block text-sm font-medium text-zinc-300"
                      >
                        First Name{" "}
                        <span className="text-blue-400">*</span>
                      </label>

                      <input
                        id="order-first-name"
                        type="text"
                        autoComplete="given-name"
                        placeholder="Enter first name"
                        value={form.firstName}
                        onChange={(e) =>
                          updateField("firstName", e.target.value)
                        }
                        required
                        maxLength={100}
                        disabled={loading}
                        className={inputClass}
                      />
                    </div>

                    {/* LAST NAME */}
                    <div>
                      <label
                        htmlFor="order-last-name"
                        className="mb-2 block text-sm font-medium text-zinc-300"
                      >
                        Last Name{" "}
                        <span className="text-blue-400">*</span>
                      </label>

                      <input
                        id="order-last-name"
                        type="text"
                        autoComplete="family-name"
                        placeholder="Enter last name"
                        value={form.lastName}
                        onChange={(e) =>
                          updateField("lastName", e.target.value)
                        }
                        required
                        maxLength={100}
                        disabled={loading}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* PHONE */}
                  <div className="mt-5">
                    <label
                      htmlFor="order-phone"
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      Phone Number{" "}
                      <span className="text-blue-400">*</span>
                    </label>

                    <div className="relative">
                      <FiPhone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-zinc-500" />

                      <input
                        id="order-phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="07X XXX XXXX"
                        value={form.phone}
                        onChange={(e) =>
                          updateField("phone", e.target.value)
                        }
                        required
                        maxLength={20}
                        disabled={loading}
                        className={`${inputClass} pl-12`}
                      />
                    </div>

                    <p className="mt-2 text-xs text-zinc-500">
                      We'll use this number to contact you
                      about your order.
                    </p>
                  </div>
                </section>

                {/* DELIVERY ADDRESS */}
                <section className="border-t border-white/10 pt-8">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-lg text-blue-400">
                      <FiMapPin />
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-white">
                        Delivery Address
                      </h3>

                      <p className="mt-1 text-xs text-zinc-500">
                        Where should your order be delivered?
                      </p>
                    </div>
                  </div>

                  {/* ADDRESS LINE 1 */}
                  <div className="mb-5">
                    <label
                      htmlFor="order-address-1"
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      Address Line 1{" "}
                      <span className="text-blue-400">*</span>
                    </label>

                    <input
                      id="order-address-1"
                      type="text"
                      autoComplete="address-line1"
                      placeholder="House number and street"
                      value={form.addressLine1}
                      onChange={(e) =>
                        updateField("addressLine1", e.target.value)
                      }
                      required
                      maxLength={200}
                      disabled={loading}
                      className={inputClass}
                    />
                  </div>

                  {/* ADDRESS LINE 2 */}
                  <div className="mb-5">
                    <label
                      htmlFor="order-address-2"
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      Address Line 2{" "}
                      <span className="font-normal text-zinc-500">
                        (Optional)
                      </span>
                    </label>

                    <input
                      id="order-address-2"
                      type="text"
                      autoComplete="address-line2"
                      placeholder="Apartment, landmark, etc."
                      value={form.addressLine2}
                      onChange={(e) =>
                        updateField("addressLine2", e.target.value)
                      }
                      maxLength={200}
                      disabled={loading}
                      className={inputClass}
                    />
                  </div>

                  {/* CITY */}
                  <div>
                    <label
                      htmlFor="order-city"
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      City{" "}
                      <span className="text-blue-400">*</span>
                    </label>

                    <input
                      id="order-city"
                      type="text"
                      autoComplete="address-level2"
                      placeholder="Enter your city"
                      value={form.city}
                      onChange={(e) =>
                        updateField("city", e.target.value)
                      }
                      required
                      maxLength={100}
                      disabled={loading}
                      className={inputClass}
                    />
                  </div>
                </section>

                <fieldset disabled={loading}>{children}</fieldset>

                {/* FORM NOTE */}
                <div className="flex items-start gap-3 rounded-xl border border-blue-500/10 bg-[#101b2d] p-4">
                  <FiLock className="mt-0.5 shrink-0 text-lg text-blue-400" />

                  <p className="text-xs leading-6 text-zinc-400">
                    Please double-check your contact information
                    and delivery address before placing your
                    order. {paymentMethod === "bank_transfer" ? "After placing the order, use the bank details provided. You can upload your receipt immediately or later in My Orders." : "Pay when your order arrives."}
                  </p>
                </div>
              </form>

              {/* FOOTER ACTIONS */}
              <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-white/10 bg-[#10141c] px-5 py-5 sm:flex-row sm:px-8">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  className="flex min-h-[50px] items-center justify-center rounded-xl border border-white/10 bg-[#171c26] px-6 text-sm font-semibold text-zinc-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:opacity-50 sm:w-1/3"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  form="create-order-form"
                  disabled={loading}
                  className="flex min-h-[50px] items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/20 disabled:cursor-not-allowed disabled:opacity-60 sm:w-2/3"
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin text-lg" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      {paymentMethod === "bank_transfer" ? "Place bank transfer order" : "Place cash on delivery order"}
                      <FiArrowRight className="text-lg" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
