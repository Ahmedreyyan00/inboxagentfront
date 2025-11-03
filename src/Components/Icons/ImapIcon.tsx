"use client";

import React from "react";

type ImapIconProps = {
  size?: number; // px
  className?: string;
  style?: React.CSSProperties;
  "aria-hidden"?: boolean | "true" | "false";
};

// Modern colorful IMAP/Email Server icon with gradient colors
export function ImapIcon({ size = 24, className, style, "aria-hidden": ariaHidden = true }: ImapIconProps) {
  const s = size;
  return (
    <svg
      aria-hidden={ariaHidden}
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id="imapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <linearGradient id="serverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="emailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
      
      {/* Server/IMAP Base */}
      <rect x="2" y="4" width="20" height="16" rx="3" ry="3" fill="url(#serverGradient)" opacity="0.9"/>
      
      {/* Email Envelope */}
      <rect x="4" y="7" width="16" height="10" rx="1.5" ry="1.5" fill="url(#emailGradient)" opacity="0.95"/>
      <path d="M6 9l6 4 6-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      
      {/* Connection Dots */}
      <circle cx="6" cy="6" r="1" fill="url(#imapGradient)"/>
      <circle cx="10" cy="6" r="1" fill="url(#imapGradient)"/>
      <circle cx="14" cy="6" r="1" fill="url(#imapGradient)"/>
      <circle cx="18" cy="6" r="1" fill="url(#imapGradient)"/>
      
      {/* Connection Lines */}
      <path d="M6 6 L6 4 M10 6 L10 4 M14 6 L14 4 M18 6 L18 4" stroke="url(#imapGradient)" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  );
}

export default ImapIcon;


