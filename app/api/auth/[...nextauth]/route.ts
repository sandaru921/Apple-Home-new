// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Login',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // FIX: Check if credentials exists
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        if (credentials.username === 'admin' && credentials.password === 'admin123') {
          return { id: '1', name: 'Admin', email: 'admin@applehome.lk' };
        }
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async session({ session, token }) {
      // FIX: Type session properly
      if (session.user) {
        session.user.role = 'admin';
        session.user.id = token.sub || '1';
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };