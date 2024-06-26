'use client';
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Login = () => {
    // const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(email)
        console.log(username);
        console.log(password)

        if (password === '' || username === '') {
            toast.error("Fill all fields");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        try {
            const res = await signIn('credentials', { username, password, redirect: false });
            console.log(res)
            if (res?.error == null) {
                router.push('/');
            } else {
                toast.error("Error occured while logging");
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <section className="bg-gray-100 max-w-screen-sm m-auto p-8 flex flex-col align-center justify-center rounded-md">
            <h1 className="mb-4 w-full text-4xl font-light text-center text-gray-800 uppercase sm:text-5xl">
                Login
            </h1>
            <div className="flex flex-col w-full px-4 py-8 bg-white rounded-md shadow sm:px-6 md:px-8 lg:px-10">
                <div className="self-center text-xl font-light text-gray-600 sm:text-2xl">
                    Welcome back!
                </div>
                <div className="mt-8">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-2">
                            <div className="flex flex-col mb-6">
                                <div className="flex">
                                    <input
                                        onChange={(e) => setUsername(e.target.value)}
                                        type="text"
                                        placeholder="Your username"
                                        className="rounded-r-lg flex-1 appearance-none border-gray-400 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 fucus:border-transparent"
                                    />
                                </div>
                            </div>
                            {/* <div className="flex flex-col mb-6">
                                <div className="flex">
                                    <input
                                        onChange={(e) => setEmail(e.target.value)}
                                        type="email"
                                        placeholder="Your Email"
                                        className="rounded-r-lg flex-1 appearance-none border-gray-400 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 fucus:border-transparent"
                                    />
                                </div>
                            </div> */}
                            <div className="flex flex-col mb-6">
                                <div className="flex">
                                    <input
                                        onChange={(e) => setPassword(e.target.value)}
                                        type="password"
                                        placeholder="Your Password"
                                        className="rounded-r-lg flex-1 appearance-none border-gray-400 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 fucus:border-transparent"
                                        id="sign-in-email"
                                    />
                                </div>
                            </div>
                            <div className="flex w-full">
                                <button
                                    type="submit"
                                    className="py-2 px-4 bg-primary hover:bg-blue-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition-all duration-300"
                                >
                                    Login
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="flex items-center justify-center mt-6">
                    <a
                        href="/register"
                        // target="_blank"
                        className="inline-flex items-center text-xs font-thin text-center text-gray-500 hover:text-gray-700"
                    >
                        <span className="ml-2">
                            Need An Account?
                        </span>
                    </a>
                </div>
            </div>
        </section>
    )
}

export default Login;