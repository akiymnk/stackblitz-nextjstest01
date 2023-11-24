'use server';

//import { signIn } from '@/auth';
//import { authConfig, signIn } from '../../auth.config';
//import NextAuth from 'next-auth';
import { signIn } from '@/auth';

export async function authenticate(userId: string, password: string) {
  try {
    await signIn('credentials', {
      email: userId,
      password: password,
      redirect: false,
      //redirectTo: "/auth/dashboard",
    });

    return true;
  } catch (error) {
    console.log('login error ', error);
    // if ((error as Error).message.includes('CredentialsSignin')) {
    //   return false;
    // }
    // throw error;
    return false;
  }
}
