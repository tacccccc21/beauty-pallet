'use client';

import React, { useState, useEffect } from 'react';
import './header.scss';
import Link from 'next/link';
import { supabase } from '@/app/lib/supabaseClient';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // ユーザーがログインしているか確認
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setIsLoggedIn(!!data.user);
    };
    checkUser();
  }, []);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <header className='l-header'>
      <div className="inner">
        <Link href="/">
          <img className='logo' src="/logo.png" alt="" />
          <div className="text">Beauty Palette</div>
        </Link>
        <div className="nav-buttons">
          {isLoggedIn ? (
            <button onClick={handleLogout}>ログアウト</button>
          ) : (
            <Link href="/login">ログイン</Link>
          )}
        </div>
        <div
          className={`menu ${menuOpen ? 'is-active' : ''}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </header>
  );
};

export default Header;
