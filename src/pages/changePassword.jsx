import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api"; // Adjust path if needed

export default function ChangePassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    async function checkPassword() {

        if (!newPassword || !confirmPassword) {
            toast.error("Please fill both fields!");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Please enter same password!");
            return;
        }

        try {
            await api.post("/users/change", {
                newPassword: newPassword
            });

            toast.success("Password Changed Successfully.");

            navigate("/settings");

        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to change password"
            );
        }
    }

    return (
        <section className="account-page">
            <div className="account-card">
                <Link to="/settings" className="text-sm font-semibold text-blue-400 hover:underline">← Account settings</Link>
                <p className="account-kicker mt-6">Security</p>
                <h1 className="account-title">Change password</h1>
                <form className="mt-6 space-y-5" onSubmit={(event) => {
                    event.preventDefault();
                    checkPassword();
                }}>
                    <label className="account-field">New password
                        <input type="password" autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </label>
                    <label className="account-field">Confirm new password
                        <input type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </label>
                    <button type="submit" className="account-action">Change password</button>
                </form>
            </div>
        </section>
    );
}
