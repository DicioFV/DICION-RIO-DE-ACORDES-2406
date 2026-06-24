import React, { type ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error: Error): State { return { hasError: true, error }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) { console.error('[MusicVerse Error]', error, info.componentStack); }
  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-destructive/10 border border-destructive/30 m-8">
          <div className="text-4xl">⚠️</div>
          <h3 className="font-bold text-lg">Ops! Algo deu errado</h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm">{this.state.error?.message || 'Erro inesperado.'}</p>
          <button onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-semibold text-sm cursor-pointer">
            🔄 Recarregar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
