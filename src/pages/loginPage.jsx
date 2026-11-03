import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import api from "../utils/api";
import AccountLayout from "../components/accountLayout";

export default function LoginPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(state?.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function signIn(path, credentials) {
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post(path, credentials);
      if (typeof data?.token !== "string" || !data.token.trim()) {
        setError("Sign-in could not be completed. Please try again.");
        return;
      }
      localStorage.setItem("token", data.token);
      navigate(data.isAdmin ? "/admin" : "/", { replace: true });
    } catch (err) {
      const status = err.response?.status;
      setError(path === "/users/login" && (status === 401 || status === 404)
        ? "The email or password is incorrect."
        : "Sign-in could not be completed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const googleLogin = useGoogleLogin({
    onSuccess: response => signIn("/users/google-login", { accessToken: response.access_token }),
    onError: () => setError("Google sign-in was unsuccessful. Please try again."),
    onNonOAuthError: ({ type }) => {
      if (type === "popup_failed_to_open") setError("Allow pop-ups to sign in with Google.");
    },
  });

  function submit(event) {
    event.preventDefault();
    if (!busy) signIn("/users/login", { email: email.trim(), password });
  }

  const inputClass = "mt-1.5 block h-12 w-full rounded-lg border border-slate-600 bg-[#0c1017] px-3 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400";
  return (
    <AccountLayout title="Welcome back" description="Sign in to view your orders and manage your account.">
        <form onSubmit={submit} className="mt-6 space-y-5">
          <label className="block">Email address
            <input type="email" name="email" autoComplete="username" required value={email}
              onChange={event => setEmail(event.target.value)} className={inputClass} />
          </label>
          <div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="login-password">Password</label>
              <button type="button" aria-controls="login-password" onClick={() => setShowPassword(value => !value)}
                className="text-sm font-semibold text-cyan-300 hover:underline">
                {showPassword ? "Hide password" : "Show password"}
              </button>
            </div>
            <input id="login-password" name="password" type={showPassword ? "text" : "password"}
              autoComplete="current-password" required value={password}
              onChange={event => setPassword(event.target.value)} className={inputClass} />
          </div>
          {error && <p role="alert" className="text-sm text-red-200">{error}</p>}
          <button type="submit" disabled={busy} className="h-12 w-full rounded-lg bg-cyan-300 font-semibold text-slate-950 hover:bg-cyan-200 disabled:opacity-60">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <div className="my-4 flex items-center gap-3 text-sm text-gray-200">
          <span className="h-px flex-1 bg-white/20" />or<span className="h-px flex-1 bg-white/20" />
        </div>
        <button type="button" disabled={busy} onClick={() => { setError(""); googleLogin(); }}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white font-semibold text-slate-900 hover:bg-gray-100 disabled:opacity-60">
          <FaGoogle aria-hidden="true" /> Sign in with Google
        </button>
        <div className="mt-5 flex flex-wrap justify-between gap-3 text-sm">
          <Link to="/register" className="font-semibold text-cyan-300 hover:underline">Create an account</Link>
          <Link to="/contact-us" className="text-cyan-300 hover:underline">Get sign-in help</Link>
        </div>
    </AccountLayout>
  );
}
