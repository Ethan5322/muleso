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
      setTimeout(() => {
        addMessage(
          "👋 Hi! Welcome to MuleSoo.\n\nI'm Soo, your AI assistant. What service do you need?",
          'bot'
        );
        setStage('greeting');
      }, 100);
    }
  };

  const handleServiceSelect = (service: string) => {
    addMessage(service.split(' ').slice(1).join(' '), 'user');
    setBookingData(prev => ({ ...prev, service }));
    addMessage(`Great! You selected: ${service.split(' ').slice(1).join(' ')}\n\nIs this service for personal or company use?`, 'bot');
    setStage('usage_type');
  };

  const handleUsageTypeSelect = (usageType: string) => {
    addMessage(usageType, 'user');
    setBookingData(prev => ({ ...prev, usageType }));
    addMessage(`Perfect! I've noted this is for ${usageType.toLowerCase()} use.\n\nWhat's your full name?`, 'bot');
    setStage('name');
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
        addMessage(`Nice to meet you, ${userInput}! 👋\n\nWhat's your phone number? (WhatsApp & calls)\n\nExample: 0781234567 or +27781234567`, 'bot');
        setStage('phone');
        break;

      case 'phone':
        const formattedPhone = formatPhoneNumber(userInput);
        setBookingData(prev => ({ ...prev, phoneNumber: formattedPhone }));
        addMessage(`Perfect! ${formattedPhone} saved for both WhatsApp and calls.\n\nWhat's your nationality/country?`, 'bot');
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
        addMessage('✅ Booking confirmed! Here\'s your booking form...', 'bot');
        setTimeout(() => {
          setStage('summary');
        }, 200);
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
            className="absolute inset-0 border-2 border-[var(--accent-blue)] rounded-full"
            animate={{
              scale: [1, 1.15],
              opacity: [1, 0],
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
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-120px)] rounded-2xl shadow-2xl bg-[var(--bg-secondary)] border border-[var(--border)] flex flex-col z-40"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white p-4 rounded-t-2xl">
              <div className="font-bold font-sora flex items-center gap-2">
                Soo <span className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse" />
              </div>
              <p className="text-xs opacity-90">MuleSoo Service Booking</p>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
              {messages.map((msg) => (
                <div
                  key={msg.id}
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
                </div>
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

              {/* Usage Type Selection */}
              {stage === 'usage_type' && (
                <div className="space-y-2 mt-4">
                  <button
                    onClick={() => handleUsageTypeSelect('Personal')}
                    className="w-full px-3 py-2 text-left text-xs bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)] transition-colors"
                  >
                    👤 Personal
                  </button>
                  <button
                    onClick={() => handleUsageTypeSelect('Company')}
                    className="w-full px-3 py-2 text-left text-xs bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)] transition-colors"
                  >
                    🏢 Company
                  </button>
                </div>
              )}

              {/* Summary & Download */}
              {stage === 'summary' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.1 }}
                  className="glass-card p-3 space-y-2 mt-2"
                >
                  <h3 className="font-bold text-[var(--text-primary)]">📋 Your Booking Details:</h3>
                  <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                    <p><strong>Name:</strong> {bookingData.fullName}</p>
                    <p><strong>Phone & WhatsApp:</strong> {bookingData.phoneNumber}</p>
                    <p><strong>Country:</strong> {bookingData.nationality}</p>
                    <p><strong>Usage Type:</strong> {bookingData.usageType}</p>
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
            {(stage === 'name' || stage === 'phone' || stage === 'nationality' || stage === 'details') && (
              <div className="border-t border-[var(--border)] p-3 flex gap-2 flex-shrink-0">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
                  placeholder={stage === 'phone' ? 'e.g., 0781234567' : 'Type...'}
                  autoFocus
                  className="flex-1 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] px-3 py-2 rounded-lg focus:outline-none focus:border-[var(--accent-blue)] text-sm"
                />
                <button
                  onClick={handleInputSubmit}
                  disabled={!inputValue.trim()}
                  className="bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white p-2 rounded-lg hover:scale-105 transition-transform disabled:opacity-50 flex-shrink-0"
                >
                  <ArrowUp size={18} />
                </button>
              </div>
            )}

            {/* Summary Mode - No Input */}
            {stage === 'summary' && (
              <div className="border-t border-[var(--border)] p-4 text-center">
                <p className="text-xs text-[var(--text-secondary)] mb-3">
                  💬 Ethan will contact you on WhatsApp at {bookingData.phoneNumber} within 2 hours!
                </p>
                <button
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
