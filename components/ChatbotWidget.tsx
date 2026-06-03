'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFirstMessage, setShowFirstMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('chatbotMessages');
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show first message after 0.5s when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const timer = setTimeout(() => {
        const firstMsg: Message = {
          id: '0',
          text: "👋 Hi! I'm Soo, MuleSoo's AI assistant.\nI can help you learn about our services, pricing, and timeline.\nWhat can I help you with today? 😊",
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages([firstMsg]);
        setShowFirstMessage(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages.length]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);

    localStorage.setItem('chatbotMessages', JSON.stringify(updatedMessages));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      });

      const data = await response.json();
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, botMsg];
      setMessages(finalMessages);
      localStorage.setItem('chatbotMessages', JSON.stringify(finalMessages));
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickReplies = [
    '💻 Website Design',
    '🤖 Chatbot',
    '💰 Pricing',
    '📞 Book a Call',
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white shadow-lg z-40 flex items-center justify-center hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        animate={{
          rotate: isOpen ? 45 : 0,
        }}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 border-4 border-[var(--accent-blue)] rounded-full"
            animate={{
              scale: [1, 1.3],
              opacity: [1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[500px] rounded-2xl shadow-2xl bg-[var(--bg-secondary)] border border-[var(--border)] flex flex-col z-40 md:w-96"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div>
                <div className="font-bold font-sora flex items-center gap-2">
                  Soo <span className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse" />
                </div>
                <p className="text-xs opacity-90">MuleSoo AI Assistant — typically replies instantly</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white rounded-br-none'
                        : 'bg-[var(--bg-card)] text-[var(--text-secondary)] rounded-bl-none border border-[var(--border)]'
                    }`}
                  >
                    {msg.text.split('\n').map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex gap-2 items-center">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent-blue)] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[var(--accent-blue)] animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="w-2 h-2 rounded-full bg-[var(--accent-blue)] animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {showFirstMessage && messages.length === 1 && (
              <div className="px-4 py-2 flex flex-wrap gap-2">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleSend(reply)}
                    className="px-3 py-1 text-xs rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)] transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="border-t border-[var(--border)] p-4 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend(inputValue)}
                placeholder="Type your message..."
                className="flex-1 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] px-3 py-2 rounded-lg focus:outline-none focus:border-[var(--accent-blue)] text-sm"
              />
              <button
                onClick={() => handleSend(inputValue)}
                disabled={isLoading || !inputValue.trim()}
                className="bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white p-2 rounded-lg hover:scale-110 transition-transform disabled:opacity-50"
              >
                <ArrowUp size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
