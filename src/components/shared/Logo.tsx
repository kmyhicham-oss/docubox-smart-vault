import { cn } from "@/lib/utils";
interface LogoProps {
  className?: string;
}
export function Logo({
  className
}: LogoProps) {
  return <div className={cn("text-center", className)}>
      
    </div>;
}