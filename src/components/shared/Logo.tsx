
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("text-center", className)}>
      <img 
        src="/lovable-uploads/685b52a6-6177-41b2-a090-fce7a4ea3e1d.png" 
        alt="K.MyHicham Logo" 
        className="h-8 inline-block" 
      />
    </div>
  );
}
