import { Link } from "react-router-dom";
import api from "../utils/api";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function Settings() {

    const [user, setUser] = useState(null);
    const [newFirstName, setNewFirstName] = useState("");
    const [newLastName, setNewLastName] = useState("");
    const [image, setImage] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {

        api.get("/users/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            setUser(res.data);

            setNewFirstName(res.data.firstName ?? "");
            setNewLastName(res.data.lastName ?? "");
        })
        .catch((err) => {
            console.log(err);
            toast.error("Failed to load user");
        });

    }, [token]);


    async function updateUser() {

        const formData = new FormData();

        formData.append("firstName", newFirstName);
        formData.append("lastName", newLastName);

        if (image) {
            formData.append("image", image);
        }

        try {

            await api.post(
                "/users/update",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success("Profile updated successfully!");

            // Refresh user information
            const updatedUser = await api.get("/users/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUser(updatedUser.data);

        } catch (err) {
            console.log(err);
            toast.error("Failed to update profile");
        }
    }


    return (
        <section className="account-page">
            <div className="account-card">
                <p className="account-kicker">My account</p>
                <h1 className="account-title">Settings</h1>
                {user === null ? (
                    <p role="status" className="mt-5 text-zinc-400">Loading profile…</p>
                ) : (
                    <form className="mt-6 space-y-6" onSubmit={(event) => {
                        event.preventDefault();
                        updateUser();
                    }}>
                        <div className="flex items-center gap-4 border-y border-white/10 py-5">
                            <img src={user.image || "/default-profile.png"} alt="" className="size-14 rounded-full object-cover ring-2 ring-blue-500/40" />
                            <div className="min-w-0">
                                <p className="text-sm text-zinc-400">Profile</p>
                                <p className="break-words text-lg font-semibold">{user.firstName} {user.lastName}</p>
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="account-field">First name
                                <input autoComplete="given-name" value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)} />
                            </label>
                            <label className="account-field">Last name
                                <input autoComplete="family-name" value={newLastName} onChange={(e) => setNewLastName(e.target.value)} />
                            </label>
                        </div>
                        <label className="account-field">Profile photo
                            <input className="file:mr-3 file:rounded-md file:bg-white/10 file:px-3 file:py-1 file:text-sm" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                        </label>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <button className="account-action" type="submit">Save changes</button>
                            <Link className="text-sm font-semibold text-blue-400 hover:underline" to="/settings/password">Change password</Link>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
}
