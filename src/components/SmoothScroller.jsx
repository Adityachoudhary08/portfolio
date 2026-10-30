
'use client';
import React from 'react'
import useLenis from '@/hooks/useLenis';

const SmoothScroller = ({ children }) => {
    useLenis();
  return (
    <div>{children}</div>
  )
}

export default SmoothScroller