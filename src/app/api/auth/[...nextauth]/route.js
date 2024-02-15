import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";
import User from "@/models/User";
import { signJwtToken } from "@/lib/jwt";
import bcrypt from 'bcrypt'
import dbConnect from "@/lib/db";

const handler = NextAuth({
    providers: [
        Credentials({
            type: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'kobebrant@email.com' },
                username: { label: 'Username', type: 'text', placeholder: 'Kobe Brynt' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials, req) {
                // const { email, password } = credentials;
                const { username, password } = credentials;

                await dbConnect();
                // const user = await User.findOne({ email: email });
                const user = await User.findOne({ username: username });
                if (!user) {
                    throw new Error('Invalid input. Email not found');
                }

                const comparePass = await bcrypt.compare(password, user.password);

                if (!comparePass) {
                    throw new Error('Invalid input. Password Wrong!')
                } else {
                    const { password, ...currentUser } = user._doc

                    const accessToken = signJwtToken(currentUser, { expiresIn: '3d' });

                    return {
                        ...currentUser,
                        accessToken
                    }
                }
            }
        })
    ],
    pages: {
        signIn: '/login'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken
                token._id = user._id
            }

            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id
                session.user.accessToken = token.accessToken
            }

            return session
        }
    }
});

export { handler as GET, handler as POST }