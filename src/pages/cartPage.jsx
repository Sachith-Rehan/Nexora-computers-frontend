
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiMinus,
  FiPlus,
  FiTrash2,
  FiShoppingBag,
  FiArrowRight,
  FiArrowLeft,
  FiShoppingCart,
  FiPackage,
} from "react-icons/fi";

import getCart from "../utils/cart";
import getFormattedPrice from "../utils/priceFormatter";

export default function CartPage() {
  const [cart, setCart] = useState(() => getCart() || []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const increaseQuantity = (index) => {
    const updatedCart = cart.map((item, i) =>
      i === index
        ? { ...item, qty: item.qty + 1 }
        : item
    );

    updateCart(updatedCart);
  };

  const decreaseQuantity = (index) => {
    const item = cart[index];

    if (item.qty <= 1) {
      removeProduct(index);
      return;
    }

    const updatedCart = cart.map((cartItem, i) =>
      i === index
        ? { ...cartItem, qty: cartItem.qty - 1 }
        : cartItem
    );

    updateCart(updatedCart);
  };

  const removeProduct = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    updateCart(updatedCart);
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.product.price) * Number(item.qty),
    0
  );

  const totalItems = cart.reduce(
    (total, item) => total + Number(item.qty),
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
    <main className="min-h-screen bg-[#090b10] text-white">


      <section className="page-wrapper py-10 lg:py-14">

        {/* EMPTY CART */}
        {cart.length === 0 ? (
          <div className="flex min-h-[450px] flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-[#111318] px-6 py-16 text-center">
            <div className="mb-7 flex h-24 w-24 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
              <FiShoppingCart className="text-4xl text-blue-400" />
            </div>

            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Your cart is empty
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-zinc-400">
              Looks like you haven't added anything yet.
              Explore our collection of computers, gaming gear,
              and accessories.
            </p>

            <Link
              to="/products"
              className="group mt-8 inline-flex items-center gap-3 rounded-xl bg-blue-600 px-7 py-4 text-sm font-semibold transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/20"
            >
              Explore Products
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-10">

            {/* CART ITEMS */}
            <div className="min-w-0">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Cart Items
                  <span className="ml-2 text-sm font-normal text-zinc-500">
                    ({cart.length})
                  </span>
                </h2>

                <Link
                  to="/products"
                  className="hidden items-center gap-2 text-sm font-medium text-blue-400 transition hover:text-blue-300 sm:flex"
                >
                  <FiPlus />
                  Add more products
                </Link>
              </div>

              <div className="space-y-4">
                {cart.map((cartItem, index) => {
                  const product = cartItem.product;
                  const price = Number(product.price) || 0;
                  const qty = Number(cartItem.qty) || 1;
                  const labelledPrice =
                    Number(product.labelledPrice) || 0;

                  return (
                    <div
                      key={product.productId || index}
                      className="group rounded-2xl border border-white/[0.08] bg-[#111318] p-4 transition-all duration-300 hover:border-white/[0.15] sm:p-6"
                    >
                      <div className="flex flex-col gap-5 sm:flex-row">

                        {/* PRODUCT IMAGE */}
                        <Link
                          to={`/products/${encodeURIComponent(product.productId)}`}
                          className="flex h-[190px] w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.06] bg-[#191d26] sm:h-[160px] sm:w-[160px]"
                        >
                          <img
                            src={getProductImage(product)}
                            alt={product.name}
                            className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                          />
                        </Link>

                        {/* PRODUCT CONTENT */}
                        <div className="flex min-w-0 flex-1 flex-col justify-between">

                          <div>
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <p className="mb-2 text-xs text-zinc-500">
                                  SKU: {product.productId}
                                </p>

                                <Link
                                  to={`/products/${encodeURIComponent(product.productId)}`}
                                  className="line-clamp-2 text-base font-semibold leading-6 text-white transition hover:text-blue-400 sm:text-lg"
                                >
                                  {product.name}
                                </Link>
                              </div>

                              {/* REMOVE BUTTON */}
                              <button
                                type="button"
                                onClick={() => removeProduct(index)}
                                aria-label={`Remove ${product.name} from cart`}
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-transparent text-zinc-500 transition hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
                              >
                                <FiTrash2 size={18} />
                              </button>
                            </div>

                            {/* PRICE */}
                            <div className="mt-4 flex flex-wrap items-center gap-3">
                              <p className="text-xl font-bold text-blue-400">
                                {getFormattedPrice(price)}
                              </p>

                              {labelledPrice > price && (
                                <p className="text-sm text-zinc-500 line-through">
                                  {getFormattedPrice(labelledPrice)}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* QUANTITY AND ITEM TOTAL */}
                          <div className="mt-6 flex flex-wrap items-end justify-between gap-5 border-t border-white/[0.07] pt-5">

                            <div>
                              <p className="mb-2 text-xs text-zinc-500">
                                Quantity
                              </p>

                              <div className="flex h-11 items-center overflow-hidden rounded-xl border border-white/10 bg-[#0b0d12]">

                                <button
                                  type="button"
                                  onClick={() => decreaseQuantity(index)}
                                  aria-label={`Decrease quantity of ${product.name}`}
                                  className="flex h-full w-11 items-center justify-center text-zinc-400 transition hover:bg-white/5 hover:text-white"
                                >
                                  <FiMinus size={16} />
                                </button>

                                <span className="flex h-full min-w-11 items-center justify-center border-x border-white/10 text-sm font-semibold">
                                  {qty}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => increaseQuantity(index)}
                                  aria-label={`Increase quantity of ${product.name}`}
                                  className="flex h-full w-11 items-center justify-center text-zinc-400 transition hover:bg-white/5 hover:text-white"
                                >
                                  <FiPlus size={16} />
                                </button>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="mb-2 text-xs text-zinc-500">
                                Item Total
                              </p>

                              <p className="text-lg font-semibold text-white">
                                {getFormattedPrice(price * qty)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CONTINUE SHOPPING */}
              <Link
                to="/products"
                className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-blue-400"
              >
                <FiArrowLeft />
                Continue Shopping
              </Link>
            </div>

            {/* ORDER SUMMARY */}
            <aside className="lg:sticky lg:top-40">
              <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111318]">

                <div className="border-b border-white/[0.08] px-6 py-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                      <FiShoppingBag size={20} />
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold">
                        Order Summary
                      </h2>

                      <p className="mt-1 text-xs text-zinc-500">
                        Review your order
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 p-6">

                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-zinc-400">
                      Subtotal ({totalItems} items)
                    </span>

                    <span className="font-medium text-zinc-200">
                      {getFormattedPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3 text-sm">
                    <span className="text-zinc-400">
                      Delivery
                    </span>

                    <span className="text-right text-xs text-zinc-300">
                      Calculated at checkout
                    </span>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Subtotal
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          Excluding delivery
                        </p>
                      </div>

                      <p className="text-2xl font-bold tracking-tight text-blue-400">
                        {getFormattedPrice(subtotal)}
                      </p>
                    </div>
                  </div>

                  {/* CHECKOUT BUTTON */}
                  <Link
                    to="/checkout"
                    className="group flex min-h-[54px] w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-5 py-4 text-sm font-semibold text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/20"
                  >
                    Proceed to Checkout
                    <FiArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>

                  <p className="text-center text-xs leading-6 text-zinc-500">
                    Confirm your order and delivery information
                    during checkout.
                  </p>
                </div>
              </div>

              {/* SUPPORT NOTE */}
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-white/[0.07] bg-[#111318] p-5">
                <FiPackage className="mt-0.5 shrink-0 text-lg text-blue-400" />

                <div>
                  <p className="text-sm font-medium text-white">
                    Need assistance?
                  </p>

                  <p className="mt-2 text-xs leading-6 text-zinc-500">
                    Have questions about your order?
                    Contact our team for help.
                  </p>

                  <Link
                    to="/contact-us"
                    className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-blue-400 transition hover:text-blue-300"
                  >
                    Contact Support
                    <FiArrowRight />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
