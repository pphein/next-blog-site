import { useSession } from 'next-auth/react';
import React from 'react';
import { BsTrash } from 'react-icons/bs';

const Comment = ({ comment, setComments }) => {

    const { data: session } = useSession();
    const token = session?.user?.accessToken;

    const handleDeleteComment = async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'
            await fetch(`${baseUrl}/api/comment/${comment?._id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                method: "DELETE"
            })

            setComments(prev => {
                return [...prev].filter((c) => c?._id !== comment?._id)
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <section className='text-gray-600 body-font bg-white mt-6'>
            <div className='container px-5 py-4 mx-auto'>
                <div className='flex items-center mx-auto border-b pb-6 border-gray-200 sm:flex-row flex-col'>
                    <div className='flex-grow sm:text-left text-center mt-6 sm:mt-0'>
                        <h3 className='mt-3 text-indigo-500 inline-block items-center'>
                            {comment?.authorId?.username}
                        </h3>
                        <p className='inline-block leding-relaxed text-base'>
                            : {comment?.text}
                        </p>
                        <h3 className='inline-block ml-6 item-center text-gray-900 text-lg title-font font-medium'>
                            {
                                session?.user?._id === comment?.authorId?._id && (
                                    <BsTrash onClick={handleDeleteComment} />
                                )
                            }
                        </h3>
                    </div>
                </div>
            </div>
        </section>
    )

}

export default Comment;