import React, { useState, useRef, useEffect } from 'react';
import { SITE_IDENTITY } from '../data/portfolioData.ts';
import { DhakaTimeThemeControl } from './DhakaTimeThemeControl.tsx';

interface SiteHeaderProps {
  onNavigateHome?: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({ 
  onNavigateHome,
  theme,
  onToggleTheme,
}) => {
  const [showCopied, setShowCopied] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleCopyLink = async () => {
    // Navigate home if on another view
    if (onNavigateHome) {
      onNavigateHome();
    }

    const portfolioUrl = 'https://atikurrahman.site';

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(portfolioUrl);
      } else {
        // Robust fallback for mobile browsers & restricted iframe contexts
        const textArea = document.createElement('textarea');
        textArea.value = portfolioUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = portfolioUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch {
        // Fallback completed
      }
    }

    // Show "Copied to clipboard" at top center of portfolio
    setShowCopied(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setShowCopied(false);
    }, 2200);
  };

  return (
    <header className="relative w-full max-w-4xl mx-auto px-6 sm:px-8 pt-8 sm:pt-10 flex items-center justify-between">
      {/* 
        CRITICAL IDENTITY REQUIREMENTS:
        - "atikurrahman.site" at left corner
        - Clean typography without any square background box on hover
        - Touching/clicking copies portfolio URL (https://atikurrahman.site)
        - All lowercase, no spaces, no dots before/after
      */}
      <button
        type="button"
        onClick={handleCopyLink}
        className="text-xs sm:text-[13px] font-mono font-normal tracking-tight text-[var(--text-primary)] hover:opacity-70 transition-opacity duration-200 select-none cursor-pointer focus:outline-none focus-visible:underline p-0 border-0 bg-transparent text-left touch-manipulation"
        aria-label="Copy portfolio link https://atikurrahman.site"
        title="Touch or click to copy link"
      >
        {SITE_IDENTITY}
      </button>

      {/* Centered notification toast at the top center of the portfolio */}
      {showCopied && (
        <div 
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-200 animate-fade-in"
          role="status"
          aria-live="polite"
        >
          <div className="px-3.5 py-1.5 rounded-full bg-[var(--bg-surface-elevated)]/95 border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-mono tracking-tight shadow-xl backdrop-blur-md">
            Copied to clipboard
          </div>
        </div>
      )}

      {/* Top-Right Dhaka Time & Theme Switch locked to master container with enhanced visibility & effect */}
      <DhakaTimeThemeControl
        theme={theme}
        onToggleTheme={onToggleTheme}
      />
    </header>
  );
};
