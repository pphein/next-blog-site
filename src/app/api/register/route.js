import User from "@/models/User";
import bcrypt from 'bcrypt';
import dbConnect from "@/lib/db";

export async function POST(req) {
    try {
        console.log(req);
        await dbConnect();
        const { email, username, password: pass } = await req.json();
        const isExisting = await User.findOne({ username: username }).maxTimeMS(30000);
        if (isExisting) {
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(pass, 10);
        const newUser = await User.create({ email: email, username: username, password: hashedPassword });

        const { password, ...user } = newUser._doc;

        return new Response(JSON.stringify(user), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify(error.message), { status: 500 })
    }
}