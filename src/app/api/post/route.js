import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import { verifyJwtToken } from "@/lib/jwt";

export async function GET(req) {
    await dbConnect()

    try {
        const posts = await Post.find({}).limit(16).populate("authorId");
        return new Response(JSON.stringify(posts), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify(null), { status: 500 })
    }
}

export async function POST(req) {
    await dbConnect();

    const accessToken = req.headers.get("authorization");
    const token = accessToken.split(' ')[1];
    const decodedToken = verifyJwtToken(token);

    if (!accessToken || !decodedToken) {
        return new Response(JSON.stringify({ error: "unauthorized (wrong or expired token)" }), { status: 403 });
    }

    try {
        const body = await req.json();
        console.log(body);
        const newPost = await Post.create(body);

        return new Response(JSON.stringify(newPost), { status: 201 });
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify(null), { status: 500 });
    }
}