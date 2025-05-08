
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface DocumentHeaderProps {
  title: string;
}

export function DocumentHeader({ title }: DocumentHeaderProps) {
  return (
    <header className="bg-background border-b px-4 py-4">
      <div className="flex items-center">
        <Link to="/documents" className="mr-3">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold tracking-tight line-clamp-1">
          {title}
        </h1>
      </div>
    </header>
  );
}
