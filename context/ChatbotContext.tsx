'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface PresetBooking {
  service: string; // service value, e.g. 'Build AI Automation'
  details: string; // pre-filled project details, e.g. the system name + description
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

  const openChatbot = (preset?: PresetBooking) => {
    if (preset) setPresetBooking(preset);
    setIsOpen(true);
  };
  const closeChatbot = () => setIsOpen(false);

  const consumePreset = () => {
    const p = presetBooking;
    setPresetBooking(null);
    return p;
  };

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
