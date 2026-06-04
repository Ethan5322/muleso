'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ContactForm {
  name: string;
  phone: string;
  email: string;
  service: string;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFirstMessage, setShowFirstMessage] = useState(false);
  const [collectingInfo, setCollectingInfo] = useState(false);
  const [contactForm, setContactForm] = useState<ContactForm>({ name: '', phone: '', email: '', service: '' });
  const [infoStep, setInfoStep] = useState<'name' | 'phone' | 'email' | 'service' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('chatbotMessages');
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const timer = setTimeout(() => {
        const firstMsg: Message = {
          id: '0',
          text: "👋 Hi! I'm Soo, your MuleSoo AI assistant. I can help you learn about our websites, chatbots, logos, and digital solutions. What brings you here today? 😊",
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages([firstMsg]);
        setShowFirstMessage(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages.length]);

  const handleCollectInfo = async (value: string) => {
    if (!value.trim()) return;

    if (!infoStep) {
      setCollectingInfo(true);
      setInfoStep('name');
      const msg: Message = {
        id: Date.now().toString(),
        text: "Great! To help you better, could you please share your full name?",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, msg]);
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      text: value,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    switch (infoStep) {
      case 'name':
        setContactForm(prev => ({ ...prev, name: value }));
        setInfoStep('phone');
        const phoneMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: `Nice to meet you, ${value}! 👋 What's your phone number so Ethan can reach you on WhatsApp?`,
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, phoneMsg]);
        break;
      case 'phone':
        setContactForm(prev => ({ ...prev, phone: value }));
        setInfoStep('email');
        const emailMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: "Perfect! Now, what's your email address?",
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, emailMsg]);
        break;
      case 'email':
        setContactForm(prev => ({ ...prev, email: value }));
        setInfoStep('service');
        const serviceMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: "Great! What service are you most interested in? (Website Design, Chatbot, Logo, QR Code, Email Setup, PDF Guide, or Other)",
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, serviceMsg]);
        break;
      case 'service':
        setContactForm(prev => ({ ...prev, service: value }));
        await submitLead({ ...contactForm, service: value });
        break;
    }
  };

  const submitLead = async (form: ContactForm) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/contact-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          service: form.service,
        }),
      });

      if (response.ok) {
        const successMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: `Perfect! ✅ I've got your details:\n\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nService: ${form.service}\n\nEthan will contact you on WhatsApp at ${form.phone} shortly. Thanks for reaching out! 🚀`,
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, successMsg]);
        setCollectingInfo(false);
        setInfoStep(null);
        setContactForm({ name: '', phone: '', email: '', service: '' });
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    if (collectingInfo && infoStep) {
      handleCollectInfo(text);
      return;
    }

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
      console.log('🚀 Sending message to /api/chat:', text);

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

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ API response:', data);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, botMsg];
      setMessages(finalMessages);
      localStorage.setItem('chatbotMessages', JSON.stringify(finalMessages));

      if (text.toLowerCase().includes('contact') || text.toLowerCase().includes('book') || text.toLowerCase().includes('interested')) {
        setTimeout(() => {
          handleCollectInfo('');
        }, 500);
      }
    } catch (error) {
      console.error('❌ Chat error:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: `Error: ${error instanceof Error ? error.message : 'Connection failed'}`,
        sender: 'bot',
        timestamp: new Date(),
      };
      const errorMessages = [...updatedMessages, errorMsg];
      setMessages(errorMessages);
      localStorage.setItem('chatbotMessages', JSON.stringify(errorMessages));
    } finally {
      setIsLoading(false);
    }
  };

  const quickReplies = [
    '💻 Website Design',
    '🤖 Chatbot',
    '💰 Pricing',
    '📞 Get in Touch',
  ];

  return (
    <>
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[500px] rounded-2xl shadow-2xl bg-[var(--bg-secondary)] border border-[var(--border)] flex flex-col z-40"
          >
            <div className="bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white p-4 rounded-t-2xl">
              <div className="font-bold font-sora flex items-center gap-2">
                Soo <span className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse" />
              </div>
              <p className="text-xs opacity-90">MuleSoo AI Assistant</p>
            </div>

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

            <div className="border-t border-[var(--border)] p-4 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
                placeholder={collectingInfo ? "Type your response..." : "Type your message..."}
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
