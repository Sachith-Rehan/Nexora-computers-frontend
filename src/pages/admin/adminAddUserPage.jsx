import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../utils/api";

export default function AdminAddUserPage() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function createUser(event) {
    event.preventDefault();
    if (saving) return;
    const form = new FormData(event.currentTarget);
    const firstName = form.get("firstName").trim();
    const lastName = form.get("lastName").trim();
    const email = form.get("email").trim();
    const password = form.get("password");
    if (!firstName || !lastName) {
      setError("Enter a first and last name.");
      return;
    }
    if (password !== form.get("confirmation")) {
      setError("The passwords must match.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const { data } = await api.post("/users/create", {
        firstName, lastName, email, password, isAdmin: form.get("role") === "admin",
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // This endpoint also returns HTTP 200 for duplicate emails and validation errors.
      if (data?.message !== "user created successfully") {
        setError(data?.message === "user already exists"
          ? "A user with this email already exists."
          : "Could not create the user. Check the details and try again.");
        return;
      }
      toast.success("User created successfully");
      navigate("/admin/users");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create the user. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const cardClass = "rounded-lg bg-white p-5 shadow-2xl sm:p-6";
  const labelClass = "grid min-w-0 content-start gap-1.5 text-sm font-semibold";
  const inputClass = "w-full min-w-0 rounded-lg border-2 border-gray-400 bg-transparent px-3 py-2.5 text-sm font-normal focus:border-blue-500 focus:outline-none";
  return (
    <form onSubmit={createUser} className="min-h-full w-full space-y-4 pb-4">
        <header className={`flex flex-wrap items-center justify-between gap-4 ${cardClass}`}>
          <h1 className="text-2xl font-semibold">Add User</h1>
          <div className="flex gap-3">
            <Link to="/admin/users" className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">Cancel</Link>
            <button type="submit" disabled={saving} className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-60">
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </header>
        <section className={cardClass}>
          <h2 className="mb-5 text-lg font-semibold">Account details</h2>
          <fieldset disabled={saving} className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>First name
              <input name="firstName" autoComplete="off" required className={inputClass} />
            </label>
            <label className={labelClass}>Last name
              <input name="lastName" autoComplete="off" required className={inputClass} />
            </label>
            <label className={labelClass}>Email address
              <input name="email" type="email" autoComplete="off" required className={inputClass} />
            </label>
            <label className={labelClass}>Account role
              <select name="role" defaultValue="user" className={inputClass}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <span className="text-xs font-normal text-gray-600">Admins can access the store management panel.</span>
            </label>
          </fieldset>
        </section>
        <section className={cardClass}>
          <h2 className="mb-5 text-lg font-semibold">Password</h2>
          <fieldset disabled={saving} className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>Password
              <input name="password" type="password" autoComplete="new-password" required className={inputClass} />
            </label>
            <label className={labelClass}>Confirm password
              <input name="confirmation" type="password" autoComplete="new-password" required className={inputClass} />
            </label>
          </fieldset>
        </section>
        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
    </form>
  );
}
