'use client';

import React, { useState, useEffect } from 'react';
import './header.scss';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/app/lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface UserData {
  id: number;
  email: string;
  name: string | null;
  icon: string | null; // ← これが必要！
  role: string;
}

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: sessionData } = await supabase.auth.getUser();
      

      if (sessionData.user) {
        setIsLoggedIn(true);
        setUserId(sessionData.user.id);
        
        // DBから名前取得
        const { data: userData, error } = await supabase
        .from("User")
        .select("*")
        .eq("authId", sessionData.user.id)
        .single();
        console.log("取得したuserData:", userData);

        if (error) {
          console.error('ユーザーデータ取得失敗:', error.message);
        } else {
          console.log("取得したユーザー情報:", userData);
          console.log("取得したユーザー名:", userData?.name);
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
          <Image className='logo' src="/logo.png" width={160} height={80} alt="" />
          <div className="text">Beauty Palette</div>
        </Link>
        <div className="l-header__contents">
          <div className="icon">
            {isLoggedIn && (<Image src={user?.icon ? user.icon : "/icon.png"} alt="icon" width={160}
  height={80} />)}
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
