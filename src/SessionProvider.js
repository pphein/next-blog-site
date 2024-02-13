'use client';
import { SessionProvider } from 'next-auth/react';

const Provider = ({ childern, session }) => (
    <SessionProvider session={session}>
        {childern}
    </SessionProvider>
);

export default Provider;