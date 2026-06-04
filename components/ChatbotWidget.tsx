'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, ArrowUp, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useChatbot } from '@/context/ChatbotContext';
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
  nationality: string;
  service: string;
  usageType: string;
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
  const pathname = usePathname();
  const { isOpen, setIsOpen, openChatbot } = useChatbot();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [stage, setStage] = useState<'greeting' | 'service' | 'usage_type' | 'name' | 'phone' | 'nationality' | 'details' | 'summary'>('greeting');
  const [bookingData, setBookingData] = useState<BookingData>({
    fullName: '',
    phoneNumber: '',
    nationality: '',
    service: '',
    usageType: '',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-open chatbot on contact page
  useEffect(() => {
    if (pathname === '/contact') {
      openChatbot();
    }
  }, [pathname, openChatbot]);

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
      // Show greeting immediately
      addMessage(
        "👋 Hi! I'm Soo from MuleSoo. Let's get your project started!",
        'bot'
      );
      // Set stage immediately so buttons show
      setTimeout(() => {
        setStage('greeting');
      }, 50);
    }
  };

  const handleServiceSelect = (service: string) => {
    const cleanService = service.split(' ').slice(1).join(' ');
    addMessage(cleanService, 'user');
    setBookingData(prev => ({ ...prev, service }));

    setTimeout(() => {
      addMessage(`Great choice! 💪\n\nIs this for your personal project or a company?`, 'bot');
      setStage('usage_type');
    }, 300);
  };

  const handleUsageTypeSelect = (usageType: string) => {
    addMessage(usageType, 'user');
    setBookingData(prev => ({ ...prev, usageType }));

    setTimeout(() => {
      addMessage(`Perfect! 👍\n\nNow, what's your full name?`, 'bot');
      setStage('name');
    }, 300);
  };

  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-numeric characters
    const cleanPhone = phone.replace(/\D/g, '');

    // Add +27 country code if not present
    if (cleanPhone.startsWith('27')) {
      return '+27' + cleanPhone.slice(2);
    } else if (cleanPhone.startsWith('0')) {
      return '+27' + cleanPhone.slice(1);
    } else {
      return '+27' + cleanPhone;
    }
  };

  const handleInputSubmit = () => {
    if (!inputValue.trim()) return;

    const userInput = inputValue.trim();
    addMessage(userInput, 'user');
    setInputValue('');

    switch (stage) {
      case 'name':
        setBookingData(prev => ({ ...prev, fullName: userInput }));
        addMessage(`Great! Nice to meet you, ${userInput}! 👋`, 'user');
        setTimeout(() => {
          addMessage(`What's your phone number?\n\n(for WhatsApp & calls)`, 'bot');
          setStage('phone');
        }, 300);
        break;

      case 'phone':
        const formattedPhone = formatPhoneNumber(userInput);
        setBookingData(prev => ({ ...prev, phoneNumber: formattedPhone }));
        addMessage(formattedPhone, 'user');
        setTimeout(() => {
          addMessage(`Got it! ✓\n\nWhat's your country?`, 'bot');
          setStage('nationality');
        }, 300);
        break;

      case 'nationality':
        setBookingData(prev => ({ ...prev, nationality: userInput }));
        addMessage(userInput, 'user');
        setTimeout(() => {
          addMessage(`Awesome! Last question:\n\nBriefly describe your project. What do you need?`, 'bot');
          setStage('details');
        }, 300);
        break;

      case 'details':
        addMessage(userInput, 'user');
        setTimeout(() => {
          addMessage('✅ Perfect! Your booking is ready!', 'bot');
          setTimeout(() => {
            setStage('summary');
          }, 300);
        }, 300);
        break;

      default:
        break;
    }
  };

  const submitBooking = async () => {
    try {
      const response = await fetch('/api/chatbot-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: bookingData.fullName,
          phoneNumber: bookingData.phoneNumber,
          nationality: bookingData.nationality,
          service: bookingData.service,
          usageType: bookingData.usageType,
        }),
      });

      if (!response.ok) {
        console.error('Booking submission failed');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
    }
  };

  const generatePDF = () => {
    // Submit booking data to API
    submitBooking();
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    let yPos = margin;

    // Professional header with gradient-like effect using colors
    doc.setFillColor(5, 8, 16);
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Logo area
    try {
      const logoUrl = '/mulesoo-logo.png';
      doc.addImage(logoUrl, 'PNG', margin, 8, 20, 20);
    } catch (error) {
      console.log('Logo not available');
    }

    // Company branding
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 200, 255);
    doc.text('MULESOO', margin + 25, 18);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(160, 178, 208);
    doc.text('Digital Services', margin + 25, 26);
    doc.text('Pretoria, South Africa', margin + 25, 31);

    // Document title on the right
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(200, 200, 200);
    doc.text('SERVICE REQUEST FORM', pageWidth - margin - 50, 18, { align: 'left' });

    // Date on right
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    const currentDate = new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.text(`Date: ${currentDate}`, pageWidth - margin - 50, 26, { align: 'left' });

    yPos = 50;

    // Decorative line
    doc.setDrawColor(0, 200, 255);
    doc.setLineWidth(0.8);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;

    // Section: CLIENT INFORMATION
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 200, 255);
    doc.text('CLIENT INFORMATION', margin, yPos);
    yPos += 8;

    // Information box with subtle background
    doc.setFillColor(13, 21, 40);
    doc.rect(margin, yPos - 4, contentWidth, 45, 'F');
    doc.setDrawColor(0, 200, 255);
    doc.setLineWidth(0.5);
    doc.rect(margin, yPos - 4, contentWidth, 45);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(240, 242, 250);
    doc.text('Full Name:', margin + 4, yPos + 2);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(168, 178, 208);
    doc.text(bookingData.fullName, margin + 35, yPos + 2);

    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(240, 242, 250);
    doc.text('Phone & WhatsApp:', margin + 4, yPos + 2);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(168, 178, 208);
    doc.text(bookingData.phoneNumber, margin + 35, yPos + 2);

    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(240, 242, 250);
    doc.text('Country/Nationality:', margin + 4, yPos + 2);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(168, 178, 208);
    doc.text(bookingData.nationality, margin + 35, yPos + 2);

    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(240, 242, 250);
    doc.text('Usage Type:', margin + 4, yPos + 2);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(168, 178, 208);
    doc.text(bookingData.usageType, margin + 35, yPos + 2);

    yPos += 14;

    // Decorative line
    doc.setDrawColor(0, 200, 255);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;

    // Section: SERVICE DETAILS
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(123, 47, 255);
    doc.text('SERVICE REQUESTED', margin, yPos);
    yPos += 8;

    // Service box
    doc.setFillColor(13, 21, 40);
    doc.rect(margin, yPos - 4, contentWidth, 20, 'F');
    doc.setDrawColor(123, 47, 255);
    doc.setLineWidth(0.5);
    doc.rect(margin, yPos - 4, contentWidth, 20);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 255, 136);
    doc.text(bookingData.service, margin + 4, yPos + 5);

    yPos += 24;

    // Decorative line
    doc.setDrawColor(232, 184, 75);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    // Section: CONTACT DETAILS
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(232, 184, 75);
    doc.text('HOW WE\'LL GET IN TOUCH', margin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(168, 178, 208);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 200, 255);
    doc.text('📧 Email:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(240, 242, 250);
    doc.text('mulukenendashaw68@gmail.com', margin + 25, yPos);
    yPos += 7;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 255, 136);
    doc.text('📱 WhatsApp:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(240, 242, 250);
    doc.text('0781500968', margin + 25, yPos);
    yPos += 12;

    // Important notice box
    doc.setFillColor(0, 200, 255);
    doc.setFillColor(13, 21, 40);
    doc.rect(margin, yPos, contentWidth, 22, 'F');
    doc.setDrawColor(0, 200, 255);
    doc.setLineWidth(0.8);
    doc.rect(margin, yPos, contentWidth, 22);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 200, 255);
    doc.text('⏰ WHAT HAPPENS NEXT', margin + 3, yPos + 4);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(240, 242, 250);
    const nextStepsText = 'Ethan will contact you within 2 hours on business days via WhatsApp to discuss your project in detail.';
    doc.text(nextStepsText, margin + 3, yPos + 10, { maxWidth: contentWidth - 6 });

    // Footer
    yPos = pageHeight - 15;
    doc.setDrawColor(26, 38, 64);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    yPos += 4;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(128, 128, 128);
    doc.text('This is your confirmation form. Please keep it safe for your records.', pageWidth / 2, yPos, { align: 'center' });
    doc.text('© 2025 MuleSoo Digital Services • Pretoria, South Africa', pageWidth / 2, yPos + 4, { align: 'center' });

    // Generate filename with date
    const date = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    const filename = `MuleSoo_ServiceRequest_${bookingData.fullName.replace(/\s+/g, '_')}_${date}.pdf`;

    doc.save(filename);
  };

  return (
    <>
      {/* Chat Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-[var(--accent-blue)] via-[var(--accent-purple)] to-[var(--accent-blue)] text-white shadow-2xl z-40 flex items-center justify-center hover:shadow-3xl transition-shadow sm:w-16 sm:h-16"
        whileHover={{ scale: 1.12, boxShadow: '0 0 30px rgba(0, 200, 255, 0.6)' }}
        whileTap={{ scale: 0.95 }}
        animate={{
          rotate: isOpen ? 45 : 0,
        }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 border-2 border-[var(--accent-blue)] rounded-full"
            animate={{
              scale: [1, 1.2],
              opacity: [0.8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ duration: 0.25, type: 'spring', bounce: 0.3 }}
            className="fixed bottom-20 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[480px] md:w-[500px] max-w-[500px] h-[600px] sm:h-[700px] max-h-[calc(100vh-120px)] rounded-2xl sm:rounded-3xl shadow-2xl bg-[var(--bg-secondary)] border border-[var(--border)] flex flex-col z-40 overflow-hidden"
          >
            {/* Header - Enhanced */}
            <div className="bg-gradient-to-r from-[var(--accent-blue)] via-[var(--accent-purple)] to-[var(--accent-blue)] text-white p-6 rounded-t-3xl flex-shrink-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl">🤖</div>
                <div>
                  <div className="font-bold font-sora text-lg">Soo</div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-green)] animate-pulse" />
                    <span className="text-xs opacity-90">Online</span>
                  </div>
                </div>
              </div>
              <p className="text-sm opacity-95 font-medium">MuleSoo AI Assistant • Quick Response</p>
            </div>

            {/* Messages Area - Larger */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0 scrollbar-thin scrollbar-thumb-[var(--accent-blue)] scrollbar-track-[var(--bg-card)]">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white rounded-br-sm shadow-lg'
                        : 'bg-[var(--bg-card)] text-[var(--text-secondary)] rounded-bl-sm border border-[var(--border)] hover:border-[var(--accent-blue)] transition-colors'
                    }`}
                  >
                    {msg.text.split('\n').map((line, i) => (
                      <div key={i} className={msg.sender === 'user' ? 'text-white' : ''}>
                        {line || ' '}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Service Selection */}
              {stage === 'greeting' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="space-y-2 mt-4 px-2"
                >
                  <p className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wide mb-3">Pick a service:</p>
                  {SERVICES.map((service, idx) => (
                    <motion.button
                      key={service.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * idx }}
                      whileHover={{ scale: 1.02, x: 8 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleServiceSelect(service.value)}
                      className="w-full px-4 py-3 text-left text-sm font-semibold bg-gradient-to-r from-[var(--bg-card)] to-[var(--glow-blue)] border-2 border-[var(--border)] text-[var(--text-primary)] rounded-xl hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)] hover:from-[var(--glow-blue)] hover:to-[var(--glow-purple)] transition-all duration-200 cursor-pointer"
                    >
                      {service.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Usage Type Selection */}
              {stage === 'usage_type' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="space-y-3 mt-4 px-2"
                >
                  <p className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wide mb-3">Choose one:</p>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                    whileHover={{ scale: 1.02, x: 8 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleUsageTypeSelect('Personal')}
                    className="w-full px-4 py-4 text-left font-semibold bg-gradient-to-r from-[var(--bg-card)] to-[var(--glow-blue)] border-2 border-[var(--border)] text-[var(--text-primary)] rounded-xl hover:border-[var(--accent-blue)] hover:from-[var(--glow-blue)] hover:to-[var(--glow-purple)] transition-all duration-200 cursor-pointer"
                  >
                    👤 Personal
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    whileHover={{ scale: 1.02, x: 8 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleUsageTypeSelect('Company')}
                    className="w-full px-4 py-4 text-left font-semibold bg-gradient-to-r from-[var(--bg-card)] to-[var(--glow-purple)] border-2 border-[var(--border)] text-[var(--text-primary)] rounded-xl hover:border-[var(--accent-purple)] hover:from-[var(--glow-purple)] hover:to-[var(--glow-blue)] transition-all duration-200 cursor-pointer"
                  >
                    🏢 Company
                  </motion.button>
                </motion.div>
              )}

              {/* Summary & Download */}
              {stage === 'summary' && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="glass-card p-6 space-y-5 mt-3 mx-2"
                >
                  <h3 className="font-bold text-lg text-[var(--text-primary)]">📋 Booking Confirmation</h3>
                  <div className="space-y-3 text-sm">
                    <div className="bg-[var(--bg-primary)] p-3 rounded-lg">
                      <p className="text-xs text-[var(--text-secondary)] mb-1">Name</p>
                      <p className="text-[var(--text-primary)] font-semibold">{bookingData.fullName}</p>
                    </div>
                    <div className="bg-[var(--bg-primary)] p-3 rounded-lg">
                      <p className="text-xs text-[var(--text-secondary)] mb-1">Contact</p>
                      <p className="text-[var(--text-primary)] font-semibold">{bookingData.phoneNumber}</p>
                    </div>
                    <div className="bg-[var(--bg-primary)] p-3 rounded-lg">
                      <p className="text-xs text-[var(--text-secondary)] mb-1">Service</p>
                      <p className="text-[var(--text-primary)] font-semibold">{bookingData.service}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={generatePDF}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[var(--accent-gold)] via-[#FFC107] to-[#E8B84B] text-black font-bold rounded-xl hover:shadow-lg transition-all text-base"
                  >
                    <Download size={18} />
                    Download PDF
                  </motion.button>
                  <p className="text-xs text-[var(--text-secondary)] text-center">
                    ✅ Download & share with Ethan
                  </p>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {(stage === 'name' || stage === 'phone' || stage === 'nationality' || stage === 'details') && (
              <div className="border-t border-[var(--border)] p-4 flex-shrink-0 bg-[var(--bg-card)]">
                <div className="mb-3">
                  <label className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wide block mb-2">
                    {stage === 'name' && '👤 Your Name'}
                    {stage === 'phone' && '📱 Phone Number'}
                    {stage === 'nationality' && '🌍 Country'}
                    {stage === 'details' && '💬 Project Details'}
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
                      placeholder={
                        stage === 'phone' ? 'e.g., 0781234567' :
                        stage === 'name' ? 'e.g., John Doe' :
                        stage === 'nationality' ? 'e.g., South Africa' :
                        'e.g., I need a 5-page website...'
                      }
                      autoFocus
                      className="flex-1 bg-[var(--bg-primary)] border-2 border-[var(--border)] text-[var(--text-primary)] px-4 py-3 rounded-lg focus:outline-none focus:border-[var(--accent-blue)] text-base placeholder-[var(--text-secondary)] font-medium"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleInputSubmit}
                      disabled={!inputValue.trim()}
                      className="bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white p-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                    >
                      <ArrowUp size={20} />
                    </motion.button>
                  </div>
                </div>
              </div>
            )}

            {/* Summary Mode - No Input */}
            {stage === 'summary' && (
              <div className="border-t border-[var(--border)] p-5 flex-shrink-0 bg-[var(--bg-card)]">
                <div className="flex items-start gap-3 mb-4 bg-[var(--glow-blue)] p-3 rounded-lg">
                  <span className="text-xl">⏰</span>
                  <div className="text-xs">
                    <p className="font-semibold text-[var(--accent-blue)]">Response Time</p>
                    <p className="text-[var(--text-secondary)]">Ethan replies within 2 hours on WhatsApp</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsOpen(false);
                    setMessages([]);
                    setStage('greeting');
                    setBookingData({
                      fullName: '',
                      phoneNumber: '',
                      nationality: '',
                      service: '',
                      usageType: '',
                    });
                  }}
                  className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)] transition-all font-medium"
                >
                  Close Chat
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
