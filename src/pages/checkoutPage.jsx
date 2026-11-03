
import getCart, { getTotal } from "../utils/cart";
import getFormattedPrice from "../utils/priceFormatter";

import {
  FiArrowLeft,
  FiShoppingBag,
  FiShield,
  FiTruck,
  FiCheck,
  FiLock,
  FiPackage,
  FiChevronRight,
} from "react-icons/fi";

import { useLocation, useNavigate, Link } from "react-router-dom";
import CreateOrder from "../components/createOrder";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const cart = Array.isArray(location.state)
    ? location.state
    : getCart() || [];

  const total = getTotal(cart);

  const totalItems = cart.reduce(
    (sum, item) => sum + Number(item.qty || 0),
    0
  );

  const getProductImage = (product) => {
    const image = product.image || product.images?.[0];

    if (typeof image === "string") {
      return image;
    }

    return image?.url || "/placeholder.png";
  };

  return (
    <main className="min-h-screen bg-[#0b0e14] text-white">

      {/* CHECKOUT TOP BAR */}
      <div className="border-b border-white/10 bg-[#10141c]">
        <div className="mx-auto flex min-h-[76px] max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="group flex items-center gap-3 text-sm font-medium text-zinc-400 transition-colors hover:text-blue-400"
          >
            <FiArrowLeft className="text-lg transition-transform group-hover:-translate-x-1" />
            Back to Cart
          </button>

          {/* CHECKOUT PROGRESS */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
              <FiCheck size={15} />
            </div>

            <div className="h-[2px] w-10 bg-blue-500 sm:w-16" />

            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-500 bg-blue-500/10 text-xs font-semibold text-blue-400">
              2
            </div>

            <span className="hidden text-sm font-medium text-zinc-300 sm:block">
              Checkout
            </span>
          </div>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <section className="page-wrapper py-10 lg:py-14">

        {/* PAGE HEADING */}
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-[2px] w-8 bg-blue-500" />

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
              Almost There
            </p>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Secure{" "}
            <span className="text-blue-400">
              Checkout.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
            Review your selected products and complete
            your order with confidence.
          </p>
        </div>

        {cart.length === 0 ? (

          /* EMPTY CART */
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#151922] p-8 text-center">

            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500/10 text-4xl text-blue-400">
              <FiShoppingBag />
            </div>

            <h2 className="text-2xl font-semibold">
              Your checkout is empty
            </h2>

            <p className="mt-3 max-w-md text-sm leading-7 text-zinc-400">
              Add some products to your cart before
              proceeding to checkout.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center gap-3 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
            >
              Explore Products
              <FiChevronRight />
            </Link>
          </div>

        ) : (

          /* CHECKOUT MAIN LAYOUT */
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px] xl:gap-10">

            {/* LEFT SIDE */}
            <div className="min-w-0 space-y-6">

              {/* ORDER ITEMS */}
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#151922]">

                {/* CARD HEADER */}
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-6 sm:px-7">

                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Your Order
                    </h2>

                    <p className="mt-2 text-sm text-zinc-500">
                      {totalItems}{" "}
                      {totalItems === 1 ? "item" : "items"} in
                      your order
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-xl text-blue-400">
                    <FiShoppingBag />
                  </div>
                </div>

                {/* PRODUCT LIST */}
                <div className="divide-y divide-white/10">
                  {cart.map((cartItem, index) => {
                    const product = cartItem.product;
                    const price = Number(product.price) || 0;
                    const qty = Number(cartItem.qty) || 1;
                    const labelledPrice =
                      Number(product.labelledPrice) || 0;

                    return (
                      <div
                        key={product.productId || index}
                        className="px-5 py-5 sm:px-7 sm:py-6"
                      >
                        <div className="flex items-start gap-4 sm:gap-5">

                          {/* PRODUCT IMAGE */}
                          <div className="flex h-[85px] w-[85px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#171c26] sm:h-[105px] sm:w-[105px]">

                            <img
                              src={getProductImage(product)}
                              alt={product.name}
                              className="h-full w-full object-contain p-3"
                            />
                          </div>

                          {/* PRODUCT INFORMATION */}
                          <div className="min-w-0 flex-1">

                            <p className="mb-2 text-xs text-zinc-500">
                              SKU: {product.productId}
                            </p>

                            <Link
                              to={`/products/${encodeURIComponent(
                                product.productId
                              )}`}
                              className="line-clamp-2 text-sm font-semibold leading-6 text-white transition-colors hover:text-blue-400 sm:text-base"
                            >
                              {product.name}
                            </Link>

                            <div className="mt-3 flex flex-wrap items-center gap-3">

                              <span className="rounded-md border border-white/10 bg-[#171c26] px-2.5 py-1 text-xs font-medium text-zinc-300">
                                Qty: {qty}
                              </span>

                              {labelledPrice > price && (
                                <span className="text-xs text-zinc-500 line-through">
                                  {getFormattedPrice(labelledPrice)}
                                </span>
                              )}
                            </div>

                            {/* MOBILE PRICE */}
                            <div className="mt-3 sm:hidden">
                              <p className="text-base font-bold text-blue-400">
                                {getFormattedPrice(price * qty)}
                              </p>
                            </div>
                          </div>

                          {/* DESKTOP PRICE */}
                          <div className="hidden shrink-0 text-right sm:block">
                            <p className="text-base font-bold text-blue-400">
                              {getFormattedPrice(price * qty)}
                            </p>

                            {qty > 1 && (
                              <p className="mt-2 text-xs text-zinc-500">
                                {getFormattedPrice(price)} each
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ORDER FOOTER */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#10141c] px-5 py-4 sm:px-7">

                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <FiPackage className="text-base text-blue-400" />
                    Order items
                  </div>

                  <span className="text-sm font-medium text-zinc-200">
                    {totalItems} items
                  </span>
                </div>
              </div>

              {/* DELIVERY AND SUPPORT INFORMATION */}
              <div className="grid gap-4 sm:grid-cols-2">

                <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-[#151922] p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-xl text-blue-400">
                    <FiTruck />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Delivery Information
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-zinc-400">
                      Delivery details and charges will be
                      confirmed during order processing.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-[#151922] p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-xl text-blue-400">
                    <FiShield />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Order Assistance
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-zinc-400">
                      Need help with your purchase?
                      Our team is here to assist you.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - ORDER SUMMARY */}
            <aside className="lg:sticky lg:top-40">

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#151922]">

                {/* SUMMARY HEADER */}
                <div className="border-b border-white/10 px-6 py-6">
                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-xl text-blue-400">
                      <FiShoppingBag />
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        Order Summary
                      </h2>

                      <p className="mt-1 text-xs text-zinc-500">
                        Your purchase overview
                      </p>
                    </div>
                  </div>
                </div>

                {/* SUMMARY CONTENT */}
                <div className="p-6">

                  <div className="space-y-5">

                    {/* SUBTOTAL */}
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-zinc-400">
                        Subtotal ({totalItems} items)
                      </span>

                      <span className="font-medium text-zinc-200">
                        {getFormattedPrice(total)}
                      </span>
                    </div>

                    {/* DELIVERY */}
                    <div className="flex items-start justify-between gap-3 text-sm">
                      <span className="text-zinc-400">
                        Delivery
                      </span>

                      <span className="text-right text-xs text-zinc-400">
                        Calculated later
                      </span>
                    </div>
                  </div>

                  <div className="my-6 border-t border-white/10" />

                  {/* TOTAL */}
                  <div className="flex items-end justify-between gap-3">

                    <div>
                      <p className="text-base font-semibold text-white">
                        Subtotal
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        Excluding delivery charges
                      </p>
                    </div>

                    <p className="text-2xl font-bold tracking-tight text-blue-400">
                      {getFormattedPrice(total)}
                    </p>
                  </div>

                  {/* CREATE ORDER COMPONENT */}
                  <div className="mt-7">
                    <CreateOrder cart={cart} />
                  </div>

                  {/* CHECKOUT NOTE */}
                  <div className="mt-6 flex items-start gap-3 border-t border-white/10 pt-5">
                    <FiLock className="mt-0.5 shrink-0 text-base text-blue-400" />

                    <p className="text-xs leading-6 text-zinc-500">
                      Review your order information before
                      confirming your purchase.
                    </p>
                  </div>
                </div>
              </div>

              {/* SUPPORT LINK */}
              <div className="mt-5 rounded-xl border border-white/10 bg-[#151922] p-5">
                <div className="flex items-start gap-3">

                  <FiShield className="mt-0.5 shrink-0 text-xl text-blue-400" />

                  <div>
                    <p className="text-sm font-medium text-white">
                      Questions about your order?
                    </p>

                    <p className="mt-2 text-xs leading-6 text-zinc-400">
                      Contact the iComputers support team
                      if you need assistance.
                    </p>

                    <Link
                      to="/contact-us"
                      className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-blue-400 transition-colors hover:text-blue-300"
                    >
                      Contact Support
                      <FiChevronRight />
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
