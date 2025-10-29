
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';
import { connectDB } from './mongodb';
import { User } from '@/models/User';
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: { email:{label:'Email', type:'text'}, password:{label:'Password', type:'password'} },
      async authorize(credentials) {
        if (!credentials) return null;
        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;
        const valid = await user.comparePassword(credentials.password);
        if (!valid) return null;
        return { id: user._id.toString(), email: user.email };
      }
    })
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: '/login' }
};
