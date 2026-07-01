'use client';

import {
  Scissors, Dumbbell, UtensilsCrossed, BedDouble, Home, Scale, Landmark,
  GraduationCap, Stethoscope, Wrench, Truck, BellRing, CreditCard, FileText,
  Target, MessageCircle, ShoppingCart, CalendarCheck, type LucideIcon,
} from 'lucide-react';

const MAP: Record<string, LucideIcon> = {
  beauty: Scissors,
  fitness: Dumbbell,
  food: UtensilsCrossed,
  hotel: BedDouble,
  property: Home,
  legal: Scale,
  finance: Landmark,
  education: GraduationCap,
  medical: Stethoscope,
  home: Wrench,
  logistics: Truck,
  bell: BellRing,
  payment: CreditCard,
  quote: FileText,
  lead: Target,
  support: MessageCircle,
  order: ShoppingCart,
  booking: CalendarCheck,
};

export default function AutomationIcon({
  iconKey,
  size = 18,
  className,
}: {
  iconKey: string;
  size?: number;
  className?: string;
}) {
  const Icon = MAP[iconKey] ?? CalendarCheck;
  return <Icon size={size} className={className} />;
}
