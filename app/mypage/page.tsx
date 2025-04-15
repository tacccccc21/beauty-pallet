'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';

interface UserData {
  id: number;
  email: string;
  name: string | null;
  icon: string | null;
  role: string;
}

export default function MyPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      const { data: sessionData, error: sessionError } = await supabase.auth.getUser();
      if (sessionError || !sessionData.user) {
        setError('ログイン情報が取得できませんでした');
        setLoading(false);
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from('User')
        .select('id, email, name, icon, role')
        .eq('email', sessionData.user.email)
        .single();

      if (userError) {
        setError('ユーザーデータが取得できませんでした: ' + userError.message);
      } else {
        setUser(userData);
        setNewName(userData.name || '');
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleNameChange = async () => {
    if (!user) return;


    const { data: sessionData } = await supabase.auth.getUser();
    const sessionUserId = sessionData.user?.id;

    const { error } = await supabase
      .from('User')
      .update({ name: newName })
      .eq("authId", sessionUserId);

    if (error) {
      alert('名前変更に失敗しました: ' + error.message);
    } else {
      alert('名前を更新しました');
      setUser({ ...user, name: newName });
    }
  };

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const file = e.target.files?.[0];
    if (!file) return;
  
    const fileName = `${user.id}_${Date.now()}`;
  
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true, // 同名なら上書き
      });
  
    console.log('upload result:', data, error);
  
    if (error) {
      console.error('アップロードエラー:', error);
      alert('アップロードに失敗しました: ' + error.message);
      return;
    }
  
    const iconUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${fileName}`;
  
    const { error: updateError } = await supabase
      .from('User')
      .update({ icon: iconUrl })
      .eq('id', user.id);
  
    if (updateError) {
      alert('アイコンURL保存に失敗しました: ' + updateError.message);
    } else {
      alert('アイコンを更新しました');
      setUser({ ...user, icon: iconUrl });
    }
  };
  

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <main>
      <div className="inner">
        <h1>マイページ</h1>
        <p>メールアドレス: {user?.email}</p>
        <p>名前: {user?.name || '未設定'}</p>
        <div>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button onClick={handleNameChange}>名前を変更</button>
        </div>
        <div>
          <p>アイコン:</p>
          {user?.icon && <img src={user.icon} alt="アイコン" width={80} height={80} />}
          <input type="file" accept="image/*" onChange={handleIconUpload} />
        </div>
      </div>
    </main>
  );
}
