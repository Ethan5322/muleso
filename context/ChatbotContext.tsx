'use client';

import { createContext, useCallback, useContext, useState, ReactNode } from 'react';

export interface PresetBooking {
  service: string; // the chosen system name — becomes the booking's service (shows on dashboard)
  details: string; // pre-filled project details, e.g. buy/custom + system name + description
  price?: string;  // price to show in the opening message, e.g. 'R5,000'
}

interface ChatbotContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openChatbot: (preset?: PresetBooking) => void;
  closeChatbot: () => void;
  presetBooking: PresetBooking | null;
  consumePreset: () => PresetBooking | null;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [presetBooking, setPresetBooking] = useState<PresetBooking | null>(null);

  // Stable identities so consumers' effects don't re-run on every render
  // (a re-created openChatbot was causing the widget to re-open right after close).
  const openChatbot = useCallback((preset?: PresetBooking) => {
    if (preset) setPresetBooking(preset);
    setIsOpen(true);
  }, []);

  const closeChatbot = useCallback(() => setIsOpen(false), []);

  const consumePreset = useCallback(() => {
    setPresetBooking(null);
    return presetBooking;
  }, [presetBooking]);

  return (
    <ChatbotContext.Provider
      value={{ isOpen, setIsOpen, openChatbot, closeChatbot, presetBooking, consumePreset }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within ChatbotProvider');
  }
  return context;
}
