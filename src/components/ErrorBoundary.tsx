import React from "react";

interface State {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
          <div className="max-w-lg w-full border border-destructive/40 bg-destructive/5 rounded-lg p-6">
            <h1 className="text-xl font-semibold text-destructive mb-2">
              Une erreur est survenue
            </h1>
            <p className="text-sm text-muted-foreground mb-4">
              L'application a rencontré un problème inattendu.
            </p>
            <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-64 whitespace-pre-wrap">
              {this.state.error.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded text-sm"
            >
              Recharger
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
