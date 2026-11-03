import { FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

export default function AdminUserPage() {
    const [users, setUsers] = useState(null);
    const [error, setError] = useState("");
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        api.get("/users", {
            signal: controller.signal,
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }).then(({ data }) => {
            if (!Array.isArray(data.users)) throw new Error("Invalid user list");
            if (!controller.signal.aborted) setUsers(data.users);
        }).catch(err => {
            if (!controller.signal.aborted) {
                setError(err.response?.data?.message || "Unable to load users.");
            }
        });
        return () => controller.abort();
    }, [attempt]);

    return (
        <section className="w-full space-y-4">
            <header className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-white p-5 shadow-lg">
                <h1 className="text-2xl font-semibold">Users{users && ` (${users.length})`}</h1>
                <Link to="/admin/add-user" className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-white">
                    <FaPlus aria-hidden="true" /> Add User
                </Link>
            </header>
            <div className="overflow-x-auto rounded-lg bg-white shadow-lg">
                {error ? (
                    <div role="alert" className="p-5">
                        {error} <button className="font-semibold text-accent underline" onClick={() => {
                            setError("");
                            setAttempt(value => value + 1);
                        }}>Try again</button>
                    </div>
                ) : users === null ? (
                    <p role="status" className="p-5">Loading users…</p>
                ) : users.length === 0 ? (
                    <p className="p-5">No users yet.</p>
                ) : (
                    <table aria-label="User accounts" className="w-full text-left text-sm">
                        <thead className="bg-accent text-white">
                            <tr>{["Name", "Email", "Role", "Account status", "Email verification"].map(label => (
                                <th key={label} scope="col" className="whitespace-nowrap px-4 py-3">{label}</th>
                            ))}</tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map(user => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-semibold">{user.firstName} {user.lastName}</td>
                                    <td className="px-4 py-3">{user.email}</td>
                                    <td className="px-4 py-3">{user.isAdmin ? "Admin" : "User"}</td>
                                    <td className="px-4 py-3">{user.isBlocked ? "Blocked" : "Active"}</td>
                                    <td className="px-4 py-3">{user.isEmailVerified ? "Verified" : "Unverified"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </section>
    )
}
