
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

// Declare PayPal interface for TypeScript
declare global {
  interface Window {
    paypal?: {
      Buttons: (config: any) => { render: (container: HTMLElement) => void };
    };
  }
}

interface DocumentLimitWarningProps {
  documentCount: number;
  maxFreeDocuments?: number;
}

export function DocumentLimitWarning({ 
  documentCount, 
  maxFreeDocuments = 5 
}: DocumentLimitWarningProps) {
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const isOverLimit = documentCount >= maxFreeDocuments;

  useEffect(() => {
    if (isOverLimit && paypalContainerRef.current) {
      const script = document.createElement('script');
      script.src = "https://www.paypal.com/sdk/js?client-id=test&currency=USD";
      script.async = true;
      
      script.onload = () => {
        if (window.paypal && paypalContainerRef.current) {
          paypalContainerRef.current.innerHTML = '';
          
          window.paypal.Buttons({
            createOrder: (data: any, actions: any) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: "2.99",
                      currency_code: "USD"
                    },
                    description: "DocuBox Premium - Documents illimités"
                  }
                ]
              });
            },
            onApprove: async (data: any, actions: any) => {
              try {
                const details = await actions.order.capture();
                toast({
                  title: "Paiement réussi !",
                  description: "Vous avez maintenant accès au plan Premium avec documents illimités.",
                });
                setTimeout(() => navigate('/'), 1500);
              } catch (error) {
                console.error("Payment failed:", error);
                toast({
                  title: "Échec du paiement",
                  description: "Veuillez réessayer.",
                  variant: "destructive"
                });
              }
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
  }, [isOverLimit, toast, navigate]);

  if (!isOverLimit) {
    return null;
  }

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-800">
          <AlertTriangle className="h-5 w-5" />
          Limite de documents atteinte
        </CardTitle>
        <CardDescription className="text-yellow-700">
          Vous avez {documentCount} documents. Le plan gratuit est limité à {maxFreeDocuments} documents.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Passez au Premium pour des documents illimités</span>
          <Badge variant="default">2.99$ / mois</Badge>
        </div>
        
        <div ref={paypalContainerRef} className="w-full"></div>
        
        <p className="text-xs text-muted-foreground text-center">
          Paiement sécurisé avec PayPal
        </p>
      </CardContent>
    </Card>
  );
}
