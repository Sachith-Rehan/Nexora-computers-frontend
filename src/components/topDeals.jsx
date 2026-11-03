import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import ProductCard from "./productCard";

export default function TopDeals() {
  const [deals, setDeals] = useState([]);
  const [message, setMessage] = useState("Loading deals…");

  useEffect(() => {
    const controller = new AbortController();

    async function loadDeals() {
      try {
        const { data } = await api.get("/products", { signal: controller.signal });
        const ranked = data
          .filter(({ isAvailable, stock, price, labelledPrice }) =>
            isAvailable && stock > 0 && price != null && price >= 0 && Number(labelledPrice) > Number(price)
          )
          .sort((a, b) => a.price / a.labelledPrice - b.price / b.labelledPrice)
          .slice(0, 5);

        if (!controller.signal.aborted) {
          setDeals(ranked);
          setMessage(ranked.length ? "" : "No discounted products right now.");
        }
      } catch {
        if (!controller.signal.aborted) setMessage("Deals could not be loaded.");
      }
    }

    loadDeals();
    return () => controller.abort();
  }, []);

  return (
    <section aria-labelledby="top-deals-title" className="page-wrapper py-14">
      <div className="mb-7 flex flex-wrap items-baseline justify-between gap-4">
        <h2 id="top-deals-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Top Deals
        </h2>
        <Link to="/products" className="text-sm font-medium text-zinc-300 hover:text-cyan-400">
          Browse all products →
        </Link>
      </div>
      {message ? (
        <p role="status" className="text-sm text-zinc-400">{message}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          {deals.map(product => <ProductCard key={product.productId} product={product} />)}
        </div>
      )}
    </section>
  );
}
