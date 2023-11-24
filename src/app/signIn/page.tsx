'use client';

import { useState } from 'react';
import { authenticate } from './actions';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const nav = useRouter();

  const onSubmit = async () => {
    const result = await authenticate(email, password);
    if (result === false) {
      console.error('ログイン失敗');
    } else {
      console.log('login: ', result);
      //nav.push(result);
    }
  };

  return (
    <div>
      <form action={onSubmit}>
        <div>
          <label>
            メールアドレス:
            <input
              className="text-gray-900"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            パスワード:
            <input
              className="text-gray-900"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            ログイン
          </button>
        </div>
      </form>
    </div>
  );
}
