'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(`Supabase Authエラー: ${error.message}`);
      return;
    }

    if (data.user) {
      try {
        const res = await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            name,
          }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          setError(`APIエラー: ${errorText}`);
          return;
        }

        setMessage('確認メールを送信しました！');
        router.push('/');
      } catch (err: any) {
        setError(`通信エラー: ${err.message}`);
      }
    }
  };

  return (
    <main>
      <div className="inner">
        <h1>サインアップ</h1>
        <form onSubmit={handleSignUp}>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="パスワード（6文字以上）"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="名前"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {message && <p style={{ color: 'green' }}>{message}</p>}
          <button type="submit">登録</button>
        </form>
      </div>
    </main>
  );
}
