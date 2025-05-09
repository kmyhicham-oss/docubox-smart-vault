
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ShoppingCart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const PaymentPlans = () => {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('free');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Add PayPal script dynamically
  useEffect(() => {
    // Only load PayPal script when premium plan is selected
    if (selectedPlan === 'premium') {
      const script = document.createElement('script');
      script.src = "https://www.paypal.com/sdk/js?client-id=test&currency=USD";
      script.async = true;
      
      script.onload = () => {
        if (window.paypal && paypalContainerRef.current) {
          // Clear any existing buttons
          paypalContainerRef.current.innerHTML = '';
          
          // @ts-ignore - PayPal is loaded dynamically
          window.paypal.Buttons({
            createOrder: (data: any, actions: any) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: "2.99",
                      currency_code: "USD"
                    },
                    description: "DocuBox Premium Subscription"
                  }
                ]
              });
            },
            onApprove: async (data: any, actions: any) => {
              setPaymentProcessing(true);
              try {
                const details = await actions.order.capture();
                handlePaymentSuccess(details);
              } catch (error) {
                console.error("Payment failed:", error);
                toast({
                  title: t("payment.failed"),
                  description: t("payment.tryAgain"),
                  variant: "destructive"
                });
              } finally {
                setPaymentProcessing(false);
              }
            },
            onError: (err: any) => {
              console.error("PayPal Error:", err);
              toast({
                title: t("payment.error"),
                description: t("payment.errorOccurred"),
                variant: "destructive"
              });
              setPaymentProcessing(false);
            }
          }).render(paypalContainerRef.current);
        }
      };
      
      document.body.appendChild(script);
      
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [selectedPlan, t]);
  
  const handlePaymentSuccess = (details: any) => {
    // In a real app, you would update user subscription status on the server
    toast({
      title: t("payment.success"),
      description: t("payment.subscriptionActive"),
    });
    
    // Navigate to dashboard after successful payment
    setTimeout(() => navigate('/'), 1500);
  };
  
  const handleFreePlanSelection = () => {
    toast({
      title: t("payment.freePlan"),
      description: t("payment.freePlanActivated"),
    });
    
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">{t("payment.choosePlan")}</h1>
      
      <RadioGroup value={selectedPlan} onValueChange={(value: 'free' | 'premium') => setSelectedPlan(value)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <div className={`border-2 rounded-xl ${selectedPlan === 'free' ? 'border-primary' : 'border-muted'}`}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {t("payment.freePlan")}
                <Badge variant="outline" className="ml-2">{t("payment.free")}</Badge>
              </CardTitle>
              <CardDescription>{t("payment.freeDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <RadioGroupItem value="free" id="free" className="mt-1" />
                  <Label htmlFor="free" className="ml-2 font-normal">
                    <h3 className="text-base font-semibold">{t("payment.basicFeatures")}</h3>
                    <ul className="list-disc pl-5 pt-2 text-muted-foreground text-sm">
                      <li>{t("payment.limitedStorage")}</li>
                      <li>{t("payment.basicFunctionality")}</li>
                      <li>{t("payment.standardSupport")}</li>
                    </ul>
                  </Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleFreePlanSelection}
                disabled={selectedPlan !== 'free'} 
                className="w-full"
                variant="outline"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {t("payment.select")}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Premium Plan */}
        <div className={`border-2 rounded-xl ${selectedPlan === 'premium' ? 'border-primary' : 'border-muted'}`}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {t("payment.premiumPlan")}
                <Badge variant="default" className="ml-2">2.99$ / {t("payment.month")}</Badge>
              </CardTitle>
              <CardDescription>{t("payment.premiumDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <RadioGroupItem value="premium" id="premium" className="mt-1" />
                  <Label htmlFor="premium" className="ml-2 font-normal">
                    <h3 className="text-base font-semibold">{t("payment.advancedFeatures")}</h3>
                    <ul className="list-disc pl-5 pt-2 text-muted-foreground text-sm">
                      <li>{t("payment.unlimitedStorage")}</li>
                      <li>{t("payment.prioritySupport")}</li>
                      <li>{t("payment.advancedFeatures")}</li>
                      <li>{t("payment.noAds")}</li>
                    </ul>
                  </Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              {selectedPlan === 'premium' && (
                <div ref={paypalContainerRef} className="w-full mb-4"></div>
              )}
              <Button 
                onClick={() => setSelectedPlan('premium')} 
                disabled={selectedPlan === 'premium' || paymentProcessing} 
                className="w-full"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {t("payment.selectPremium")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PaymentPlans;
