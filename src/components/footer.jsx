
import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiArrowRight,
  FiMail,
  FiCpu,
} from "react-icons/fi";

const shopLinks = [
  { label: "All Products", to: "/products" },
  { label: "Laptops", to: "/products?category=laptop" },
  { label: "Desktop", to: "/products?category=desktop" },
  { label: "Gaming", to: "/products?category=gaming" },
  { label: "Workstation", to: "/products?category=workstation" },
  {
    label: "Graphics Cards",
    to: "/products?category=graphic%20card",
  },
  {
    label: "Processors",
    to: "/products?category=processor",
  },
  { label: "Monitors", to: "/products?category=monitor" },
  { label: "Accessories", to: "/products?category=accessories" },
];

const exploreLinks = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Contact Us", to: "/contact-us" },
  { label: "Shopping Cart", to: "/cart" },
];

function FooterLink(props) {
  function scrollToPageStart(event) {
    if (event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }

  return <Link {...props} onClick={scrollToPageStart} />;
}

export default function Footer() {
  const accountLinks = localStorage.getItem("token")
    ? [{ label: "My Orders", to: "/my-orders" }, { label: "Account Settings", to: "/settings" }]
    : [{ label: "Log In", to: "/login" }, { label: "Register", to: "/register" }];

  return (
    <footer className="border-t border-blue-500/30 bg-[#090b10] text-white">

      {/* Top CTA */}
      <div className="border-b border-white/10 bg-[#10141d]">
        <div className="page-wrapper flex flex-col gap-6 py-9 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-blue-400">
              Built for Performance
            </p>

            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Ready for your next upgrade?
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              Explore powerful hardware and accessories
              for your ideal setup.
            </p>
          </div>

          <FooterLink
            to="/products"
            className="group inline-flex shrink-0 items-center justify-center gap-3 self-start bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-500 md:self-auto"
          >
            Explore Products
            <FiArrowUpRight className="text-lg transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </FooterLink>

        </div>
      </div>

      {/* Main Footer */}
      <div className="page-wrapper py-12 lg:py-16">

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-12">

          {/* Brand */}
          <div>

            <FooterLink
              to="/"
              className="inline-flex items-center gap-2"
            >
              <FiCpu className="text-3xl text-blue-400" />

              <span className="text-2xl font-bold tracking-tight text-white">
                i<span className="text-blue-400">Computers</span>
              </span>
            </FooterLink>

            <p className="mt-5 max-w-sm text-sm leading-7 text-zinc-400">
              Your destination for premium computing,
              gaming equipment, PC components, and
              accessories. Built for work, creativity,
              and performance.
            </p>

            <div className="mt-7 border-l-2 border-blue-500 pl-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
                Upgrade Your Experience
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Performance starts with the right gear.
              </p>
            </div>

          </div>

          {/* Shop */}
          <div>
            <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-white">
              Shop
            </h3>

            <div className="mb-6 h-[2px] w-8 bg-blue-500" />

            <ul className="space-y-4">
              {shopLinks.map((item) => (
                <li key={item.label}>
                  <FooterLink
                    to={item.to}
                    className="group inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors duration-200 hover:text-blue-400"
                  >
                    <FiArrowRight className="text-xs text-blue-500 opacity-0 transition-all duration-200 group-hover:opacity-100" />
                    {item.label}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-white">
              Explore
            </h3>

            <div className="mb-6 h-[2px] w-8 bg-blue-500" />

            <ul className="space-y-4">
              {[...exploreLinks, ...accountLinks].map((item) => (
                <li key={item.label}>
                  <FooterLink
                    to={item.to}
                    className="group inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors duration-200 hover:text-blue-400"
                  >
                    <FiArrowRight className="text-xs text-blue-500 opacity-0 transition-all duration-200 group-hover:opacity-100" />
                    {item.label}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-white">
              Need Assistance?
            </h3>

            <div className="mb-6 h-[2px] w-8 bg-blue-500" />

            <p className="text-sm leading-7 text-zinc-400">
              Have questions about a product or need
              help choosing the right components?
              Our team is here to help.
            </p>

            <FooterLink
              to="/contact-us"
              className="mt-6 inline-flex items-center gap-3 border border-white/15 px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-400"
            >
              <FiMail className="text-blue-400" />
              Contact Our Team
              <FiArrowUpRight />
            </FooterLink>
          </div>

        </div>

        {/* Bottom Footer */}
        <div className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} iComputers.
            All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="h-1.5 w-1.5 bg-blue-500" />
            Built for performance
            <span className="mx-2 text-zinc-700">/</span>
            Made for your setup
          </div>

        </div>

      </div>
    </footer>
  );
}
