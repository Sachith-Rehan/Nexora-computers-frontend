
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiChevronDown,
  FiShoppingBag,
  FiSettings,
  FiLogOut,
  FiLogIn,
} from "react-icons/fi";

import api from "../utils/api";

export default function UserData() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch logged-in user
  useEffect(() => {
    let active = true;
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (active) {
          setUser(res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching user:", err);

        if (active) {
          setUser(null);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    if (!menuOpen) return;

    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleOutsideClick
      );
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setMenuOpen(false);
    navigate("/");
  };

  // Loading placeholder
  if (loading) {
    return (
      <div
        className="h-10 w-10 animate-pulse rounded-lg bg-white/5 sm:w-28"
        aria-label="Loading account"
      />
    );
  }

  // Not logged in
  if (!user) {
    return (
      <Link
        to="/login"
        aria-label="Login to your account"
        className="group flex h-10 items-center justify-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 text-sm font-semibold text-cyan-400 transition-all duration-200 hover:border-cyan-400 hover:bg-cyan-400 hover:text-[#090a0d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 sm:px-4"
      >
        <FiLogIn
          size={17}
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />

        <span className="hidden sm:inline">
          Login
        </span>
      </Link>
    );
  }

  const fullName =
    [user.firstName, user.lastName]
      .filter(Boolean)
      .join(" ") || "My Account";

  const initial =
    (user.firstName || "U").charAt(0).toUpperCase();

  // Shared avatar
  const avatar = (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cyan-400/30 bg-cyan-400/10">
      {user.image && !avatarError ? (
        <img
          src={user.image}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setAvatarError(true)}
        />
      ) : (
        <span className="text-sm font-bold text-cyan-400">
          {initial}
        </span>
      )}
    </div>
  );

  return (
    <div
      ref={dropdownRef}
      className="relative flex items-center"
    >
      {/* Account trigger */}
      <button
        type="button"
        aria-label={`Account menu for ${fullName}`}
        aria-expanded={menuOpen}
        aria-haspopup="true"
        aria-controls="user-account-dropdown"
        onClick={() => setMenuOpen((prev) => !prev)}
        className={`group flex h-10 items-center gap-2 rounded-lg border px-1.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 sm:px-2.5 ${
          menuOpen
            ? "border-cyan-400/40 bg-cyan-400/10"
            : "border-white/10 bg-white/[0.03] hover:border-cyan-400/30 hover:bg-white/[0.06]"
        }`}
      >
        {avatar}

        {/* Username - hidden on small screens */}
        <div className="hidden max-w-[120px] flex-col items-start md:flex">
          {/* <span className="text-[10px] leading-3 text-zinc-500">
            My Account
          </span> */}

          <span className="max-w-[120px] truncate text-xs font-semibold text-zinc-100 transition-colors group-hover:text-cyan-400">
            {user.firstName || "Account"}
          </span>
        </div>

        <FiChevronDown
          size={14}
          className={`hidden text-zinc-500 transition-transform duration-200 md:block ${
            menuOpen ? "rotate-180 text-cyan-400" : ""
          }`}
        />
      </button>

      {/* Account dropdown */}
      {menuOpen && (
        <div
          id="user-account-dropdown"
          className="absolute right-0 top-[calc(100%+12px)] z-[100] w-[260px] overflow-hidden rounded-xl border border-white/10 bg-[#11141a] shadow-2xl shadow-black/60"
        >
          {/* Account profile header */}
          <div className="border-b border-white/10 bg-[#151a20] px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cyan-400/30 bg-cyan-400/10">
                {user.image && !avatarError ? (
                  <img
                    src={user.image}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <FiUser
                    size={21}
                    className="text-cyan-400"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {fullName}
                </p>

                {user.email && (
                  <p className="mt-1 truncate text-xs text-zinc-500">
                    {user.email}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />

              <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-400">
                Signed in
              </span>
            </div>
          </div>

          {/* Dropdown links */}
          <div className="space-y-1 p-2">

            <Link
              to="/my-orders"
              onClick={() => setMenuOpen(false)}
              className="group flex items-center justify-between rounded-lg px-3 py-3 text-sm text-zinc-300 transition-colors duration-200 hover:bg-cyan-400/10 hover:text-cyan-400"
            >
              <span className="flex items-center gap-3">
                <FiShoppingBag size={17} />
                My Orders
              </span>

              <FiChevronDown
                size={13}
                className="-rotate-90 text-zinc-600 transition-colors group-hover:text-cyan-400"
              />
            </Link>

            <Link
              to="/settings"
              onClick={() => setMenuOpen(false)}
              className="group flex items-center justify-between rounded-lg px-3 py-3 text-sm text-zinc-300 transition-colors duration-200 hover:bg-cyan-400/10 hover:text-cyan-400"
            >
              <span className="flex items-center gap-3">
                <FiSettings size={17} />
                Account Settings
              </span>

              <FiChevronDown
                size={13}
                className="-rotate-90 text-zinc-600 transition-colors group-hover:text-cyan-400"
              />
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-white/10 p-2">
            <button
              type="button"
              onClick={handleLogout}
              className="group flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm text-red-400 transition-colors duration-200 hover:bg-red-400/10 hover:text-red-300"
            >
              <span className="flex items-center gap-3">
                <FiLogOut size={17} />
                Log Out
              </span>

              <FiChevronDown
                size={13}
                className="-rotate-90 text-red-400/50 transition-colors group-hover:text-red-300"
              />
            </button>
          </div>

          {/* Bottom branding */}
          <div className="border-t border-white/10 bg-[#0d0f13] px-4 py-3 text-center">
            <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-600">
              iComputers Account
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
