import { Link } from "react-router-dom";

export default function NotFoundPage({ admin = false }) {
  return (
    <section className="grid min-h-[calc(100svh-100px)] place-items-center bg-[#090a0d] px-6 py-16 text-center text-white">
      <div className="max-w-lg">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Error 404
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
          Page not found
        </h1>
        <p className="mt-5 leading-7 text-zinc-400">
          This link may be out of date. Check the address or use one of the links below.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to={admin ? "/admin/orders" : "/products"}
            className="bg-cyan-400 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-cyan-300 focus-visible:outline-offset-4"
          >
            {admin ? "Back to orders" : "Browse products"}
          </Link>
          <Link
            to="/"
            className="border border-white/25 px-5 py-3 text-sm font-semibold hover:border-cyan-400 focus-visible:outline-offset-4"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
