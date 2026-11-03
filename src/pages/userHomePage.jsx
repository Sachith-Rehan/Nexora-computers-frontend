import { Link } from "react-router-dom";
import HomeSlideShow from "../components/homePageSlideShow";
import Brands from "../components/brands";
import GetProductByCategory from "../components/getProductByCategory";


const categories = [
{ name: "Laptops", value: "laptop", number: "01", img: "laptop.webp", description: "Power meets portability." },
{ name: "Desktop", value: "desktop", number: "02", img: "desktop.avif", description: "Built for every task." },
{ name: "Gaming", value: "gaming", number: "03", img: "gaming.avif", description: "Enter another level." },
{ name: "Workstation", value: "workstation", number: "04", img: "workstation.png", description: "Performance without limits." },
{ name: "Accessories", value: "accessories", number: "05", img: "accessories.jpg", description: "Complete your setup." },
];


export default function UserHomePage() {
  return ( 
    <main className="min-h-screen bg-[#090a0d] font-sans text-white"> 
      <HomeSlideShow />


    {/* Shop by category */}
      <section className="bg-[#090a0d] py-16 sm:py-20 lg:py-24">
        <div className="page-wrapper">

          {/* Section heading */}
          <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
                Find your next upgrade
              </p>

              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Shop by <span className="text-zinc-500">category.</span>
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-400 sm:text-base">
                Explore our collection of computers, gaming gear, and
                accessories built for the way you work and play.
              </p>
            </div>

            <Link
              to="/products"
              className="group inline-flex w-fit items-center gap-3 text-sm font-medium text-zinc-300 transition-colors hover:text-cyan-400"
            >
              Explore all products
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          {/* Six-panel category pattern */}
          <div className="grid grid-cols-1 overflow-hidden border border-white/10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category.number}
                to={`/products?category=${encodeURIComponent(category.value)}`}
                className="group relative flex min-h-[300px] flex-col overflow-hidden border-b border-white/10 bg-[#0d0f13] p-5 transition-colors duration-300 hover:bg-[#141820] sm:min-h-[340px] sm:border-r sm:border-white/10 xl:min-h-[390px] xl:border-b-0"
              >
                {/* Category image */}
                <div className="relative flex flex-1 items-center justify-center overflow-hidden">
                  <div className="absolute h-32 w-32 rounded-full bg-cyan-400/[0.04] blur-3xl transition-all duration-500 group-hover:bg-cyan-400/[0.12]" />

                  <img
                    src={category.img}
                    alt={category.name}
                    loading="lazy"
                    className="relative z-10 h-40 w-full object-contain transition-transform duration-500 ease-out group-hover:scale-110 motion-reduce:transform-none sm:h-44 xl:h-36 2xl:h-44"
                  />

                  <span className="absolute right-0 top-0 text-xs font-medium tracking-widest text-zinc-600 transition-colors group-hover:text-cyan-400">
                    {category.number}
                  </span>
                </div>

                {/* Category details */}
                <div className="mt-6 border-t border-white/10 pt-5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-zinc-100 transition-colors duration-300 group-hover:text-cyan-400">
                      {category.name}
                    </h3>

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-all duration-300 group-hover:border-cyan-400 group-hover:bg-cyan-400 group-hover:text-black">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      >
                        <path d="M7 17 17 7" />
                        <path d="M7 7h10v10" />
                      </svg>
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-zinc-500">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}

            {/* Sixth panel */}
            <Link
              to="/products"
              className="group relative flex min-h-[300px] flex-col justify-between overflow-hidden bg-[#10151b] p-6 transition-colors duration-300 hover:bg-[#17212a] sm:col-span-2 lg:col-span-1 sm:min-h-[340px] xl:col-span-1 xl:min-h-[390px]"
            >
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-cyan-400/10 transition-transform duration-700 group-hover:scale-125" />

              <div className="relative">
                <span className="text-xs font-medium uppercase tracking-[0.25em] text-cyan-400">
                  The collection
                </span>

                <h3 className="mt-5 text-2xl font-semibold leading-tight tracking-tight text-white">
                  Your next
                  <br />
                  setup starts
                  <br />
                  <span className="text-cyan-400">here.</span>
                </h3>

                <p className="mt-4 text-sm leading-6 text-zinc-400">
                  Discover technology that fits your ambitions.
                </p>
              </div>

              <div className="relative mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                <span className="text-sm font-medium text-white">
                  Browse products
                </span>

                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 text-black transition-transform duration-300 group-hover:translate-x-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>

          {/* Bottom detail */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-600">
            <span>Explore. Choose. Upgrade.</span>
            <span>Technology for every ambition.</span>
          </div>
        </div>
      </section>

    {/* Featured brands */}
    <Brands/>

    {/* discounts */}
    
    <section>
      <div>
        <GetProductByCategory category="processor" />
        <GetProductByCategory category="graphic card" />
        <GetProductByCategory category="cooling" />

        
      </div>
    </section>

    </main>

  );
}
