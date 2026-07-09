'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, ArrowUp, ArrowLeft, ArrowRight, Download, CheckCircle, Clock, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useChatbot } from '@/context/ChatbotContext';
import { generateCleanBookingPDF } from '@/lib/generateCleanBookingPDF';
import { validateClientID } from '@/lib/validateClientID';
import ChatWidgetBackground from '@/components/ui/ChatWidgetBackground';
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
  clientIDType: 'national_id' | 'passport' | '';
  clientID: string;
  service: string;
  usageType: string;
  budget: string;
  contactMethod: string;
  timeline: string;
  projectDetails: string;
  improvedProjectDetails: string;
  termsAccepted: boolean;
  bookingReference: string;
  verificationCode?: string;
  bookingId?: string;
}

// Deposit charged at booking time = this share of the service starting price.
// (Balance is invoiced on delivery.) Custom / "Other" jobs use a flat secure fee.
const DEPOSIT_PERCENT = 0.5;
const CUSTOM_DEPOSIT = 1500;

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
  { id: '7', label: '📲 Build Custom App', value: 'Custom Apps Building', price: 'Custom' },
  { id: '8', label: '📝 Other', value: 'Other', price: 'Custom' },
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

type StageType = 'greeting' | 'service' | 'budget' | 'usage_type' | 'name' | 'email' | 'phone' | 'company' | 'nationality' | 'client_id_type' | 'client_id' | 'contact_method' | 'timeline' | 'details' | 'review' | 'terms' | 'summary';

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
  'client_id_type',
  'client_id',
  'contact_method',
  'timeline',
  'details',
  'review',
  'terms',
  'summary',
];

// Stages a user can actually land on and interact with (have their own screen).
// Excludes the transient 'service' stage and the terminal 'summary'.
const NAVIGABLE_STAGES = new Set<StageType>([
  'greeting',
  'budget',
  'usage_type',
  'name',
  'email',
  'phone',
  'company',
  'nationality',
  'client_id_type',
  'client_id',
  'contact_method',
  'timeline',
  'details',
  'review',
  'terms',
]);

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
  const router = useRouter();
  const { isOpen, setIsOpen, openChatbot, presetBooking, consumePreset } = useChatbot();
  const presetHandled = useRef(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [stage, setStage] = useState<StageType>('greeting');
  const [bookingData, setBookingData] = useState<BookingData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    company: '',
    nationality: '',
    clientIDType: '',
    clientID: '',
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
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'paid'>('idle');
  const [validationError, setValidationError] = useState('');
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  const [history, setHistory] = useState<StageType[]>([]);
  const [future, setFuture] = useState<StageType[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isNavigating = useRef(false);
  const prevStage = useRef<StageType>('greeting');

  const currentStageIndex = STAGE_ORDER.indexOf(stage);
  const progressPercent = stage === 'greeting' ? 0 : ((currentStageIndex + 1) / STAGE_ORDER.length) * 100;

  // Get service price
  const getServicePrice = (serviceName: string) => {
    const service = SERVICES.find(s => s.value === serviceName);
    return service?.price || 'Custom';
  };

  // Deposit (in ZAR) to secure this booking. 50% of the starting price for
  // fixed-price services; a flat fee for Custom/Other jobs.
  const getServiceDeposit = (serviceName: string): number => {
    const priceStr = getServicePrice(serviceName);
    const numeric = parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
    if (!numeric || isNaN(numeric)) return CUSTOM_DEPOSIT;
    return Math.round(numeric * DEPOSIT_PERCENT);
  };

  // Load Paystack's inline popup script once. We call this early (on open) so
  // the script is already in memory by the time the client taps "Pay" — that
  // removes the "searching…" delay before the popup appears.
  const loadPaystack = (): Promise<void> =>
    new Promise((resolve, reject) => {
      if (typeof window === 'undefined') return reject(new Error('no window'));
      if ((window as any).PaystackPop) return resolve();
      const existing = document.getElementById('paystack-inline-js') as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () => reject(new Error('paystack load failed')));
        return;
      }
      const s = document.createElement('script');
      s.id = 'paystack-inline-js';
      s.src = 'https://js.paystack.co/v1/inline.js';
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('paystack load failed'));
      document.body.appendChild(s);
    });

  // Re-check the payment server-side, then flip the UI to "paid".
  const verifyPayment = async (reference: string) => {
    try {
      const res = await fetch('/api/paystack/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference,
          bookingId: bookingData.bookingId,
          bookingReference: bookingData.bookingReference,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPaymentStatus('paid');
        setShowConfetti(true);
        toast.success('✅ Payment confirmed — your booking is secured!');
      } else {
        setPaymentStatus('idle');
        toast.error(data.error || 'We could not verify the payment. If money left your account, contact us on WhatsApp.');
      }
    } catch {
      setPaymentStatus('idle');
      toast.error('Payment verification failed. Please contact us on WhatsApp.');
    }
  };

  // Open the Paystack popup instantly (script is preloaded). Shows Card /
  // Instant EFT / Bank Transfer channels. We mark the client "paid" the moment
  // Paystack's callback fires (optimistic), then confirm server-side in the
  // background — so the success screen is instant, not gated on our API.
  const handlePayDeposit = async () => {
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      toast.error('Online payment is not set up yet. Ena Muluken will send you a payment link.');
      return;
    }
    const deposit = getServiceDeposit(bookingData.service);
    const email =
      bookingData.email?.trim() ||
      `${bookingData.phoneNumber.replace(/\D/g, '') || 'client'}@mulesoo.booking`;

    try {
      setPaymentStatus('processing');
      await loadPaystack();
      const PaystackPop = (window as any).PaystackPop;
      const handler = PaystackPop.setup({
        key: publicKey,
        email,
        amount: deposit * 100, // Paystack expects the smallest unit (cents)
        currency: 'ZAR',
        ref: `MULE-${Date.now()}`,
        label: `MuleSoo — ${bookingData.service || 'Project'} deposit`,
        channels: ['card', 'eft', 'bank', 'bank_transfer', 'mobile_money', 'ussd', 'qr'],
        metadata: {
          custom_fields: [
            { display_name: 'Client', variable_name: 'client', value: bookingData.fullName },
            { display_name: 'Service', variable_name: 'service', value: bookingData.service },
            { display_name: 'Booking Ref', variable_name: 'booking_ref', value: bookingData.bookingReference },
          ],
        },
        callback: (response: any) => {
          // Show success immediately — Paystack only fires this on a real
          // successful charge — then confirm with our server in the background.
          setPaymentStatus('paid');
          setShowConfetti(true);
          verifyPayment(response.reference);
        },
        onClose: () => {
          setPaymentStatus((s) => (s === 'paid' ? s : 'idle'));
        },
      });
      handler.openIframe();
    } catch (e) {
      console.error('Paystack open error:', e);
      setPaymentStatus('idle');
      toast.error('Could not open the payment window. Please try again.');
    }
  };

  // Preload Paystack the moment the chat opens, so tapping "Pay" opens the
  // payment window instantly instead of waiting for the script to download.
  useEffect(() => {
    if (isOpen) loadPaystack().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

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
    // Track window size for the confetti overlay. The widget stays closed until
    // the client taps it — it must never auto-open on any page.
    setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  // When opened with a preset (e.g. "Buy this AI system"), skip service selection:
  // pre-fill the service + project details and jump straight into the booking flow.
  useEffect(() => {
    if (!presetBooking) {
      presetHandled.current = false;
      return;
    }
    if (!isOpen || presetHandled.current) return;
    presetHandled.current = true;
    const preset = consumePreset();
    if (!preset) return;

    // Start a clean conversation and auto-answer the first question (the service)
    // with the exact system the client chose, then jump straight to budget.
    const price = preset.price || getServicePrice('Build AI Automation');
    setMessages([]);
    setHistory([]);
    setFuture([]);
    setStage('service');
    setBookingData(prev => ({ ...prev, service: preset.service, projectDetails: preset.details }));
    addMessage(`✅ ${preset.service}`, 'user');
    setTimeout(() => {
      addMessage(
        `Excellent choice! 🚀 The ${preset.service} — starting from ${price}.\n\nTo tailor your quote, what's your budget range?`,
        'bot'
      );
      setStage('budget');
    }, 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, presetBooking]);

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Track stage transitions so the user can step back through the booking.
  useEffect(() => {
    if (isNavigating.current) {
      // back/forward handled the stacks already — don't record again
      isNavigating.current = false;
    } else if (
      prevStage.current !== stage &&
      stage !== 'greeting' &&
      NAVIGABLE_STAGES.has(prevStage.current)
    ) {
      // normal forward progression: record where we came from, and moving onto a
      // new path invalidates any "forward" (redo) history
      const from = prevStage.current;
      setHistory((h) => [...h, from]);
      setFuture([]);
    }
    prevStage.current = stage;
  }, [stage]);

  const goBack = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    isNavigating.current = true;
    setHistory((h) => h.slice(0, -1));
    setFuture((f) => [stage, ...f]);
    setInputValue('');
    setValidationError('');
    setStage(prev);
  };

  const goForward = () => {
    if (future.length === 0) return;
    const next = future[0];
    isNavigating.current = true;
    setFuture((f) => f.slice(1));
    setHistory((h) => [...h, stage]);
    setInputValue('');
    setValidationError('');
    setStage(next);
  };

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
          clientID: bookingData.clientID,
          clientIDType: bookingData.clientIDType,
        }),
      });
      if (!response.ok) {
        toast.error('Failed to submit booking');
        return;
      }

      const responseData = await response.json();
      if (responseData.verificationCode || responseData.bookingId) {
        setBookingData(prev => ({
          ...prev,
          verificationCode: responseData.verificationCode ?? prev.verificationCode,
          bookingId: responseData.bookingId ?? prev.bookingId,
        }));
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
    setHistory([]);
    setFuture([]);
    setShowConfetti(false);
    setPaymentStatus('idle');
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
      clientIDType: '',
      clientID: '',
      verificationCode: undefined,
      bookingId: undefined,
    });
  };

  const handleCompletedClose = () => {
    // Clear the conversation, close the widget, and return to the home scene
    resetChat();
    router.push('/');
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
          addMessage(`Great! Your phone is ${formattedPhone}\n\nFor security & project tracking, please provide your national ID or passport number.`, 'bot');
          setStage('client_id_type');
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

      case 'client_id':
        const validation = validateClientID(bookingData.nationality, userInput, bookingData.clientIDType as 'national_id' | 'passport');
        if (!validation.isValid) {
          setValidationError(validation.message);
          toast.error(`❌ ${validation.message}`);
          return;
        }
        setValidationError('');
        addMessage(userInput, 'user');
        setInputValue('');
        setBookingData(prev => ({ ...prev, clientID: userInput }));
        setTimeout(() => {
          addMessage(`Perfect! Your ${bookingData.clientIDType === 'passport' ? 'passport' : 'national ID'} has been saved.`, 'bot');
          if (bookingData.usageType === 'Company') {
            addMessage(`What's your company/business name?`, 'bot');
            setStage('company');
          } else {
            addMessage(`How would you prefer us to contact you?`, 'bot');
            setStage('contact_method');
          }
        }, 300);
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

  const generatePDF = async () => {
    try {
      toast.loading('📄 Generating PDF...');
      await generateCleanBookingPDF({
        ...bookingData,
        deposit: getServiceDeposit(bookingData.service),
        paymentStatus: paymentStatus === 'paid' ? 'paid' : 'pending',
      });
      toast.dismiss();
      toast.success('✅ PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.dismiss();
      toast.error('❌ Failed to generate PDF. Please try again.');
    }
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
            {/* Animated brand background (scoped to widget) */}
            <ChatWidgetBackground />

            {/* Content layer (above background) */}
            <div className="relative z-10 flex flex-col h-full min-h-0">
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
              <div className="flex items-center gap-1.5">
                {stage !== 'greeting' && stage !== 'summary' && (
                  <>
                    <button
                      type="button"
                      onClick={goBack}
                      disabled={history.length === 0}
                      aria-label="Go back one step"
                      title="Back"
                      className="p-1.5 -ml-1 rounded-lg hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={goForward}
                      disabled={future.length === 0}
                      aria-label="Go forward one step"
                      title="Forward"
                      className="p-1.5 rounded-lg hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowRight size={20} />
                    </button>
                  </>
                )}
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
                      <p className="text-xs text-[var(--accent-green)] mt-1">⏰ Ena Muluken will contact you within 2 hours</p>
                    </div>

                    {/* Deposit Payment */}
                    {paymentStatus === 'paid' ? (
                      <div className="bg-[rgba(0,255,136,0.08)] border border-[var(--accent-green)] p-4 rounded-lg text-center">
                        <p className="text-[var(--accent-green)] font-bold flex items-center justify-center gap-2">
                          <CheckCircle size={18} /> Deposit Paid — Booking Secured!
                        </p>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">
                          A receipt has been sent to your email by Paystack.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-[var(--bg-primary)] border border-[var(--accent-gold)] p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold text-[var(--text-primary)]">
                            🔒 Secure Your Booking
                          </p>
                          <p className="text-lg font-bold text-[var(--accent-gold)]">
                            R{getServiceDeposit(bookingData.service).toLocaleString('en-ZA')}
                          </p>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mb-3">
                          Pay a deposit now to lock in your slot. The balance is invoiced on delivery.
                        </p>
                        <motion.button
                          whileHover={{ scale: paymentStatus === 'processing' ? 1 : 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handlePayDeposit}
                          disabled={paymentStatus === 'processing'}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,200,255,0.4)] transition-all text-base disabled:opacity-60"
                        >
                          {paymentStatus === 'processing' ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Opening payment…
                            </>
                          ) : (
                            <>💳 Pay R{getServiceDeposit(bookingData.service).toLocaleString('en-ZA')} Deposit</>
                          )}
                        </motion.button>
                        <p className="text-[10px] text-[var(--text-secondary)] text-center mt-2">
                          💳 Card · ⚡ Instant EFT · 🏦 Bank Transfer — secured by Paystack 🔒
                        </p>
                      </div>
                    )}

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

                  {/* Download Button */}
                  <div className="space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={generatePDF}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[var(--accent-gold)] via-[#FFC107] to-[#E8B84B] text-black font-bold rounded-xl hover:shadow-lg transition-all text-base"
                    >
                      <Download size={18} />
                      Download Booking Agreement PDF
                    </motion.button>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] text-center">
                    📄 Includes your booking details, verification code &amp; full Terms &amp; Conditions
                  </p>
                  </motion.div>

                  {/* Professional QR Code Section */}
                  <div className="px-2 pb-6">
                    <ProfessionalQRCode
                      url="https://mulesoo.com"
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
            {(stage === 'name' || stage === 'email' || stage === 'phone' || stage === 'company' || stage === 'nationality' || stage === 'client_id' || stage === 'timeline' || stage === 'details') && (
              <div className="border-t border-[var(--border)] p-4 flex-shrink-0 bg-[var(--bg-card)]">
                <div className="mb-3">
                  <label className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wide block mb-2">
                    {stage === 'name' && '👤 Your Full Name *'}
                    {stage === 'email' && '📧 Email Address *'}
                    {stage === 'phone' && '📱 Phone Number *'}
                    {stage === 'company' && '🏢 Company Name'}
                    {stage === 'nationality' && '🌍 Country *'}
                    {stage === 'client_id' && bookingData.clientIDType === 'national_id' && '🪪 National ID Number *'}
                    {stage === 'client_id' && bookingData.clientIDType === 'passport' && '📕 Passport Number *'}
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
                                  : stage === 'client_id'
                                    ? bookingData.clientIDType === 'national_id'
                                      ? 'e.g., 9001015001088'
                                      : 'e.g., A12345678'
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
                  {stage === 'client_id' && validationError && (
                    <p className="text-xs text-red-400 mt-1">⚠️ {validationError}</p>
                  )}
                </div>
              </div>
            )}

            {/* Client ID Type Selection */}
            {stage === 'client_id_type' && (
              <div className="border-t border-[var(--border)] p-5 flex-shrink-0 bg-[var(--bg-card)] space-y-3">
                <p className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wide">
                  Which document would you like to provide?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      addMessage('🪪 National ID', 'user');
                      setBookingData({ ...bookingData, clientIDType: 'national_id' });
                      setInputValue('');
                      setTimeout(() => {
                        addMessage(`Perfect! Please enter your 13-digit National ID.`, 'bot');
                        setStage('client_id');
                      }, 300);
                    }}
                    className="px-4 py-3 rounded-lg font-semibold text-sm transition-all bg-[var(--bg-primary)] border-2 border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)]"
                  >
                    🪪 National ID
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      addMessage('📕 Passport', 'user');
                      setBookingData({ ...bookingData, clientIDType: 'passport' });
                      setInputValue('');
                      setTimeout(() => {
                        addMessage(`Perfect! Please enter your Passport number.`, 'bot');
                        setStage('client_id');
                      }, 300);
                    }}
                    className="px-4 py-3 rounded-lg font-semibold text-sm transition-all bg-[var(--bg-primary)] border-2 border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)]"
                  >
                    📕 Passport
                  </motion.button>
                </div>
              </div>
            )}

            {/* Summary Mode Footer */}
            {stage === 'summary' && (
              <div className="border-t border-[var(--border)] p-5 flex-shrink-0 bg-[var(--bg-card)] space-y-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCompletedClose}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-[var(--accent-green)] to-[#00FF88] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,255,136,0.5)] transition-all text-base"
                >
                  <CheckCircle size={18} />
                  Finish &amp; Close
                </motion.button>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
