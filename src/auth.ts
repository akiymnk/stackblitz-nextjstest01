import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import AzureADProvider from 'next-auth/providers/azure-ad';
import GitHub from 'next-auth/providers/github';

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  pages: {
    signIn: '/signIn',
    signOut: '/signOut',
  },
  callbacks: {
    redirect({ url, baseUrl }) {
      console.log('redirect ', url, baseUrl);
      return '';
    },
    // session: async ({ session, token }) => {
    //   if (session?.user) {
    //     session.user.email = token.email;
    //   }
    //   return session;
    // },
    // jwt: async ({ user, token }) => {
    //   if (user) {
    //     token.uid = user.id;
    //   }
    //   return token;
    // },
    authorized({ auth, request }) {
      console.log('callback-authorized. ', auth, request.nextUrl.pathname);
      const isLoggedIn = !!auth?.user;
      const isAuthRequired = request.nextUrl.pathname.startsWith('/auth');
      console.log('isLoggedIn : ', isLoggedIn);
      if (isAuthRequired) {
        if (isLoggedIn) {
          return true;
        }

        // Redirect unauthenticated users to login page
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/auth', request.nextUrl));
      }
      return true;
    },
  },
  //   session: {
  //     strategy: "jwt",
  //   },
  providers: [
    Credentials({
      // ここのKeyは下のauthorize()のcredentialsに型が追加されるので追加してる
      credentials: {
        email: { type: 'text' },
        password: { type: 'password' },
      },
      async authorize(credentials, req) {
        console.debug('auth: ', credentials);
        // 入力した情報
        const email = credentials?.email;
        const password = credentials?.password;

        await new Promise((resolve) => setTimeout(resolve, 1000));
        const user = { id: '1', name: 'J Smith', email: 'jsmith@example.com' };
        return user;

        // const email = 'user@sample.com';
        // return credentials.email === email && credentials.password === '123456'
        //   ? { id: 'userId', email }
        //   : null;
        // これでログイン拒否
        return null;
      },
    }),
  ],
  //   useSecureCookies: true,
  //   cookies: {
  //     sessionToken: {
  //       name: `__Host-next-auth.session-token`,
  //       options: {
  //         httpOnly: true,
  //         sameSite: "lax",
  //         path: "/",
  //         secure: true,
  //       },
  //     },
  //     callbackUrl: {
  //       name: `__Host-next-auth.callback-url`,
  //       options: {
  //         sameSite: "lax",
  //         path: "/",
  //         secure: true,
  //       },
  //     },
  //     csrfToken: {
  //       name: `__Host-next-auth.csrf-token`,
  //       options: {
  //         httpOnly: true,
  //         sameSite: "lax",
  //         path: "/",
  //         secure: true,
  //       },
  //     },
  //     pkceCodeVerifier: {
  //       name: `__Host-next-auth.pkce.code_verifier`,
  //       options: {
  //         httpOnly: true,
  //         sameSite: "lax",
  //         path: "/",
  //         secure: true,
  //         maxAge: 900,
  //       },
  //     },
  //     state: {
  //       name: `__Host-next-auth.state`,
  //       options: {
  //         httpOnly: true,
  //         sameSite: "lax",
  //         path: "/",
  //         secure: true,
  //         maxAge: 900,
  //       },
  //     },
  //     nonce: {
  //       name: `__Host-next-auth.nonce`,
  //       options: {
  //         httpOnly: true,
  //         sameSite: "lax",
  //         path: "/",
  //         secure: true,
  //       },
  //     },
  //   },
});
