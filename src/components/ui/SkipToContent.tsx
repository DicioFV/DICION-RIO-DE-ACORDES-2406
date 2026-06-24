export function SkipToContent() {
  return (
    <a href="#main-content"
      className="fixed top-0 left-1/2 -translate-x-1/2 -translate-y-full focus:translate-y-0 z-[9999] bg-primary text-primary-foreground px-4 py-2 rounded-b-lg font-semibold text-sm transition-transform focus:outline-none focus:ring-2 focus:ring-white">
      Pular para o conteúdo principal
    </a>
  );
}
