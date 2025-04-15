'use client';

import React, { useState, useEffect } from 'react';
import './header.scss';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/app/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/context/UserContext';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, setUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: sessionData } = await supabase.auth.getUser();

      if (sessionData.user) {
        const { data: userData, error } = await supabase
          .from("User")
          .select("*")
          .eq("authId", sessionData.user.id)
          .single();

        if (!error && userData) {
          setUser(userData);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();
  }, [setUser]);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMenuOpen(false);
    router.push('/');
  };

  return (
    <header className='l-header'>
      <div className="inner">
        <Link href="/">
          <Image className="logo" src="/logo.png" width={160} height={80} alt="ロゴ" />
          <div className="text">Beauty Palette</div>
        </Link>
        <div className="l-header__contents">
          <div className="icon">
            {user && (
              <Image
                src={user.icon ? user.icon : "/icon.png"}
                alt="icon"
                width={40}
                height={40}
              />
            )}
          </div>
          <div className="nav-buttons">
            {user ? (
              <div>{user.name}</div>
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
            {user ? (
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
