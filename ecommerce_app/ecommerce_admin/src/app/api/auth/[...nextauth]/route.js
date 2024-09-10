import NextAuth, { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
const adminEmails = ['yashwantmahajan84@gmail.com'];
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),  
  ],
  adapter:MongoDBAdapter(clientPromise),
  callbacks:{
    session: async ({session,token,user})=>{
      if(adminEmails.includes(session?.user?.email))
      {
        return session;
      }
      else{
        return false;
      }

    },
    async signIn({ user, account, profile }) {
      // Allow sign in only if user email is in the adminEmails list
      if (adminEmails.includes(user.email)) {
        return true;
      } else {
        return false;
      }
    },
  },

  
  
};

const handler = NextAuth(authOptions);
// export  async function isAdminRequest(req){
//   const session = await getServerSession(req,authOptions);
//   if(!adminEmails.includes(session?.user?.email)){
//     throw 'not admin';
//   }
// }
export async function isAdminRequest(request) {
  const session = await getServerSession({ req: request, ...authOptions });

  if (!session || !adminEmails.includes(session.user?.email)) {
    throw new Error('Not authorized');
  }
}
export { handler as GET, handler as POST };
