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
    primary: 'bg-[var(--color-action-primary)] hover:bg-[var(--color-action-hover)] text-[var(--color-action-ink)] hover:shadow-[0_5px_20px_var(--glow-action)]',
    secondary: 'border-2 border-[var(--color-action-on-dark)] text-[var(--color-action-on-dark)] hover:bg-[var(--glow-action)]',
    tertiary: 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--color-action-on-dark)] hover:text-[var(--color-action-on-dark)]',
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
