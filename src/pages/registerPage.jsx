import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/api";
import AccountLayout from "../components/accountLayout";

export default function RegisterPage() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function register(event) {
    event.preventDefault();
    if (saving) return;
    const form = new FormData(event.currentTarget);
    const firstName = form.get("firstName").trim();
    const lastName = form.get("lastName").trim();
    const email = form.get("email").trim();
    const password = form.get("password");
    if (!firstName || !lastName) {
      setError("Enter your first and last name.");
      return;
    }
    if (password !== form.get("confirmation")) {
      setError("Your passwords must match.");
      return;
    }

    setError("");
    setSaving(true);
    try {
      const { data } = await api.post("/users/create", { firstName, lastName, email, password });
      if (data?.message === "user already exists") {
        setError("An account already uses this email. Sign in or use another email.");
        return;
      }
      if (data?.message !== "user created successfully") {
        setError("Your account could not be created. Check your details and try again.");
        return;
      }
      toast.success("Account created. Sign in to continue.");
      navigate("/login", { replace: true, state: { email } });
    } catch {
      setError("Could not reach the registration service. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "mt-1.5 block h-12 w-full rounded-lg border border-slate-600 bg-[#0c1017] px-3 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400";
  return (
    <AccountLayout title="Create an account" description="Register to place orders and track your purchases.">
        <form onSubmit={register} className="mt-6 space-y-5">
          <fieldset disabled={saving} className="grid min-w-0 gap-4 sm:grid-cols-2">
            <label>First name<input name="firstName" autoComplete="given-name" required className={inputClass} /></label>
            <label>Last name<input name="lastName" autoComplete="family-name" required className={inputClass} /></label>
            <label className="sm:col-span-2">Email address<input name="email" type="email" autoComplete="email" required className={inputClass} /></label>
            <label className="sm:col-span-2">Password<input name="password" type="password" autoComplete="new-password" required className={inputClass} /></label>
            <label className="sm:col-span-2">Confirm password<input name="confirmation" type="password" autoComplete="new-password" required className={inputClass} /></label>
          </fieldset>
          {error && <p role="alert" className="text-sm text-red-200">{error}</p>}
          <button type="submit" disabled={saving} className="h-12 w-full rounded-lg bg-cyan-300 font-semibold text-slate-950 hover:bg-cyan-200 disabled:opacity-60">
            {saving ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm">Already have an account?{" "}
          <Link to="/login" className="font-semibold text-cyan-300 hover:underline">Sign in</Link>
        </p>
    </AccountLayout>
  );
}
