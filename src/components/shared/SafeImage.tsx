
import React from 'react';

interface SafeImageProps {
  className?: string;
  style?: React.CSSProperties;
}

export function SafeImage({
  className,
  style
}: SafeImageProps) {
  return (
    <div className={className} style={style}>
      <img alt="DocuBox Safe" className="w-full h-auto object-contain" src="/lovable-uploads/110fdeef-8c54-41cb-87e3-19298b811d83.png" />
    </div>
  );
}
