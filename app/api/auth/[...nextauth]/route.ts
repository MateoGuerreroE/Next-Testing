import NextAuth from "next-auth/next";
import Google from "next-auth/providers/google";
import { connectToDB } from "@utils/database";
import User from "@models/user";
import { Session } from "next-auth";

interface extendedSession extends Session {
  id: string;
}

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({ email: session.user?.email });
      const newSession: extendedSession = {
        ...session,
        id: sessionUser._id.toString(),
      };
      return newSession;
    },
    async signIn({ profile }) {
      try {
        await connectToDB();
        //If user already exists
        const userExists = await User.findOne({ email: profile?.email });
        //If not then create
        if (!userExists) {
          console.log(profile);
          await User.create({
            email: profile?.email,
            username: profile?.name?.replace(" ", "").toLowerCase(),
            image: (profile as any)?.picture, //!
          });
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
