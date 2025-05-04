import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { User } from '@/models/User';
import connectDB from './mongodb';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectDB();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          return null;
        }

        const isValid = await user.comparePassword(credentials.password);
        if (!isValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
};

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
    
    await connectDB();
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export function requireAuth(handler: Function) {
  return async function (...args: any[]) {
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        error: 'Unauthorized',
        status: 401
      };
    }

    return handler(...args);
  };
}

export function requireRole(roles: string[]) {
  return function (handler: Function) {
    return async function (...args: any[]) {
      const user = await getCurrentUser();
      
      if (!user) {
        return {
          error: 'Unauthorized',
          status: 401
        };
      }

      if (!roles.includes(user.role)) {
        return {
          error: 'Forbidden',
          status: 403
        };
      }

      return handler(...args);
    };
  };
} 