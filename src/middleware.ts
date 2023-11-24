import NextAuth from 'next-auth';
import { auth } from './auth';

export default auth;

export const config = {
  // https://zenn.dev/sakazuki_xyz/articles/2cabad91bb8acb
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  // matcher: ["/((?!api|_next/static|_next/image|.png).*)"],
  matcher: ['/auth/:path*', '/api/auth/:path*'],
};
