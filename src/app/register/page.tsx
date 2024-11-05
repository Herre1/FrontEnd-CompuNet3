"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRegister } from "@/hooks/auth/useRegister";

export default function RegisterPage() { 
    const [fullName, setUsername] = useState(""); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const { register } = useRegister();

    const onSubmit = () => {
        if (!fullName || !email || !password) {
            alert("Please complete all fields");
        } else {
            register(fullName, email, password)
                .then(() => router.push("/login"))
                .catch(() => { 
                    setUsername("");
                    setEmail("");
                    setPassword("");                    
                    alert("Registration failed, please try again.");
                });
        }
    };
    
    return (
        <div className="bg-gray-1000 font-[sans-serif]">
            <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
                <div className="max-w-md w-full">
                    <a href="javascript:void(0)">
                        <img
                            src="/images/mi-logo.png"
                            alt="logo personalizado"
                            className="w-40 mb-8 mx-auto block"
                        />
                    </a>
                    <div className="p-8 rounded-2xl bg-white shadow">
                        <h2 className="text-gray-800 text-center text-2xl font-bold">Register</h2>
                        <form className="mt-8 space-y-4">
                            <div>
                                <label className="text-gray-800 text-sm mb-2 block">Username</label>
                                <input
                                    name="username"
                                    type="text"
                                    required
                                    className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                    placeholder="Enter username"
                                    value={fullName}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-gray-800 text-sm mb-2 block">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-gray-800 text-sm mb-2 block">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="!mt-8">
                                <button
                                    type="button"
                                    onClick={onSubmit}
                                    className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                >
                                    Register
                                </button>
                            </div>
                            <p className="text-gray-800 text-sm !mt-8 text-center">
                                Already have an account?
                                <a
                                    href="/login"
                                    className="text-blue-600 hover:underline ml-1 whitespace-nowrap font-semibold"
                                >
                                    Sign in
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
