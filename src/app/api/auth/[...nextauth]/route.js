import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  secret: 'bb3a849c-dc7d-488f-8ff2-965b810cdd2b', 
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "stuartadmin" },
        password: { label: "Password", type: "password", placeholder: "Stuart123@" },
      },
      async authorize(credentials) {
        console.log("Credentials received:", credentials);
        if (credentials.username === 'stuartadmin' && credentials.password === 'Stuart123@') {
          return { name: 'Stuart Admin', email: 'stuartadmin@example.com' };
        } else if (credentials.username === 'guest123' && credentials.password === 'Guest123@') {
          return { name: 'Guest User', email: 'guest@example.com' };
        }
        throw new Error('Invalid credentials');
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    jwt: true,
  },
});

export { handler as GET, handler as POST };
