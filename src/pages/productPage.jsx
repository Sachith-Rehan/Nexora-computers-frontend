
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  IoOptionsOutline,
  IoCloseOutline,
  IoChevronDownOutline,
  IoRefreshOutline,
} from "react-icons/io5";

import api from "../utils/api";
import LoadingScreen from "../components/loadingScreen";
import ProductCard from "../components/productCard";

const categories = [
  { value: "laptop", label: "Laptops" },
  { value: "desktop", label: "Desktop" },
  { value: "gaming", label: "Gaming" },
  { value: "workstation", label: "Workstation" },
  { value: "accessories", label: "Accessories" },
  { value: "graphic card", label: "Graphics Cards" },
  { value: "processor", label: "Processors" },
  { value: "motherboard", label: "Motherboards" },
  { value: "ram", label: "RAM" },
  { value: "storage", label: "Storage" },
  { value: "monitor", label: "Monitors" },
  { value: "keyboard", label: "Keyboards" },
  { value: "mouse", label: "Mouse" },
  { value: "headset", label: "Headsets" },
  { value: "speaker", label: "Speakers" },
  { value: "power supply", label: "Power Supplies" },
  { value: "case", label: "PC Cases" },
  { value: "cooling", label: "Cooling" },
  { value: "other", label: "Other" },
];

const sortOptions = [
  { value: "default", label: "Default sorting" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "newest", label: "Newest First" },
];

function normalizeCategory(value) {
  const category = String(value ?? "").trim().toLowerCase();
  return category === "laptops" ? "laptop" : category;
}

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  const [sortBy, setSortBy] = useState("default");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategories = searchParams
    .getAll("category")
    .map(normalizeCategory)
    .filter(Boolean);

  const searchTerm = (searchParams.get("search") || "")
    .trim()
    .toLowerCase();

  useEffect(() => {
    let active = true;

    async function fetchProducts() {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/products");

        if (active) {
          setProducts(
            Array.isArray(response.data)
              ? response.data
              : []
          );
        }
      } catch (err) {
        if (active) {
          console.error("Error fetching products:", err);
          setError("Failed to load products.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      active = false;
    };
  }, [retry]);

  const highestPrice = useMemo(() => {
    return Math.ceil(
      Math.max(0, ...products.map((p) => Number(p.price) || 0))
    );
  }, [products]);

  const effectiveMaxPrice = maxPrice === null
    ? highestPrice
    : Math.min(maxPrice, highestPrice);

  const toggleCategory = (category) => {
    setSearchParams((previous) => {
      const params = new URLSearchParams(previous);

      const currentCategories = params.getAll("category").map(normalizeCategory);

      params.delete("category");

      const updatedCategories = currentCategories.includes(category)
        ? currentCategories.filter((item) => item !== category)
        : [...currentCategories, category];

      updatedCategories.forEach((item) => {
        params.append("category", item);
      });

      return params;
    });
  };

  const clearFilters = () => {
    setInStockOnly(false);
    setMaxPrice(null);
    setSortBy("default");

    setSearchParams((previous) => {
      const params = new URLSearchParams(previous);

      params.delete("category");
      params.delete("search");

      return params;
    });
  };

    
const filteredProducts = useMemo(() => {
  const result = products.filter((product) => {

    const matchesSearch =
      !searchTerm ||
      [
        product.name,
        product.brand,
        product.model,
        product.category,
        product.description,
      ].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(searchTerm)
      );

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some(
        (category) =>
          category === normalizeCategory(product.category)
      );

    const matchesPrice =
      Number(product.price) <= effectiveMaxPrice;

    const matchesStock =
      !inStockOnly ||
      (
        product.isAvailable === true &&
        Number(product.stock) > 0
      );

    return (
      matchesCategory &&
      matchesPrice &&
      matchesStock &&
      matchesSearch
    );
  });

  switch (sortBy) {
    case "price-low":
      return result.sort((a, b) => a.price - b.price);

    case "price-high":
      return result.sort((a, b) => b.price - a.price);

    case "name-asc":
      return result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

    case "name-desc":
      return result.sort((a, b) =>
        b.name.localeCompare(a.name)
      );

    case "newest":
      return result.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );

    default:
      return result;
  }
}, [
  products,
  selectedCategories.join("|"),
  effectiveMaxPrice,
  inStockOnly,
  sortBy,
  searchTerm,
]);


  const availableProducts = products.filter(
    (product) =>
      product.isAvailable === true &&
      Number(product.stock) > 0
  ).length;

  const totalCategories = new Set(
    products.map((product) => product.category).filter(Boolean)
  ).size;

  const activeFilterCount =
    selectedCategories.length +
    (inStockOnly ? 1 : 0) +
    (effectiveMaxPrice < highestPrice ? 1 : 0);

  const formatPrice = (price) => {
    return `Rs. ${Number(price).toLocaleString("en-LK")}`;
  };

  const filterSidebar = (
    <div className="space-y-8">

      {/* FILTER HEADER */}
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <IoOptionsOutline className="text-xl text-blue-400" />

          <h2 className="text-base font-semibold text-white">
            Filters
          </h2>

          {activeFilterCount > 0 && (
            <span className="bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
              {activeFilterCount}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={clearFilters}
          className="text-xs font-medium text-zinc-500 transition hover:text-blue-400"
        >
          Clear All
        </button>
      </div>

      {/* CATEGORIES */}
      <div>
        <h3 className="mb-5 text-sm font-semibold text-white">
          Categories
        </h3>

       
        <div className="space-y-4">
          {categories.map((category) => (
            <label
              key={category.value}
              className="group flex cursor-pointer items-center gap-3"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.value)}
                onChange={() => toggleCategory(category.value)}
                className="h-4 w-4 cursor-pointer rounded-none accent-blue-600"
              />

              <span className="text-sm text-zinc-400 transition group-hover:text-white">
                {category.label}
              </span>
            </label>
          ))}
        </div>

      </div>

      {/* PRICE RANGE */}
      <div className="border-t border-white/10 pt-7">
        <h3 className="mb-5 text-sm font-semibold text-white">
          Price Range
        </h3>

        <input
          type="range"
          min={0}
          max={Math.max(highestPrice, 1)}
          step={Math.max(1, Math.ceil(highestPrice / 100))}
          value={effectiveMaxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          disabled={highestPrice === 0}
          className="w-full cursor-pointer accent-blue-500 disabled:cursor-not-allowed"
          aria-label="Maximum product price"
        />

        <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
          <span>{formatPrice(0)}</span>
          <span className="font-medium text-blue-400">
            {formatPrice(effectiveMaxPrice)}
          </span>
        </div>
      </div>

      {/* AVAILABILITY */}
      <div className="border-t border-white/10 pt-7">
        <h3 className="mb-5 text-sm font-semibold text-white">
          Availability
        </h3>

        <label className="flex cursor-pointer items-center justify-between gap-4">
          <span className="text-sm text-zinc-400">
            In Stock Only
          </span>

          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="h-4 w-4 cursor-pointer rounded-none accent-blue-600"
          />
        </label>
      </div>

      {/* RESET BUTTON */}
      <button
        type="button"
        onClick={clearFilters}
        className="flex w-full items-center justify-center gap-2 border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-zinc-300 transition hover:border-blue-500/40 hover:text-white"
      >
        <IoRefreshOutline />
        Reset Filters
      </button>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#090b10] text-white">

      <section className="page-wrapper py-14 lg:py-20">

        {/* PAGE HEADING */}
        {/* <div className="mb-10 flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">

           <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-blue-500" />

              <span className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
                The Collection
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Explore Our{" "}
              <span className="text-blue-400">
                Products.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
              Discover high-performance computers,
              gaming gear, components, and accessories
              built to power your setup.
            </p>
          </div> 

          {!loading && !error && (
            <div className="flex items-center gap-5 sm:gap-8">
              <div>
                <h3 className="text-2xl font-bold">
                  {products.length}
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  Products
                </p>
              </div>

              <div className="h-10 w-px bg-white/10" />

              <div>
                <h3 className="text-2xl font-bold">
                  {totalCategories}
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  Categories
                </p>
              </div>

              <div className="h-10 w-px bg-white/10" />

              <div>
                <h3 className="text-2xl font-bold text-blue-400">
                  {availableProducts}
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  In Stock
                </p>
              </div>
            </div>
          )}
        </div> */}

        {/* LOADING */}
        {loading && <LoadingScreen />}

        {/* ERROR */}
        {!loading && error && (
          <div className="flex min-h-72 flex-col items-center justify-center border border-white/10 bg-zinc-900/50 p-6 text-center">
            <h2 className="text-xl font-semibold">
              Unable to Load Products
            </h2>

            <p className="mt-3 text-sm text-zinc-400">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setRetry((prev) => prev + 1)}
              className="mt-6 bg-blue-600 px-6 py-3 text-sm font-semibold transition hover:bg-blue-500"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">

            {/* DESKTOP SIDEBAR */}
            <aside className="hidden w-[250px] shrink-0 lg:block xl:w-[270px]">
              <div className="border border-white/10 bg-[#111318] p-6">
                {filterSidebar}
              </div>
            </aside>

            {/* PRODUCT CONTENT */}
            <div className="min-w-0 flex-1">
              {selectedCategories.length > 0 && (
                <h1 className="mb-4 text-2xl font-semibold">
                  {selectedCategories.map((value) =>
                    categories.find((category) => category.value === value)?.label || value
                  ).join(", ")}
                </h1>
              )}

              {/* SORT BAR */}
              <div className="mb-7 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowMobileFilters(true)}
                    className="flex items-center gap-2 border border-white/10 bg-[#151820] px-4 py-3 text-sm font-medium lg:hidden"
                  >
                    <IoOptionsOutline className="text-blue-400" />
                    Filters
                    {activeFilterCount > 0 &&
                      ` (${activeFilterCount})`}
                  </button>

                  <p className="text-sm text-zinc-400">
                    Showing{" "}
                    <span className="font-semibold text-white">
                      {filteredProducts.length}
                    </span>{" "}
                    of {products.length} products
                  </p>
                </div>

                <div className="relative flex items-center gap-3">
                  <span className="hidden text-xs text-zinc-500 sm:block">
                    Sort by:
                  </span>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none border border-white/10 bg-[#151820] py-3 pl-4 pr-10 text-sm text-zinc-300 outline-none transition focus:border-blue-500"
                    aria-label="Sort products"
                  >
                    {sortOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <IoChevronDownOutline className="pointer-events-none absolute right-3 text-sm text-zinc-500" />
                </div>
              </div>

              {/* PRODUCT GRID */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product._id || product.productId}
                      product={product}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex min-h-80 flex-col items-center justify-center border border-white/10 bg-[#111318] px-6 text-center">
                  <IoOptionsOutline className="mb-5 text-4xl text-zinc-600" />

                  <h2 className="text-xl font-semibold">
                    No Products Found
                  </h2>

                  <p className="mt-3 max-w-sm text-sm leading-7 text-zinc-400">
                    No products match your selected filters.
                    Try changing your preferences.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 bg-blue-600 px-6 py-3 text-sm font-semibold transition hover:bg-blue-500"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {/* BOTTOM INFO */}
              <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-6">
                <p className="text-xs text-zinc-500">
                  Showing {filteredProducts.length} products
                </p>

                <p className="hidden text-xs text-zinc-500 sm:block">
                  Find your next upgrade.
                </p>
              </div>

            </div>
          </div>
        )}
      </section>

      {/* MOBILE FILTER DRAWER */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setShowMobileFilters(false)}
            className="absolute inset-0 bg-black/75"
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Product filters"
            className="absolute inset-y-0 left-0 flex w-[min(85vw,350px)] flex-col border-r border-white/10 bg-[#111318]"
          >
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <h2 className="text-lg font-semibold">
                Filter Products
              </h2>

              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                aria-label="Close filter panel"
                className="p-2 text-zinc-400 hover:text-white"
              >
                <IoCloseOutline className="text-2xl" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {filterSidebar}
            </div>

            <div className="border-t border-white/10 p-5">
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-blue-600 px-6 py-3.5 text-sm font-semibold transition hover:bg-blue-500"
              >
                Show {filteredProducts.length} Products
              </button>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
