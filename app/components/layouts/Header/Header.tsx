'use client';

import React, { useState, useEffect } from 'react';
import './header.scss';
import Link from 'next/link';
import { supabase } from '@/app/lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface UserData {
  name: string | null;
}

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: sessionData } = await supabase.auth.getUser();

      if (sessionData.user) {
        setIsLoggedIn(true);

        // DBから名前取得
        const { data: userData, error } = await supabase
          .from('User') // Supabase側のテーブル名（Prismaで作ったやつ）
          .select('name')
          .eq('email', sessionData.user.email)
          .single();

        if (error) {
          console.error('ユーザーデータ取得失敗:', error.message);
        }

        if (userData) {
          setUser(userData);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkUser();
  }, []);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUser(null);
    router.push('/');
  };

  return (
    <header className='l-header'>
      <div className="inner">
        <Link href="/">
          <img className='logo' src="/logo.png" alt="" />
          <div className="text">Beauty Palette</div>
        </Link>
        <div className="l-header__contents">
          <div className="icon">
            {isLoggedIn && <img src="/icon.png" alt="icon" />}
          </div>
          <div className="nav-buttons">
            {isLoggedIn ? (
              <div>{ user?.name }</div>
            ) : (
              <Link href="/login">login</Link>
            )}
          </div>
          <div
            className={`ham-btn ${menuOpen ? 'is-active' : ''}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
      <div className={`menu ${menuOpen ? 'is-active' : ''}`}>
        <ul>
        <li>
            <Link href="/about" onClick={() => setMenuOpen(false)}>about</Link>
        </li>
        <li>
          <Link href="/signup" onClick={() => setMenuOpen(false)}>新規登録</Link>
        </li>
        <li>
          {isLoggedIn ? (
            <button onClick={handleLogout}>ログアウト</button>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)}>ログイン</Link>
          )}
        </li>
        <li>
          <Link href="/mypage" onClick={() => setMenuOpen(false)}>マイページ</Link>
        </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
