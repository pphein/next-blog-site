'use client'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'


import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const QuillEditor = dynamic(() => import('react-quill'), { ssr: false });
const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        [{ align: [] }],
        [{ color: [] }],
        ['code-block'],
        ['clean'],
    ],
};

const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    'image',
    'align',
    'color',
    'code-block',
];



const Edit = (ctx) => {
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [category, setCategory] = useState('Nature')

    const handleEditorChange = (newContent) => {
        setDesc(newContent);
    };

    const { data: session, status } = useSession();
    const router = useRouter();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'

    useEffect(() => {
        async function fetchPost() {
            const res = await fetch(`${baseUrl}/api/post/${ctx.params.id}`)

            const post = await res.json()

            setTitle(post?.title)
            setDesc(post?.desc)
            setCategory(post?.category)
        }

        fetchPost()
    }, [])

    if (status === 'loading') {
        return <p>Loading ...</p>
    }

    if (status === 'unauthenticated') {
        return <p>Access denied</p>
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (title === '' || category === '' || desc === '') {
            toast.error('All fields are required')
            return
        }

        try {
            const body = {
                title,
                desc,
                category
            }

            const res = await fetch(`${baseUrl}/api/post/${ctx.params.id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.user?.accessToken}`
                },
                method: "PUT",
                body: JSON.stringify(body)
            })

            if (!res.ok) {
                throw new Error('Error has occured')
            }

            const post = await res.json()

            router.push('/')
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <section className='bg-gray-100 max-w-screen-sm m-auto p-8'>
            <div className='text-center mb-20'>
                <h1 className='sm:text-3xl text-2xl font-medium title-font text-gray-900 mb-4'>
                    Update Post
                </h1>
                <div className='flex justify-center mt-2'>
                    <div className='w-16 h-1 rounded-full bg-indigo-500 inline-flex'></div>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col mb-3">
                    <input
                        value={title}
                        type="text"
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full focus:outline-none p-2"
                        placeholder="Title"
                    />
                </div>
                <div className="flex flex-col mb-3">
                    {/* <input
                            type="text"
                            onChange={(e) => setDesc(e.target.value)}
                            className="w-full focus:outline-none pt-8 pb-8"
                            placeholder="Description"
                        /> */}
                    <div className="h-screen flex items-center flex-col">
                        <QuillEditor
                            value={desc}
                            onChange={handleEditorChange}
                            modules={quillModules}
                            formats={quillFormats}
                            className="w-full h-[70%] mt-10 bg-white"
                        />
                    </div>
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
        </section>
    )
}

export default Edit;