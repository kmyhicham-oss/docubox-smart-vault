
import React from 'react';

interface SafeImageProps {
  className?: string;
}

export function SafeImage({ className }: SafeImageProps) {
  return (
    <div className={className}>
      <img 
        src="/lovable-uploads/cd04ca5e-0cac-4969-a1fb-ab99d89a08ed.png" 
        alt="DocuBox Safe" 
        className="w-full h-auto object-contain" 
      />
    </div>
  );
}
