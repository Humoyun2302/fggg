import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, AlertCircle, CheckCircle, Calendar, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { PaymentModal } from './PaymentModal';
import { SubscriptionManagement } from './SubscriptionManagement';
import { useLanguage } from '../contexts/LanguageContext';

interface SubscriptionSectionProps {
  subscriptionStatus: 'active' | 'expired' | 'pending';
  expiryDate: string;
  currentPlan?: '1-month' | '6-months' | '1-year';
  onPaymentSuccess: (planId: string) => void;
}

export function SubscriptionSection({ subscriptionStatus, expiryDate, currentPlan, onPaymentSuccess }: SubscriptionSectionProps) {
  const { t } = useLanguage();
  const [showPayment, setShowPayment] = useState(false);
  const [showSubscriptionPage, setShowSubscriptionPage] = useState(false);

  // Plan details matching SubscriptionManagement
  const planDetails = {
    '1-month': {
      id: '1-month',
      name: t('subscription.oneMonth'),
      duration: 1,
      totalPrice: 99990,
      monthlyPrice: 99990,
    },
    '6-months': {
      id: '6-months',
      name: t('subscription.sixMonths'),
      duration: 6,
      totalPrice: 539990,
      monthlyPrice: 89998,
      savings: 180000,
    },
    '1-year': {
      id: '1-year',
      name: t('subscription.oneYear'),
      duration: 12,
      totalPrice: 959990,
      monthlyPrice: 79999,
      savings: 599900,
    },
  };

  const activePlan = (currentPlan && planDetails[currentPlan as keyof typeof planDetails]) 
    ? planDetails[currentPlan as keyof typeof planDetails] 
    : {
        id: currentPlan || 'unknown',
        name: (currentPlan && currentPlan.includes('trial')) ? 'Free Trial' : (currentPlan || t('subscription.none') || 'None'),
        duration: 0,
        totalPrice: 0,
        monthlyPrice: 0,
        savings: 0
      };

  const formatPrice = (price: number) => {
    if (typeof price !== 'number' || isNaN(price)) return '0';
    return new Intl.NumberFormat('uz-UZ').format(price);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString();
    } catch {
      return '';
    }
  };

  const getDaysUntilExpiry = (dateStr: string) => {
    if (!dateStr) return 0;
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 0;
      return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    } catch {
      return 0;
    }
  };

  const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
  const isExpiringSoon = daysUntilExpiry <= 7 && daysUntilExpiry > 0;

  const handlePaymentSuccess = (planId: string) => {
    setShowPayment(false);
    onPaymentSuccess(planId);
  };

  return (
    <>


      <AnimatePresence>
        {showSubscriptionPage && (
          <SubscriptionManagement
            currentPlan={currentPlan}
            subscriptionStatus={subscriptionStatus}
            expiryDate={expiryDate}
            onClose={() => setShowSubscriptionPage(false)}
            onSubscribe={(planId) => {
              console.log('Subscribed to plan:', planId);
              setShowSubscriptionPage(false);
              onPaymentSuccess(planId);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}