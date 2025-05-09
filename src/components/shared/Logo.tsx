
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
}

export function Logo({
  className
}: LogoProps) {
  return (
    <Link to="/" className={cn("text-center font-bold text-xl flex items-center justify-center", className)}>
      <span className="text-primary">Docu</span>
      <span className="text-blue-500">Box</span>
    </Link>
  );
}
