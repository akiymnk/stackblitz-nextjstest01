import type { Metadata } from 'next';
import { Session } from 'next-auth';
import { SessionProvider, getSession, useSession } from 'next-auth/react';
import { auth } from '@/auth';

export const metadata: Metadata = {
  title: '認証されました。',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // const [session, setSession] = useState<Session | null>(null);
  // useEffect( () => {
  //   const f = async () => {
  //     const s = await getSession();
  //     setSession(s);
  //   }
  //   f();
  // }, []);
  return (
    <div>
      <div>認証されてます。 email = {session?.user?.email}</div>
      {children}
    </div>
  );
}
