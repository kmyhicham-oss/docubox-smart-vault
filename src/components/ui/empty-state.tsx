
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-muted-foreground mb-6">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="text-muted-foreground mt-1 max-w-md">{description}</p>}
      {action && (
        <Button asChild className="mt-6">
          <Link to={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}
