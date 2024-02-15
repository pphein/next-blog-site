'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [category, setCategory] = useState('');

    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'loading') {
        return <p className="text-center text-5xl">Loading...</p>
    }

    if (status === 'unauthenticated') {
        return <p>Access Denied</p>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!title || !category || !desc) {
            toast.error("All fields are required")
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/api/post', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.user?.accessToken}`
                },
                method: 'POST',
                body: JSON.stringify({ title, desc, category, authorId: session?.user?._id })

            })
            console.log(res);
            if (!res.ok) {
                throw new Error("Error occured on creating a post")
            }

            const post = await res.json();
            router.push('/');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <section className="bg-gray-100 max-w-screen-sm m-auto p-8">
            <div className="mb-4 w-full text-4xl font-light text-center text-gray-800 uppercase sm-text-5xl">
                <h1 className="sm:text-3xl text-2xl font-medim title-font text-gray-900 mb-4">
                    Create A Post
                </h1>
                <div className="flex mt-2 justify-center">
                    <div className="w-16 h-1 rounded-full bg-indigo-500 inline-flex"></div>
                </div>
            </div>
            <div className="mt-8">
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col mb-6">
                        <input
                            type="text"
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full focus:outline-none p-2"
                            placeholder="Title"
                        />
                    </div>
                    <div className="flex flex-col mb-6">
                        <input
                            type="text"
                            onChange={(e) => setDesc(e.target.value)}
                            className="w-full focus:outline-none pt-8 pb-8"
                            placeholder="Description"
                        />
                    </div>
                    <div className="flex flex-col mb-6">
                        <select
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full focus:outline-none p-2 mt-4"
                        >
                            <option value="sports">Sports</option>
                            <option value="money">Money</option>
                            <option value="news">News</option>
                            <option value="tech">Tech</option>
                            <option value="programming">Programming</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2.5 rounded-md bg-primary mt-3 text-white hover:bg-blue-500 hover:text-white transition-all duration-200"
                    >
                        Post
                    </button>
                </form>
            </div>
        </section>
    )
}

export default CreatePost;