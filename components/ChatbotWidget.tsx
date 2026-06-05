'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, ArrowUp, Download, CheckCircle, Clock, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useChatbot } from '@/context/ChatbotContext';
import { generateCleanBookingPDF } from '@/lib/generateCleanBookingPDF';
import { generateCleanTermsPDF } from '@/lib/generateCleanTermsPDF';
import Confetti from 'react-confetti';
import toast, { Toaster } from 'react-hot-toast';
import dynamic from 'next/dynamic';

const ProfessionalQRCode = dynamic(() => import('./ProfessionalQRCode'), { ssr: false });

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
}

interface BookingData {
  fullName: string;
  email: string;
  phoneNumber: string;
  company: string;
  nationality: string;
  service: string;
  usageType: string;
  budget: string;
  contactMethod: string;
  timeline: string;
  projectDetails: string;
  improvedProjectDetails: string;
  termsAccepted: boolean;
  bookingReference: string;
}

const COUNTRY_CODES: { [key: string]: string } = {
  'south africa': '+27',
  'united states': '+1',
  'usa': '+1',
  'america': '+1',
  'ethiopia': '+251',
  'uk': '+44',
  'united kingdom': '+44',
  'nigeria': '+234',
  'kenya': '+254',
  'ghana': '+233',
  'egypt': '+20',
  'morocco': '+212',
  'uganda': '+256',
  'tanzania': '+255',
  'zimbabwe': '+263',
  'botswana': '+267',
  'namibia': '+264',
  'lesotho': '+266',
  'canada': '+1',
  'australia': '+61',
  'india': '+91',
  'germany': '+49',
  'france': '+33',
  'spain': '+34',
};

const SERVICES = [
  { id: '1', label: '💻 Design Website', value: 'Design Website', price: 'R3,500' },
  { id: '2', label: '🔧 Fix Website', value: 'Fix Website', price: 'R3,500' },
  { id: '3', label: '🎨 Design Widget', value: 'Design Widget', price: 'R3,500' },
  { id: '4', label: '🤖 Build AI Chatbot', value: 'Build AI Chatbot', price: 'R3,500' },
  { id: '5', label: '⚙️ Build AI Automation', value: 'Build AI Automation', price: 'R5,000' },
  { id: '6', label: '🌐 All in One Website', value: 'All in One Website', price: 'R7,500' },
  { id: '7', label: '📝 Other', value: 'Other', price: 'Custom' },
];

const BUDGET_RANGES = [
  { id: '1', label: 'R3,500 - R5,000', value: 'R3,500 - R5,000' },
  { id: '2', label: 'R5,000 - R10,000', value: 'R5,000 - R10,000' },
  { id: '3', label: 'R10,000 - R20,000', value: 'R10,000 - R20,000' },
  { id: '4', label: 'R20,000+', value: 'R20,000+' },
  { id: '5', label: 'Not sure yet', value: 'Not sure yet' },
];

const CONTACT_METHODS = [
  { id: '1', label: '💬 WhatsApp', value: 'WhatsApp' },
  { id: '2', label: '📧 Email', value: 'Email' },
  { id: '3', label: '📱 Phone Call', value: 'Phone Call' },
];

type StageType = 'greeting' | 'service' | 'budget' | 'usage_type' | 'name' | 'email' | 'phone' | 'company' | 'nationality' | 'contact_method' | 'timeline' | 'details' | 'review' | 'terms' | 'summary';

// Updated stage order - better UX
const STAGE_ORDER: StageType[] = [
  'service',
  'budget',
  'usage_type',
  'name',
  'email',
  'phone',
  'company',
  'nationality',
  'contact_method',
  'timeline',
  'details',
  'review',
  'terms',
  'summary',
];

// Validation functions
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length >= 7;
};

const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export default function ChatbotWidget() {
  const pathname = usePathname();
  const { isOpen, setIsOpen, openChatbot } = useChatbot();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [stage, setStage] = useState<StageType>('greeting');
  const [bookingData, setBookingData] = useState<BookingData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    company: '',
    nationality: '',
    service: '',
    usageType: '',
    budget: '',
    contactMethod: '',
    timeline: '',
    projectDetails: '',
    improvedProjectDetails: '',
    termsAccepted: false,
    bookingReference: '',
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentStageIndex = STAGE_ORDER.indexOf(stage);
  const progressPercent = stage === 'greeting' ? 0 : ((currentStageIndex + 1) / STAGE_ORDER.length) * 100;

  // Get service price
  const getServicePrice = (serviceName: string) => {
    const service = SERVICES.find(s => s.value === serviceName);
    return service?.price || 'Custom';
  };

  // Get step visual dots
  const getStepDots = () => {
    const totalSteps = STAGE_ORDER.length;
    const filledSteps = currentStageIndex + 1;
    let dots = '';
    for (let i = 0; i < totalSteps; i++) {
      dots += i < filledSteps ? '●' : '○';
    }
    return dots;
  };

  useEffect(() => {
    setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    if (pathname === '/contact') {
      openChatbot();
    }
  }, [pathname, openChatbot]);

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, sender: 'user' | 'bot', isTyping = false) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      isTyping,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const getCountryCode = (country: string): string => {
    const normalized = country.toLowerCase().trim();
    return COUNTRY_CODES[normalized] || '+27';
  };

  const formatPhoneWithCountryCode = (phone: string, country: string): string => {
    const cleanPhone = phone.replace(/\D/g, '');
    const countryCode = getCountryCode(country);
    let numberPart = cleanPhone;
    if (numberPart.startsWith('0')) {
      numberPart = numberPart.slice(1);
    }
    return `${countryCode}${numberPart}`;
  };

  const generateBookingReference = (): string => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `MULE-${random}${timestamp}`.substring(0, 14);
  };

  const improveProjectDetails = async (details: string, service: string) => {
    try {
      const response = await fetch('/api/improve-project-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectDetails: details, service }),
      });
      const data = await response.json();
      return data.improved || details;
    } catch (error) {
      console.error('Error improving project details:', error);
      return details;
    }
  };

  const submitBooking = async () => {
    try {
      const response = await fetch('/api/chatbot-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: bookingData.fullName,
          email: bookingData.email,
          phoneNumber: bookingData.phoneNumber,
          company: bookingData.company,
          nationality: bookingData.nationality,
          service: bookingData.service,
          usageType: bookingData.usageType,
          budget: bookingData.budget,
          contactMethod: bookingData.contactMethod,
          timeline: bookingData.timeline,
          projectDetails: bookingData.improvedProjectDetails,
        }),
      });
      if (!response.ok) {
        toast.error('Failed to submit booking');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error('Error submitting booking');
    }
  };

  const resetChat = () => {
    setIsOpen(false);
    setMessages([]);
    setStage('greeting');
    setShowConfetti(false);
    setBookingData({
      fullName: '',
      email: '',
      phoneNumber: '',
      company: '',
      nationality: '',
      service: '',
      usageType: '',
      budget: '',
      contactMethod: '',
      timeline: '',
      projectDetails: '',
      improvedProjectDetails: '',
      termsAccepted: false,
      bookingReference: '',
    });
  };

  const saveAndResume = () => {
    const dataToSave = {
      stage,
      bookingData,
      messages,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('mulesoo_booking_draft', JSON.stringify(dataToSave));
    toast.success('📌 Booking saved! You can resume anytime.');
  };

  const handleServiceSelect = (service: string) => {
    const cleanService = service.split(' ').slice(1).join(' ');
    addMessage(cleanService, 'user');
    const price = getServicePrice(service);
    setBookingData(prev => ({ ...prev, service }));

    setTimeout(() => {
      addMessage(
        `Great choice! 💪 Starting from ${price}\n\nWhat's your budget range?`,
        'bot'
      );
      setStage('budget');
    }, 300);
  };

  const handleBudgetSelect = (budget: string) => {
    addMessage(budget, 'user');
    setBookingData(prev => ({ ...prev, budget }));

    setTimeout(() => {
      addMessage(`Perfect! 💰\n\nIs this for your personal project or a company?`, 'bot');
      setStage('usage_type');
    }, 300);
  };

  const handleUsageTypeSelect = (usageType: string) => {
    addMessage(usageType, 'user');
    setBookingData(prev => ({ ...prev, usageType }));

    setTimeout(() => {
      addMessage(`Excellent! 👍\n\nWhat's your full name?`, 'bot');
      setStage('name');
    }, 300);
  };

  const handleContactMethodSelect = (method: string) => {
    const emoji = method === 'WhatsApp' ? '💬' : method === 'Email' ? '📧' : '📱';
    addMessage(`${emoji} ${method}`, 'user');
    setBookingData(prev => ({ ...prev, contactMethod: method }));

    setTimeout(() => {
      addMessage(`Perfect! We'll contact you via ${method}.\n\nIn how many weeks do you need this project ready?`, 'bot');
      setStage('timeline');
    }, 300);
  };

  const handleInputSubmit = async () => {
    if (!inputValue.trim()) return;

    const userInput = inputValue.trim();

    switch (stage) {
      case 'name':
        if (!validateName(userInput)) {
          toast.error('❌ Please enter a valid name (at least 2 characters)');
          return;
        }
        addMessage(userInput, 'user');
        setInputValue('');
        setBookingData(prev => ({ ...prev, fullName: userInput }));
        setTimeout(() => {
          addMessage(`Nice to meet you, ${userInput}! 👋\n\nWhat's your email address?`, 'bot');
          setStage('email');
        }, 300);
        break;

      case 'email':
        if (!validateEmail(userInput)) {
          toast.error('❌ Please enter a valid email (e.g., john@example.com)');
          return;
        }
        addMessage(userInput, 'user');
        setInputValue('');
        setBookingData(prev => ({ ...prev, email: userInput }));
        setTimeout(() => {
          addMessage(`Got it! What's your phone number?`, 'bot');
          setStage('phone');
        }, 300);
        break;

      case 'phone':
        if (!validatePhone(userInput)) {
          toast.error('❌ Please enter a valid phone number (at least 7 digits)');
          return;
        }
        addMessage(userInput, 'user');
        setInputValue('');
        setBookingData(prev => ({ ...prev, phoneNumber: userInput }));
        setTimeout(() => {
          addMessage(`Perfect! What's your country/location?`, 'bot');
          setStage('nationality');
        }, 300);
        break;

      case 'nationality':
        addMessage(userInput, 'user');
        setInputValue('');
        const formattedPhone = formatPhoneWithCountryCode(bookingData.phoneNumber, userInput);
        setBookingData(prev => ({ ...prev, nationality: userInput, phoneNumber: formattedPhone }));
        setTimeout(() => {
          if (bookingData.usageType === 'Company') {
            addMessage(`Great! Your phone is ${formattedPhone}\n\nWhat's your company/business name?`, 'bot');
            setStage('company');
          } else {
            addMessage(`Great! Your phone is ${formattedPhone}\n\nHow would you prefer us to contact you?`, 'bot');
            setStage('contact_method');
          }
        }, 300);
        break;

      case 'company':
        addMessage(userInput, 'user');
        setInputValue('');
        setBookingData(prev => ({ ...prev, company: userInput }));
        setTimeout(() => {
          addMessage(`Awesome! 🏢\n\nHow would you prefer us to contact you?`, 'bot');
          setStage('contact_method');
        }, 300);
        break;

      case 'timeline':
        addMessage(userInput, 'user');
        setInputValue('');
        setBookingData(prev => ({ ...prev, timeline: userInput }));
        setTimeout(() => {
          addMessage(`Excellent! 🎯\n\nBriefly describe your project. What do you need?`, 'bot');
          setStage('details');
        }, 300);
        break;

      case 'details':
        setBookingData(prev => ({ ...prev, projectDetails: userInput }));
        addMessage(userInput, 'user');
        setInputValue('');
        addMessage('⏳ Processing your project brief...', 'bot', true);

        const improved = await improveProjectDetails(userInput, bookingData.service);
        setBookingData(prev => ({ ...prev, improvedProjectDetails: improved }));

        setTimeout(() => {
          setMessages(prev => prev.filter(msg => msg.text !== '⏳ Processing your project brief...'));
          addMessage('✅ Perfect! Let me review your booking.', 'bot');
          setStage('review');
        }, 800);
        break;

      default:
        break;
    }
  };

  const handleReviewSubmit = () => {
    addMessage('✅ Everything looks good!', 'user');
    setTimeout(() => {
      addMessage('Please review and accept our terms & conditions.', 'bot');
      setStage('terms');
    }, 300);
  };

  const handleTermsAccept = () => {
    addMessage('✅ Accepted', 'user');
    const reference = generateBookingReference();
    setBookingData(prev => ({ ...prev, termsAccepted: true, bookingReference: reference }));

    setTimeout(() => {
      submitBooking();
      setShowConfetti(true);
      addMessage('🎉 Your booking is confirmed! Review details below.', 'bot');
      setStage('summary');
    }, 300);
  };

  const generatePDF = () => {
    generateCleanBookingPDF(bookingData);
    toast.success('📄 PDF downloading...');
  };

  return (
    <>
      <Toaster position="bottom-right" />
      {showConfetti && <Confetti width={windowDimensions.width} height={windowDimensions.height} />}

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
            className="fixed bottom-20 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[500px] md:w-[520px] max-w-[520px] h-[650px] sm:h-[750px] max-h-[calc(100vh-120px)] rounded-2xl sm:rounded-3xl shadow-2xl bg-[var(--bg-secondary)] border border-[var(--border)] flex flex-col z-40 overflow-hidden"
          >
            {/* Progress Bar */}
            {stage !== 'greeting' && (
              <>
                <div className="h-1 bg-[var(--bg-card)] overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)]"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </>
            )}

            {/* Header */}
            <div className="bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white p-4 rounded-t-3xl flex-shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold font-sora">
                  <span className="text-[var(--accent-blue)]">MULE</span>
                  <span>SOO</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-green)] animate-pulse" />
                  <span className="text-xs opacity-90">Online</span>
                </div>
                {stage !== 'greeting' && (
                  <div className="text-xs opacity-95 font-mono">
                    {getStepDots()}
                  </div>
                )}
              </div>
            </div>

            {/* Estimated Time */}
            {stage !== 'greeting' && stage !== 'summary' && (
              <div className="bg-[var(--glow-blue)] border-b border-[var(--accent-blue)] px-4 py-2 flex items-center gap-2">
                <Clock size={14} className="text-[var(--accent-blue)]" />
                <span className="text-xs text-[var(--accent-blue)] font-semibold">~5 min to complete</span>
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0 scrollbar-thin scrollbar-thumb-[var(--accent-blue)] scrollbar-track-[var(--bg-card)]">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.isTyping ? (
                    <div className="flex items-center gap-1 px-4 py-3 bg-[var(--bg-card)] rounded-2xl rounded-bl-sm border border-[var(--border)]">
                      <span className="w-2 h-2 bg-[var(--text-secondary)] rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-[var(--text-secondary)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <span className="w-2 h-2 bg-[var(--text-secondary)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  ) : (
                    <div
                      className={`max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white rounded-br-sm shadow-lg'
                          : 'bg-[var(--bg-card)] text-[var(--text-secondary)] rounded-bl-sm border border-[var(--border)]'
                      }`}
                    >
                      {msg.text.split('\n').map((line, i) => (
                        <div key={i}>{line || ' '}</div>
                      ))}
                    </div>
                  )}
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
                      onClick={() => {
                        setStage('service');
                        handleServiceSelect(service.value);
                      }}
                      className="w-full px-4 py-3 text-left text-sm font-semibold bg-gradient-to-r from-[var(--bg-card)] to-[var(--glow-blue)] border-2 border-[var(--border)] text-[var(--text-primary)] rounded-xl hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)] hover:from-[var(--glow-blue)] hover:to-[var(--glow-purple)] transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <span>{service.label}</span>
                        <span className="text-xs text-[var(--text-secondary)] bg-[var(--bg-primary)] px-2 py-1 rounded">{service.price}</span>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Budget Selection */}
              {stage === 'budget' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="space-y-2 mt-4 px-2"
                >
                  <p className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wide mb-3">What's your budget?</p>
                  {BUDGET_RANGES.map((budget, idx) => (
                    <motion.button
                      key={budget.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * idx }}
                      whileHover={{ scale: 1.02, x: 8 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleBudgetSelect(budget.value)}
                      className="w-full px-4 py-3 text-left text-sm font-semibold bg-gradient-to-r from-[var(--bg-card)] to-[var(--glow-purple)] border-2 border-[var(--border)] text-[var(--text-primary)] rounded-xl hover:border-[var(--accent-purple)] hover:from-[var(--glow-purple)] hover:to-[var(--glow-blue)] transition-all duration-200 cursor-pointer"
                    >
                      💰 {budget.value}
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
                  {['Personal', 'Company'].map((type, idx) => (
                    <motion.button
                      key={type}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * idx }}
                      whileHover={{ scale: 1.02, x: 8 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleUsageTypeSelect(type)}
                      className="w-full px-4 py-4 text-left font-semibold bg-gradient-to-r from-[var(--bg-card)] to-[var(--glow-blue)] border-2 border-[var(--border)] text-[var(--text-primary)] rounded-xl hover:border-[var(--accent-blue)] hover:from-[var(--glow-blue)] hover:to-[var(--glow-purple)] transition-all duration-200 cursor-pointer"
                    >
                      {type === 'Personal' ? '👤 Personal' : '🏢 Company'}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Contact Method Selection */}
              {stage === 'contact_method' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="space-y-2 mt-4 px-2"
                >
                  <p className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wide mb-3">Preferred contact method:</p>
                  {CONTACT_METHODS.map((method, idx) => (
                    <motion.button
                      key={method.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * idx }}
                      whileHover={{ scale: 1.02, x: 8 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleContactMethodSelect(method.value)}
                      className="w-full px-4 py-3 text-left text-sm font-semibold bg-gradient-to-r from-[var(--bg-card)] to-[var(--glow-gold)] border-2 border-[var(--border)] text-[var(--text-primary)] rounded-xl hover:border-[var(--accent-gold)] hover:from-[var(--glow-gold)] hover:to-[var(--glow-blue)] transition-all duration-200 cursor-pointer"
                    >
                      {method.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Review Stage */}
              {stage === 'review' && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="glass-card p-6 space-y-4 mt-3 mx-2"
                >
                  <h3 className="font-bold text-lg text-[var(--text-primary)]">📋 Review Your Booking</h3>
                  <div className="space-y-2 text-sm">
                    <div className="bg-[var(--bg-primary)] p-3 rounded-lg border border-[var(--border)]">
                      <p className="text-xs text-[var(--text-secondary)] mb-1">Service</p>
                      <p className="text-[var(--text-primary)] font-semibold">{bookingData.service}</p>
                    </div>
                    <div className="bg-[var(--bg-primary)] p-3 rounded-lg border border-[var(--border)]">
                      <p className="text-xs text-[var(--text-secondary)] mb-1">Budget & Timeline</p>
                      <p className="text-[var(--text-primary)] font-semibold text-xs">💰 {bookingData.budget} | ⏱️ {bookingData.timeline}</p>
                    </div>
                    <div className="bg-[var(--bg-primary)] p-3 rounded-lg border border-[var(--border)]">
                      <p className="text-xs text-[var(--text-secondary)] mb-1">Contact</p>
                      <p className="text-[var(--text-primary)] font-semibold text-xs">{bookingData.email}</p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReviewSubmit}
                    className="w-full px-4 py-3 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold rounded-xl hover:shadow-lg transition-all text-base"
                  >
                    ✓ Looks Good, Continue
                  </motion.button>
                </motion.div>
              )}

              {/* Terms & Conditions */}
              {stage === 'terms' && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="glass-card p-6 space-y-4 mt-3 mx-2"
                >
                  <h3 className="font-bold text-lg text-[var(--text-primary)]">📋 Terms & Conditions</h3>
                  <div className="bg-[var(--bg-primary)] p-4 rounded-lg border border-[var(--border)] text-xs text-[var(--text-secondary)] space-y-2 max-h-32 overflow-y-auto">
                    <p>✓ 50% deposit required to begin work</p>
                    <p>✓ Remaining 50% due before final delivery</p>
                    <p>✓ 30 days free support included</p>
                    <p>✓ You own all work after full payment</p>
                    <p>✓ Project timeline is estimate, subject to feedback</p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleTermsAccept}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[var(--accent-green)] to-[#00FF88] text-black font-bold rounded-xl hover:shadow-lg transition-all text-base"
                  >
                    <CheckCircle size={18} />
                    I Agree & Confirm Booking
                  </motion.button>

                  <p className="text-xs text-[var(--text-secondary)] text-center">
                    By accepting, you confirm you agree to our terms
                  </p>
                </motion.div>
              )}

              {/* Booking Summary */}
              {stage === 'summary' && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5 mt-3"
                >
                  {/* Booking Reference */}
                  <motion.div className="glass-card p-6 space-y-5 mx-2">
                    <div className="bg-gradient-to-r from-[var(--accent-gold)] to-[#FFC107] p-4 rounded-lg text-black font-bold text-center">
                      <p className="text-xs opacity-90 mb-1">BOOKING REFERENCE</p>
                      <p className="text-lg font-sora letter-spacing-wide">{bookingData.bookingReference}</p>
                    </div>

                    {/* Confirmation Message */}
                    <div className="bg-[var(--glow-blue)] border border-[var(--accent-blue)] p-4 rounded-lg text-[var(--text-primary)] text-sm">
                      <p className="font-semibold">✅ Booking Confirmed!</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">📧 PDF sent to {bookingData.email}</p>
                      <p className="text-xs text-[var(--accent-green)] mt-1">⏰ Ethan will contact you within 2 hours</p>
                    </div>

                  {/* Client Details Summary */}
                  <div className="space-y-3 text-sm">
                    <div className="bg-[var(--bg-primary)] p-3 rounded-lg">
                      <p className="text-xs text-[var(--text-secondary)] mb-1">Name & Company</p>
                      <p className="text-[var(--text-primary)] font-semibold">
                        {bookingData.fullName} {bookingData.company ? `(${bookingData.company})` : ''}
                      </p>
                    </div>

                    <div className="bg-[var(--bg-primary)] p-3 rounded-lg">
                      <p className="text-xs text-[var(--text-secondary)] mb-1">Contact Info</p>
                      <p className="text-[var(--text-primary)] font-semibold text-xs">📧 {bookingData.email}</p>
                      <p className="text-[var(--text-primary)] font-semibold text-xs">📱 {bookingData.phoneNumber}</p>
                    </div>

                    <div className="bg-[var(--bg-primary)] p-3 rounded-lg">
                      <p className="text-xs text-[var(--text-secondary)] mb-1">Service & Budget</p>
                      <p className="text-[var(--text-primary)] font-semibold text-xs">{bookingData.service}</p>
                      <p className="text-[var(--text-primary)] font-semibold text-xs">💰 {bookingData.budget}</p>
                    </div>

                    <div className="bg-[var(--bg-primary)] p-3 rounded-lg border border-[var(--accent-gold)]">
                      <p className="text-xs text-[var(--accent-gold)] mb-1 font-semibold">✨ Your Project Brief</p>
                      <p className="text-[var(--text-primary)] font-semibold text-xs leading-relaxed">
                        {bookingData.improvedProjectDetails || bookingData.projectDetails}
                      </p>
                    </div>
                  </div>

                  {/* Download Buttons */}
                  <div className="space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={generatePDF}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[var(--accent-gold)] via-[#FFC107] to-[#E8B84B] text-black font-bold rounded-xl hover:shadow-lg transition-all text-base"
                    >
                      <Download size={18} />
                      Download Booking PDF
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        generateCleanTermsPDF();
                        toast.success('📄 Terms & Conditions PDF downloaded!');
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold rounded-xl hover:shadow-lg transition-all text-base"
                    >
                      <Download size={18} />
                      Download Terms & Conditions
                    </motion.button>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] text-center">
                    📄 Professional documents with verification code
                  </p>
                  </motion.div>

                  {/* Professional QR Code Section */}
                  <div className="px-2 pb-6">
                    <ProfessionalQRCode
                      url="https://mulesoo.vercel.app"
                      title="🎯 Scan to Visit MuleSoo"
                      description="Frame this QR code in your office or business space"
                      bookingReference={bookingData.bookingReference}
                      size={300}
                    />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Text Fields */}
            {(stage === 'name' || stage === 'email' || stage === 'phone' || stage === 'company' || stage === 'nationality' || stage === 'timeline' || stage === 'details') && (
              <div className="border-t border-[var(--border)] p-4 flex-shrink-0 bg-[var(--bg-card)]">
                <div className="mb-3">
                  <label className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wide block mb-2">
                    {stage === 'name' && '👤 Your Full Name *'}
                    {stage === 'email' && '📧 Email Address *'}
                    {stage === 'phone' && '📱 Phone Number *'}
                    {stage === 'company' && '🏢 Company Name'}
                    {stage === 'nationality' && '🌍 Country *'}
                    {stage === 'timeline' && '⏰ Timeline (Weeks) *'}
                    {stage === 'details' && '💬 Project Description *'}
                  </label>
                  <div className="flex gap-3">
                    <input
                      type={stage === 'email' ? 'email' : 'text'}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
                      placeholder={
                        stage === 'email'
                          ? 'e.g., john@example.com'
                          : stage === 'phone'
                            ? 'e.g., 0781234567'
                            : stage === 'name'
                              ? 'e.g., John Doe'
                              : stage === 'company'
                                ? 'e.g., Acme Corp'
                                : stage === 'nationality'
                                  ? 'e.g., South Africa'
                                  : stage === 'timeline'
                                    ? 'e.g., 2 weeks'
                                    : 'Describe your project...'
                      }
                      autoFocus
                      maxLength={stage === 'details' ? 500 : undefined}
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
                  {stage === 'details' && (
                    <p className="text-xs text-[var(--text-secondary)] mt-1">{inputValue.length}/500 characters</p>
                  )}
                </div>
              </div>
            )}

            {/* Summary Mode Footer */}
            {stage === 'summary' && (
              <div className="border-t border-[var(--border)] p-5 flex-shrink-0 bg-[var(--bg-card)] space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={saveAndResume}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] transition-all font-medium text-sm"
                >
                  <Save size={16} />
                  Save & Resume Later
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetChat}
                  className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)] transition-all font-medium"
                >
                  Start New Booking
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
