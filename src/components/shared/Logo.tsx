import { cn } from "@/lib/utils";
interface LogoProps {
  className?: string;
}
export function Logo({
  className
}: LogoProps) {
  return <div className={cn("text-center", className)}>
      <img alt="K.MyHicham Logo" className="h-8 inline-block" src="/lovable-uploads/35c1bed1-e837-47d8-98c9-478e491da758.png" />
    </div>;
}