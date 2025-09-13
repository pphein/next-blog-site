'use client'
import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { AiFillLike, AiOutlineLike } from "react-icons/ai"
import Link from "next/link"

const PostCard = ({
    post: {
        _id,
        title,
        desc,
        likes,
        category,
        authorId
    }
}) => {
    const { data: session } = useSession()
    const [isLiked, setIsLiked] = useState(false)
    const [postLikes, setPostLikes] = useState(0)

    useEffect(() => {
        session && likes && setIsLiked(likes.includes(session?.user?._id))
        session && likes && setPostLikes(likes.length)
    }, [likes, session])

    const handleLike = async () => {

        try {
            const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
            const res = await fetch(`${baseUrl}/api/post/${_id}/like`, {
                headers: {
                    'Authorization': `Bearer ${session?.user?.accessToken}`
                },
                method: 'PUT'
            });

            console.log(res)
            if (res.ok) {
                if (isLiked) {
                    setIsLiked(prev => !prev)
                    setPostLikes(prev => prev - 1)
                } else {
                    setIsLiked(prev => !prev)
                    setPostLikes(prev => prev + 1)
                }
            }
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <section className="text-gray-600 body-font overflow-hiden">
            <div className="container px-5 py-4 mx-auto">
                <div className="flex flex-wrap -m-12">
                    <div className="p-12 flex flex-col items-start">
                        <span className="inline-block py-1 px-2 rounded bg-indigo-50 text-xs font-medium tracking-widest">
                            {category}
                        </span>
                        <Link
                            href={`/post/${_id}`}
                            className="sm:text-3xl text-2xl title-font font-medium text-gray-900 mt-4 mb-4 hover:text-indigo-500"
                        >
                            <h2 className="">
                                {title}
                            </h2>
                        </Link>
                        {/* <h2 className="sm:text-3xl text-2xl title-font font-medium text-gray-900 mt-4 mb-4">
                            {title}
                        </h2> */}
                        <a className="inline-flex items-center">
                            <span className="flex-grow flex flex-col pl-4">
                                <span className="title-font font-medium text-gray-700">
                                    Author: {authorId.username}
                                </span>
                            </span>
                        </a>
                        {/* <p className="leading-relax mb-8">
                            {desc}
                        </p> */}
                        <div dangerouslySetInnerHTML={{ __html: desc }} />
                        <div className="flex items-center flex-wrap pb-4 mb-4 border-b-2 border-gray-100 mt-auto w-full">
                            <Link
                                href={`/post/${_id}`}
                                className="text-indigo-500 inline-flex items-center hover:text-indigo-800"
                            >
                                See More
                            </Link>
                            <span className="text-gray-400 mr-3 inline-flex items-center ml-auto leading-none text-sm pr-3 py-2">
                                {postLikes}
                                {" "}
                                {
                                    isLiked
                                        ? (<AiFillLike onClick={handleLike} size={20} />)
                                        : (<AiOutlineLike onClick={handleLike} size={20} />)
                                }
                            </span>
                        </div>
                        {/* <a className="inline-flex items-center">
                            <span className="flex-grow flex flex-col pl-4">
                                <span className="title-font font-medium text-gray-900">
                                    Author: {authorId.username}
                                </span>
                            </span>
                        </a> */}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PostCard