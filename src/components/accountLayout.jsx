import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function AccountLayout({ title, description, children }) {
  return (
    <main className="flex min-h-dvh flex-col bg-slate-950/60 bg-[url('/login-bg.jpg')] bg-cover bg-center bg-no-repeat bg-blend-multiply px-4 text-white sm:px-8">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-end border-b border-white/10 py-4">
        <Link to="/products" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white">
          <FiArrowLeft aria-hidden="true" /> Back to shop
        </Link>
      </header>
      <div className="flex flex-1 items-center justify-center py-6 sm:py-10">
        <section className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#11151d]/85 px-5 py-7 shadow-2xl backdrop-blur-sm sm:p-8">
          <div className="border-b border-white/10 pb-5 text-center">
            <img src="/website-logo.png" alt="" width="1536" height="1024" className="mx-auto mb-3 h-16 w-auto object-contain" />
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}
