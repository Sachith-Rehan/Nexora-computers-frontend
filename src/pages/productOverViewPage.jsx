
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiMinus,
  FiPlus,
  FiPackage,
} from "react-icons/fi";

import LoadingScreen from "../components/loadingScreen";
import ProductImageSlideShow from "../components/productImageSlideShow";
import getFormattedPrice from "../utils/priceFormatter";
import api from "../utils/api";
import { addToCart } from "../utils/cart";
import {
  showErrorToast,
  showSuccessToast,
} from "../utils/toast";

export default function ProductOverViewPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let active = true;

    if (!productId) {
      navigate("/products", { replace: true });
      return;
    }

    async function fetchProduct() {
      setLoading(true);
      setError("");
      setProduct(null);
      setQuantity(1);

      try {
        const response = await api.get(
          `/products/${encodeURIComponent(productId)}`
        );

        if (active) {
          setProduct(response.data);
        }
      } catch (err) {
        if (active) {
          console.error("Error fetching product:", err);
          setError("Unable to load this product.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => {
      active = false;
    };
  }, [productId, navigate]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !product) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#090b10] px-6 text-center text-white">
        <FiPackage className="mb-5 text-5xl text-zinc-500" />

        <h1 className="text-2xl font-semibold">
          Product not available
        </h1>

        <p className="mt-3 text-sm text-zinc-400">
          {error || "This product could not be found."}
        </p>

        <Link
          to="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold transition hover:bg-blue-500"
        >
          <FiArrowLeft />
          Back to products
        </Link>
      </main>
    );
  }

  const price = Number(product.price) || 0;
  const labelledPrice = Number(product.labelledPrice) || 0;
  const stock = Math.max(0, Number(product.stock) || 0);

  const isAvailable =
    product.isAvailable === true && stock > 0;

  const savings = Math.max(0, labelledPrice - price);

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, stock));
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleAddToCart = () => {
    if (!isAvailable) return;

    try {
      const success = addToCart(product, quantity);

      if (success) {
        showSuccessToast("Product added to cart!");
      } else {
        showErrorToast("Unable to add product!");
      }
    } catch (err) {
      console.error("Cart error:", err);
      showErrorToast("Unable to add product!");
    }
  };

  const images = (product.images || [])
    .map((image) => typeof image === "string" ? image : image?.url)
    .filter(Boolean);
  const checkoutImage = images[0] || "/placeholder.png";

  const specifications = [
    { label: "Product ID", value: product.productId },
    { label: "Brand", value: product.brand },
    { label: "Model", value: product.model },
    { label: "Category", value: product.category },
  ].filter(
    (item) => item.value !== null &&
      item.value !== undefined &&
      item.value !== ""
  );

  return (
    <main className="min-h-screen bg-[#090b10] text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-8 lg:px-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-3 py-5 text-sm text-zinc-400">
          <Link to="/products" className="hover:text-white">Products</Link>
          <span aria-hidden="true">/</span>
          <span className="truncate">{product.category || product.name}</span>
        </nav>

        <div className="grid items-start gap-8 border-t border-white/15 pt-6 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <ProductImageSlideShow images={images} name={product.name} />
          <section className="min-w-0 lg:pt-2">
            {product.brand && <p className="mb-2 text-sm text-zinc-400">{product.brand}</p>}
            <h1 className="break-words text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{product.name}</h1>
            {product.model && <p className="mt-2 font-mono text-sm text-zinc-400">{product.model}</p>}

            <div className="mt-7 flex flex-wrap items-baseline gap-x-4">
              <strong className="text-3xl font-semibold">{getFormattedPrice(price)}</strong>
              {savings > 0 && <del className="text-zinc-400">{getFormattedPrice(labelledPrice)}</del>}
            </div>
            {savings > 0 && <p className="mt-1 text-sm text-emerald-400">Save {getFormattedPrice(savings)}</p>}

            <div className="my-6 border-y border-white/15 py-4">
              <p className="flex items-center gap-2 text-sm">
                <span aria-hidden="true" className={`size-2 rounded-full ${isAvailable ? "bg-emerald-400" : "bg-zinc-500"}`} />
                {isAvailable ? `${stock} in stock` : "Out of stock"}
              </p>
              {isAvailable && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="text-sm text-zinc-400">Quantity</span>
                  <div className="flex items-center rounded-xl border border-zinc-600">
                    <button type="button" aria-label="Decrease quantity" onClick={decreaseQuantity} disabled={quantity <= 1} className="grid size-10 place-items-center disabled:opacity-30"><FiMinus /></button>
                    <span className="min-w-7 text-center tabular-nums">{quantity}</span>
                    <button type="button" aria-label="Increase quantity" onClick={increaseQuantity} disabled={quantity >= stock} className="grid size-10 place-items-center disabled:opacity-30"><FiPlus /></button>
                  </div>
                  <output aria-live="polite" className="ml-auto text-sm text-zinc-300">Subtotal {getFormattedPrice(price * quantity)}</output>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <button type="button" onClick={handleAddToCart} disabled={!isAvailable} className="min-h-12 rounded-xl bg-blue-600 px-9 font-semibold hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-400">Add to cart</button>
              {isAvailable && (
                <Link to="/checkout" state={[{ product: { productId: product.productId, name: product.name, image: checkoutImage, price, labelledPrice }, qty: quantity }]} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-blue-500 px-9 font-semibold text-blue-400 transition hover:bg-blue-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">Buy now</Link>
              )}
            </div>
            <Link to="/contact-us" className="mt-6 inline-block text-sm text-zinc-400 underline underline-offset-4 hover:text-white">Ask about this product</Link>
          </section>
        </div>

        <div className="mt-12 grid gap-8 border-t border-white/15 pt-7 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          {product.description && (
            <section>
              <h2 className="mb-4 text-lg font-semibold">Description</h2>
              <p className="whitespace-pre-line break-words leading-7 text-zinc-300">{product.description}</p>
            </section>
          )}
          {specifications.length > 0 && (
            <section>
              <h2 className="mb-2 text-lg font-semibold">Specifications</h2>
              <dl>{specifications.map(({ label, value }) => (
                <div key={label} className="grid grid-cols-[1fr_2fr] gap-4 border-b border-white/10 py-3 text-sm">
                  <dt className="text-zinc-400">{label}</dt>
                  <dd className="break-words">{value}</dd>
                </div>
              ))}</dl>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
