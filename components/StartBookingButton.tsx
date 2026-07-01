'use client';

import { useChatbot } from '@/context/ChatbotContext';

interface StartBookingButtonProps {
  text?: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
}

export default function StartBookingButton({
  text = '🚀 Start Booking Now',
  variant = 'primary',
  size = 'md',
}: StartBookingButtonProps) {
  const { openChatbot } = useChatbot();

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-10 py-4 text-lg',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white hover:shadow-[0_0_20px_var(--glow-blue)]',
    secondary: 'border-2 border-[var(--accent-blue)] text-[var(--accent-blue)] hover:bg-[var(--glow-blue)]',
    tertiary: 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)]',
  };

  return (
    <button
      onClick={() => openChatbot()}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        font-bold font-sora rounded-lg
        hover:scale-105 transition-all duration-200
        inline-block w-full text-center
      `}
    >
      {text}
    </button>
  );
}
