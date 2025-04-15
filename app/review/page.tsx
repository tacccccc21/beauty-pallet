'use client';

import { useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { useUser } from '@/app/context/UserContext';
import { useRouter } from 'next/navigation';

export default function ReviewPage() {
  const { user } = useUser();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError('ログインが必要です');
      return;
    }

    let imageUrl = null;

    if (imageFile) {
      setUploading(true);
      const fileName = `${user.id}_${Date.now()}`;

      const { data, error: uploadError } = await supabase.storage
      .from('review-images')
      .upload(`${user.id}_${Date.now()}`, imageFile!, {
        cacheControl: '3600',
        upsert: true,
      });
      if (uploadError) {
        setError('画像のアップロードに失敗しました: ' + uploadError.message);
        setUploading(false);
        return;
      }

      imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/review-images/${fileName}`;
      setUploading(false);
    }

    const { error: insertError } = await supabase
      .from('Review')
      .insert([
        {
          title,
          content,
          imageUrl,
          userId: user.id,
        },
      ]);

    if (insertError) {
      setError('投稿に失敗しました: ' + insertError.message);
    } else {
      router.push('/review'); // 投稿後に一覧などへ
    }
  };

  return (
    <main className="inner">
      <h1>レビュー投稿</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>タイトル</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>内容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label>画像をアップロード（任意）</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
        </div>
        {uploading && <p>画像アップロード中...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">投稿する</button>
      </form>
    </main>
  );
}
