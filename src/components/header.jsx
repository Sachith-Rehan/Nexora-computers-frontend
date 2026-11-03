
import { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  FiSearch,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiChevronDown,
  FiGrid,
  FiArrowRight,
} from "react-icons/fi";
import UserData from "./userData";

const categories = [
  { label: "Laptops", value: "laptop" },
  { label: "Graphics Cards", value: "graphic card" },
  { label: "Processors", value: "processor" },
  { label: "Motherboards", value: "motherboard" },
  { label: "RAM", value: "ram" },
  { label: "Storage", value: "storage" },
  { label: "Monitors", value: "monitor" },
  { label: "Keyboards", value: "keyboard" },
  { label: "Mouse", value: "mouse" },
  { label: "Headsets", value: "headset" },
  { label: "Speakers", value: "speaker" },
  { label: "Power Supplies", value: "power supply" },
  { label: "PC Cases", value: "case" },
  { label: "Cooling", value: "cooling" },
  { label: "Other", value: "other" },
];

const navLinks = [
  { label: "Home", to: "/", end: true },
  { label: "All Products", to: "/products", end: true },
  { label: "Contact Us", to: "/contact-us" },
];

function getCategoryUrl(category) {
  const params = new URLSearchParams();
  params.set("category", category);

  return `/products?${params.toString()}`;
}

export default function Header({ cartCount = 0 }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  const itemCount = Math.max(0, Number(cartCount) || 0);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    setSearch(params.get("search") || "");
    setMenuOpen(false);
    setCategoriesOpen(false);
    setMobileSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setCategoriesOpen(false);
        setMobileSearchOpen(false);
      }
    };

    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setCategoriesOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();

    const keyword = search.trim();
    const params = new URLSearchParams();

    if (keyword) {
      params.set("search", keyword);
    }

    navigate(
      `/products${params.toString() ? `?${params}` : ""}`
    );

    setMenuOpen(false);
    setMobileSearchOpen(false);
    setCategoriesOpen(false);
  };

  const desktopNavClass = ({ isActive }) =>
    `group relative flex h-full items-center text-[13px] font-medium transition-colors ${
      isActive
        ? "text-blue-400"
        : "text-zinc-400 hover:text-white"
    }`;

  const mobileNavClass = ({ isActive }) =>
    `flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-blue-500/10 text-blue-400"
        : "text-zinc-300 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0b0e14]/95 text-white shadow-xl shadow-black/20 backdrop-blur-xl">

      <div className="h-[2px] bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700" />

      {/* MAIN HEADER */}
      <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:h-[78px] sm:px-6 lg:px-10">

        {/* LOGO */}
        <Link
          to="/"
          aria-label="iComputers Home"
          className="flex shrink-0 items-center"
        >
          <img
            src="/header-logo.png"
            alt="iComputers"
            className="h-11 w-auto max-w-[155px] object-contain sm:h-12 sm:max-w-[190px]"
          />
        </Link>

        {/* DESKTOP SEARCH */}
        <form
          onSubmit={handleSearch}
          role="search"
          className="hidden min-w-0 max-w-[540px] flex-1 items-center overflow-hidden rounded-xl border border-white/10 bg-[#151922] transition focus-within:border-blue-500/60 md:flex"
        >
          <FiSearch className="ml-4 shrink-0 text-lg text-blue-400" />

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search computers, monitors, components..."
            aria-label="Search products"
            className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-zinc-500"
          />

          <button
            type="submit"
            className="flex h-11 shrink-0 items-center gap-2 bg-blue-600 px-5 text-xs font-semibold transition hover:bg-blue-500"
          >
            Search
            <FiArrowRight />
          </button>
        </form>

        {/* HEADER ACTIONS */}
        <div className="flex shrink-0 items-center gap-2">

          <button
            type="button"
            aria-label="Toggle search"
            aria-expanded={mobileSearchOpen}
            onClick={() => {
              setMobileSearchOpen((prev) => !prev);
              setMenuOpen(false);
            }}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-blue-400 md:hidden"
          >
            {mobileSearchOpen ? <FiX size={20} /> : <FiSearch size={20} />}
          </button>

          <Link
            to="/cart"
            aria-label={`Shopping cart, ${itemCount} items`}
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-200 transition hover:border-blue-500/40 hover:text-blue-400"
          >
            <FiShoppingCart size={20} />

            {itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

{/* user data */}
          <Link>
            <UserData/>
          </Link>   
          
          <button
            type="button"
            aria-label="Toggle mobile menu"
            aria-expanded={menuOpen}
            onClick={() => {
              setMenuOpen((prev) => !prev);
              setMobileSearchOpen(false);
            }}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 md:hidden"
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH */}
      {mobileSearchOpen && (
        <div className="border-t border-white/10 bg-[#10141c] px-4 py-3 md:hidden">
          <form
            onSubmit={handleSearch}
            role="search"
            className="flex overflow-hidden rounded-xl border border-white/10 bg-[#171c26] focus-within:border-blue-500/50"
          >
            <FiSearch className="ml-3 self-center text-lg text-blue-400" />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none"
            />

            <button
              type="submit"
              className="bg-blue-600 px-5 text-xs font-semibold"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* DESKTOP NAVIGATION */}
      <div className="hidden border-t border-white/[0.07] bg-[#10141c] md:block">
        <div className="mx-auto flex h-[50px] max-w-[1600px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">

          <div className="flex h-full items-center gap-8">

            <div
              ref={dropdownRef}
              className="relative flex h-full items-center"
            >
              <button
                type="button"
                aria-expanded={categoriesOpen}
                aria-haspopup="true"
                onClick={() => setCategoriesOpen((prev) => !prev)}
                className={`flex h-full items-center gap-2 border-b-2 text-[13px] font-semibold transition ${
                  categoriesOpen
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent hover:text-blue-400"
                }`}
              >
                <FiGrid className="text-base text-blue-400" />
                Categories

                <FiChevronDown
                  size={14}
                  className={`transition-transform ${
                    categoriesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* CATEGORY DROPDOWN */}
              {categoriesOpen && (
                <div className="absolute left-0 top-full z-50 w-[490px] overflow-hidden rounded-b-2xl border border-white/10 bg-[#131822] shadow-2xl shadow-black/60">

                  <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                    <div>
                      <p className="text-sm font-semibold">
                        Shop by Category
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        Find the right gear for your setup
                      </p>
                    </div>

                    <Link
                      to="/products"
                      onClick={() => setCategoriesOpen(false)}
                      className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300"
                    >
                      View All
                      <FiArrowRight size={14} />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-px bg-white/[0.06]">
                    {categories.map((category) => (
                      <Link
                        key={category.value}
                        to={getCategoryUrl(category.value)}
                        onClick={() => setCategoriesOpen(false)}
                        className="group flex items-center justify-between gap-2 bg-[#131822] px-5 py-3.5 text-xs font-medium text-zinc-300 transition hover:bg-[#1c2638] hover:text-blue-400"
                      >
                        {category.label}

                        <FiArrowRight className="shrink-0 opacity-0 transition group-hover:opacity-100" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="h-5 w-px bg-white/10" />

            <nav
              aria-label="Main navigation"
              className="flex h-full items-center gap-8"
            >
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={desktopNavClass}
                >
                  {({ isActive }) => (
                    <>
                      {link.label}

                      <span
                        className={`absolute bottom-0 left-0 h-[2px] w-full bg-blue-500 transition-transform ${
                          isActive
                            ? "scale-x-100"
                            : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          <span className="hidden text-[11px] font-medium uppercase tracking-widest text-zinc-500 lg:block">
            Built for Performance
          </span>
        </div>
      </div>

      {/* MOBILE NAVIGATION */}
      {menuOpen && (
        <div className="absolute left-0 top-full z-50 max-h-[calc(100dvh-74px)] w-full overflow-y-auto border-t border-white/10 bg-[#10141c] shadow-2xl shadow-black/50 md:hidden">

          <nav
            aria-label="Mobile navigation"
            className="flex flex-col gap-1 px-4 py-5"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMenuOpen(false)}
                className={mobileNavClass}
              >
                {link.label}
                <FiArrowRight size={15} />
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-white/10 px-4 py-5">
            <h3 className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <FiGrid className="text-blue-400" />
              Shop by Category
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <Link
                  key={category.value}
                  to={getCategoryUrl(category.value)}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg border border-white/10 bg-[#151a24] px-4 py-3.5 text-xs font-medium text-zinc-300 transition hover:border-blue-500/30 hover:text-blue-400"
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
