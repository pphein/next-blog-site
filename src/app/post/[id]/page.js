"use client"
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { BsFillPencilFill } from "react-icons/bs";
import { AiFillDelete, AiFillLike, AiOutlineLike } from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Comment from "@/components/Comment";
import { RotatingLines } from "react-loader-spinner";

const PostDetail = (ctx) => {
  const [postDetails, setPostDetails] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [postLikes, setPostLikes] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { data: session } = useSession();
  const router = useRouter();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";

  // Fetch comments
  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(
          `${baseUrl}/api/comment/${ctx.params.id}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to fetch comments");
        const commentsData = await res.json();
        setComments(commentsData);
      } catch (err) {
        console.error(err);
        setError("Failed to load comments");
      }
    }
    if (session) fetchComments();
  }, [session, ctx.params.id, baseUrl]);

  // Fetch post
  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const res = await fetch(
          `${baseUrl}/api/post/${ctx.params.id}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to fetch post");
        const post = await res.json();

        setPostDetails(post);
        setIsLiked(post?.likes?.includes(session?.user?._id));
        setPostLikes(post?.likes?.length || 0);
      } catch (err) {
        console.error(err);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [session, ctx.params.id, baseUrl]);

  const handleDelete = async () => {
    try {
      const confirmModal = confirm("Are you sure you want to delete your post?");
      if (!confirmModal) return;

      const res = await fetch(`${baseUrl}/api/post/${ctx.params.id}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/");
      } else {
        toast.error("Failed to delete post");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while deleting");
    }
  };

  const handleLike = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/post/${ctx.params.id}/like`, {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        method: "PUT",
      });

      if (res.ok) {
        setIsLiked((prev) => !prev);
        setPostLikes((prev) => (isLiked ? prev - 1 : prev + 1));
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update like");
    }
  };

  const handleComment = async () => {
    if (commentText?.length < 2) {
        toast.error("Comment must be at least 2 characters long");
        return;
    }

    try {
        const body = {
        postId: ctx.params.id,
        authorId: session?.user?._id,
        text: commentText,
        };

        const res = await fetch(`${baseUrl}/api/comment`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        method: "POST",
        body: JSON.stringify(body),
        });

        if (!res.ok) {
        let message = "Failed to post comment";
        try {
            const errData = await res.json();
            message = errData?.message || message;
        } catch (_) {}

        if (res.status === 401 || res.status === 403) {
            toast.error("Your session has expired. Please log in again.");
            router.push("/login"); // redirect to login page
        } else {
            toast.error(`${res.status} ${message}`);
        }
        return; // stop execution
        }

        const newComment = await res.json();
        setComments((prev) => [newComment, ...prev]);
        setCommentText("");
    } catch (error) {
        console.error(error);
        toast.error(error.message || "Failed to add comment");
    }
    };


  // --- Render Section ---
  if (loading) return (
    <div className="flex items-center justify-center">
        <RotatingLines
        strokeColor="grey"
        strokeWidth="5"
        animationDuration="0.75"
        width="96"
        visible={true}
        />
    </div>
  );
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <section className="max-w-screen-sm m-auto">
      <div className="container px-5 py-12 mx-auto">
        <div className="flex flex-wrap -m-12">
          {postDetails && (
            <div className="p-12 flex flex-col">
              <h2 className="sm:text-3xl text-xl title-font font-medium text-gray-900 mt-4 mb-4 text-center">
                {postDetails.title}
              </h2>
              <div className="flex items-center justify-center mt-4 gap-x-5 pt-4 pb-5">
                {postDetails?.authorId?._id?.toString() ===
                session?.user?._id?.toString() ? (
                  <>
                    <Link
                      href={`/post/edit/${ctx.params.id}`}
                      className="inline-flex px-3 py-2 rounded-md text-primary font-semibold"
                    >
                      Edit <BsFillPencilFill style={{ fontSize: "24px" }} />
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="inline-flex px-3 py-2 rounded-md text-primary font-semibold"
                    >
                      Delete <AiFillDelete style={{ fontSize: "24px" }} />
                    </button>
                  </>
                ) : (
                  <h2 className="text-center text-gray-400 mb-2">
                    Post By: {postDetails?.authorId?.username}
                  </h2>
                )}
              </div>
              <span className="text-center py-2 px-2 rounded bg-indigo-50 text-indigo-500 text-sx font-medium tracking-widest">
                {postDetails?.category}
              </span>
              <div
                dangerouslySetInnerHTML={{ __html: postDetails?.desc }}
              />
              <div className="flex items-center flex-wrap pb-4 mb-4 border-b-2 border-gray-100 mt-auto w-full">
                <span className="text-gray-400 mr-3 inline-flex items-center ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-500">
                  {postLikes}{" "}
                  {isLiked ? (
                    <AiFillLike size={16} onClick={handleLike} />
                  ) : (
                    <AiOutlineLike size={16} onClick={handleLike} />
                  )}
                </span>
              </div>
            </div>
          )}
        </div>

        <h2 className="text-center">Comment Section</h2>
        <div>
          <input
            onChange={(e) => setCommentText(e.target.value)}
            value={commentText}
            type="text"
            className="w-full focus:outline-none p-8 mt-4"
            placeholder="Leave your comment here ..."
          />
        </div>
        <div>
          <button
            onClick={handleComment}
            className="px-6 py-2.5 rounded-md bg-primary mt-3 text-white hover:bg-blue-500"
          >
            Comment
          </button>
        </div>
        <div>
          {comments?.length > 0 ? (
            comments.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                setComments={setComments}
              />
            ))
          ) : (
            <h4>Be the first one to leave a comment!</h4>
          )}
        </div>
      </div>
    </section>
  );
};

export default PostDetail;
