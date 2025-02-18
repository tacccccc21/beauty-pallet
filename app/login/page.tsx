'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("ログインできませんでしたああああ");
    } else {
      // 成功時にトップページへ
      router.push('/');
    }
  };

  return (
    <main>
      <div className="inner">
        <div>
          <h1>ログイン</h1>
          <form onSubmit={handleLogin}>
            <div>
              <label>メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='example@testexample.com'
                required
              />
            </div>
            <div>
              <label>パスワード</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='password'
                required
              />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">ログイン</button>
          </form>
        </div>
      </div>
    </main>
  );
}
