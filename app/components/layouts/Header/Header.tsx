'use client';

import React, { useState } from 'react';
import './header.scss';
import Link from 'next/link';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className='l-header'>
      <div className="inner">
        <Link href="/">
        <img className='logo' src="/logo.png" alt="" />
        Beauty Palette
        </Link>
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
