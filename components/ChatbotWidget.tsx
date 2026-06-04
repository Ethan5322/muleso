'use client';

import { useState, useRef } from 'react';
import { MessageCircle, X, ArrowUp, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface BookingData {
  fullName: string;
  phoneNumber: string;
  whatsappNumber: string;
  nationality: string;
  service: string;
}

const SERVICES = [
  { id: '1', label: '💻 Design Website', value: 'Design Website' },
  { id: '2', label: '🔧 Fix Website', value: 'Fix Website' },
  { id: '3', label: '🎨 Design Widget', value: 'Design Widget' },
  { id: '4', label: '🤖 Build AI Chatbot', value: 'Build AI Chatbot' },
  { id: '5', label: '⚙️ Build AI Automation Chatbot', value: 'Build AI Automation Chatbot' },
  { id: '6', label: '🌐 All in One Website', value: 'All in One Website' },
  { id: '7', label: '📝 Other', value: 'Other' },
];

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [stage, setStage] = useState<'greeting' | 'service' | 'name' | 'phone' | 'whatsapp' | 'nationality' | 'details' | 'summary'>('greeting');
  const [bookingData, setBookingData] = useState<BookingData>({
    fullName: '',
    phoneNumber: '',
    whatsappNumber: '',
    nationality: '',
    service: '',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    setTimeout(scrollToBottom, 100);
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      setTimeout(() => {
        addMessage(
          "👋 Hi there! Welcome to MuleSoo Digital Services.\n\nI'm Soo, your AI assistant. I'm here to help you book our services.\n\nWhat can I help you with today?",
          'bot'
        );
        setStage('greeting');
      }, 300);
    }
  };

  const handleServiceSelect = (service: string) => {
    addMessage(service.split(' ').slice(1).join(' '), 'user');
    setBookingData(prev => ({ ...prev, service }));
    addMessage(`Great! You selected: ${service.split(' ').slice(1).join(' ')}\n\nNow, let me collect your information.\n\nWhat's your full name?`, 'bot');
    setStage('name');
  };

  const handleInputSubmit = () => {
    if (!inputValue.trim()) return;

    const userInput = inputValue.trim();
    addMessage(userInput, 'user');
    setInputValue('');

    switch (stage) {
      case 'name':
        setBookingData(prev => ({ ...prev, fullName: userInput }));
        addMessage(`Nice to meet you, ${userInput}! 👋\n\nWhat's your phone number (for calls)?`, 'bot');
        setStage('phone');
        break;

      case 'phone':
        setBookingData(prev => ({ ...prev, phoneNumber: userInput }));
        addMessage(`Perfect! What's your WhatsApp number? (This is how Ethan will contact you)`, 'bot');
        setStage('whatsapp');
        break;

      case 'whatsapp':
        setBookingData(prev => ({ ...prev, whatsappNumber: userInput }));
        addMessage(`Great! What's your nationality/country?`, 'bot');
        setStage('nationality');
        break;

      case 'nationality':
        setBookingData(prev => ({ ...prev, nationality: userInput }));
        addMessage(
          `Perfect! One last thing - please tell me more details about what you need. What's the scope of your project?\n\n(For example: "I need a 5-page website with chatbot integration")`,
          'bot'
        );
        setStage('details');
        break;

      case 'details':
        const completeData = { ...bookingData, service: bookingData.service };
        addMessage('✅ Booking confirmed! Let me generate your booking form...', 'bot');
        setTimeout(() => {
          setStage('summary');
        }, 500);
        break;

      default:
        break;
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 15;

    // Add Logo
    try {
      const logoUrl = '/mulesoo-logo.png';
      doc.addImage(logoUrl, 'PNG', pageWidth / 2 - 15, yPos, 30, 30);
      yPos += 35;
    } catch (error) {
      console.log('Logo could not be added, continuing without it');
      yPos += 10;
    }

    // Header
    doc.setFontSize(18);
    doc.setTextColor(0, 200, 255);
    doc.text('MULESOO', pageWidth / 2, yPos, { align: 'center' });
    doc.setTextColor(123, 47, 255);
    doc.setFontSize(11);
    doc.text('Digital Services | Pretoria, South Africa', pageWidth / 2, yPos + 7, { align: 'center' });

    yPos += 18;

    // Divider Line
    doc.setDrawColor(0, 200, 255);
    doc.line(15, yPos, pageWidth - 15, yPos);
    yPos += 8;

    // Title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text('📋 SERVICE BOOKING CONFIRMATION', pageWidth / 2, yPos, { align: 'center' });

    yPos += 12;

    // Customer Details Section
    doc.setFillColor(0, 200, 255, 15);
    doc.rect(15, yPos - 3, pageWidth - 30, 1, 'F');
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 200, 255);
    doc.text('👤 CUSTOMER INFORMATION', 15, yPos);
    yPos += 7;

    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Full Name: ${bookingData.fullName}`, 15, yPos);
    yPos += 6;
    doc.text(`Phone Number: ${bookingData.phoneNumber}`, 15, yPos);
    yPos += 6;
    doc.text(`WhatsApp: ${bookingData.whatsappNumber}`, 15, yPos);
    yPos += 6;
    doc.text(`Country/Nationality: ${bookingData.nationality}`, 15, yPos);
    yPos += 10;

    // Service Details Section
    doc.setFillColor(123, 47, 255, 15);
    doc.rect(15, yPos - 3, pageWidth - 30, 1, 'F');
    doc.setFont(undefined, 'bold');
    doc.setFontSize(11);
    doc.setTextColor(123, 47, 255);
    doc.text('🎯 SERVICE SELECTED', 15, yPos);
    yPos += 7;

    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(bookingData.service, 15, yPos);
    yPos += 10;

    // Contact Information Section
    doc.setFillColor(232, 184, 75, 15);
    doc.rect(15, yPos - 3, pageWidth - 30, 1, 'F');
    doc.setFont(undefined, 'bold');
    doc.setFontSize(11);
    doc.setTextColor(232, 184, 75);
    doc.text('📞 CONTACT MULESOO', 15, yPos);
    yPos += 7;

    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 200, 255);
    doc.text('📧 Email:', 15, yPos);
    doc.setTextColor(0, 0, 0);
    doc.text('mulukenendashaw68@gmail.com', 50, yPos);
    yPos += 6;

    doc.setTextColor(37, 211, 102);
    doc.text('📱 WhatsApp:', 15, yPos);
    doc.setTextColor(0, 0, 0);
    doc.text('0781500968', 50, yPos);
    yPos += 10;

    // Important Message Box
    doc.setFillColor(0, 200, 255, 5);
    doc.rect(15, yPos, pageWidth - 30, 15, 'F');
    doc.setFont(undefined, 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 200, 255);
    doc.text('⏰ NEXT STEPS', 15, yPos + 4);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text('Ethan will contact you on WhatsApp within 2 hours on business days.', 15, yPos + 9);

    yPos = pageHeight - 20;

    // Footer message
    doc.setTextColor(128, 128, 128);
    doc.setFont(undefined, 'italic');
    doc.setFontSize(8);
    doc.text('Booking Confirmation • Save this document for your records', pageWidth / 2, pageHeight - 8, { align: 'center' });
    doc.text('MuleSoo Digital Services | Pretoria, South Africa', pageWidth / 2, pageHeight - 4, { align: 'center' });

    // Generate filename with date
    const date = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    const filename = `MuleSoo_Booking_${bookingData.fullName.replace(/\s+/g, '_')}_${date}.pdf`;

    doc.save(filename);
  };

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
            onClick={() => handleOpen()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white p-4 rounded-t-2xl">
              <div className="font-bold font-sora flex items-center gap-2">
                Soo <span className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse" />
              </div>
              <p className="text-xs opacity-90">MuleSoo Service Booking</p>
            </div>

            {/* Messages Area */}
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

              {/* Service Selection */}
              {stage === 'greeting' && messages.length > 0 && (
                <div className="space-y-2 mt-4">
                  {SERVICES.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceSelect(service.value)}
                      className="w-full px-3 py-2 text-left text-xs bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)] transition-colors"
                    >
                      {service.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Summary & Download */}
              {stage === 'summary' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-4 space-y-3 mt-4"
                >
                  <h3 className="font-bold text-[var(--text-primary)]">📋 Your Booking Details:</h3>
                  <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                    <p><strong>Name:</strong> {bookingData.fullName}</p>
                    <p><strong>Phone:</strong> {bookingData.phoneNumber}</p>
                    <p><strong>WhatsApp:</strong> {bookingData.whatsappNumber}</p>
                    <p><strong>Country:</strong> {bookingData.nationality}</p>
                    <p><strong>Service:</strong> {bookingData.service}</p>
                  </div>
                  <button
                    onClick={generatePDF}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--accent-gold)] to-[#E8B84B] text-white font-bold rounded-lg hover:scale-105 transition-transform text-sm"
                  >
                    <Download size={16} />
                    Download PDF
                  </button>
                  <p className="text-xs text-[var(--text-secondary)] text-center italic">
                    ✅ Your booking form is ready. Download it and keep a copy!
                  </p>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {(stage === 'name' || stage === 'phone' || stage === 'whatsapp' || stage === 'nationality' || stage === 'details') && (
              <div className="border-t border-[var(--border)] p-4 flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
                  placeholder="Type your response..."
                  autoFocus
                  className="flex-1 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] px-3 py-2 rounded-lg focus:outline-none focus:border-[var(--accent-blue)] text-sm"
                />
                <button
                  onClick={handleInputSubmit}
                  disabled={!inputValue.trim()}
                  className="bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white p-2 rounded-lg hover:scale-110 transition-transform disabled:opacity-50"
                >
                  <ArrowUp size={18} />
                </button>
              </div>
            )}

            {/* Summary Mode - No Input */}
            {stage === 'summary' && (
              <div className="border-t border-[var(--border)] p-4 text-center">
                <p className="text-xs text-[var(--text-secondary)] mb-3">
                  💬 Ethan will contact you on WhatsApp at {bookingData.whatsappNumber} within 2 hours!
                </p>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setMessages([]);
                    setStage('greeting');
                    setBookingData({
                      fullName: '',
                      phoneNumber: '',
                      whatsappNumber: '',
                      nationality: '',
                      service: '',
                    });
                  }}
                  className="w-full px-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--accent-blue)] transition-colors text-sm"
                >
                  Close Chat
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
