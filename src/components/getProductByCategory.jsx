
import api from "../utils/api";
import { useEffect, useState } from "react";
import ProductCard from "./productCard";

export default function GetProductByCategory({
  category,
  title,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setProducts([]);

    api
      .get(`/products/category/${encodeURIComponent(category)}`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [category]);

  return (
    <section className="w-full bg-[#151619] py-14">

      <div className="page-wrapper">

        {/* Section Heading */}
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-red-500">
              — WORK & PLAY
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {title || category}
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              Explore our latest {category} collection
            </p>
          </div>

          <a
            href={`/products?category=${encodeURIComponent(category)}`}
            className="group flex items-center gap-2 text-sm font-semibold text-red-500 transition hover:text-red-400"
          >
            More products
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              ⟶
            </span>
          </a>

        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-2xl bg-[#22252a]"
              />
            ))}
          </div>
        )}

        {/* Products */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">

            {products.slice(0, 5).map((product) => (
              <div key={product._id} className="min-w-0">
                <ProductCard product={product} />
              </div>
            ))}

          </div>
        )}

        {/* Empty Products */}
        {!loading && products.length === 0 && (
          <p className="py-10 text-center text-zinc-400">
            No products available in this category.
          </p>
        )}

      </div>
    </section>
  );
}
