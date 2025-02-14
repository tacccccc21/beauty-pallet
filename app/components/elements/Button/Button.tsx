'use client';

import React, { useState } from 'react';
import './button.scss';

const Button = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount((count) => count + 1);
  };

  return (
    <>
      <button onClick={handleClick}>Button</button>
      <div className="count">{count}</div>
    </>
  );
};

export default Button;
