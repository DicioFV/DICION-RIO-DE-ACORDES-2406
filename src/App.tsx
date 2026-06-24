import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useRouter } from '@/hooks/useRouter';
import { useAppStore } from '@/store/useAppStore';
import { useOffline } from '@/hooks/useOffline';
import { usePwa } from '@/hooks/usePwa';
import { OfflineBanner } from '@/components/pwa/OfflineBanner';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import { SkipToContent } from '@/components/ui/SkipToContent';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

// Pages
import { HomePage } from '@/pages/HomePage';
import { PianoPage } from '@/pages/PianoPage';
import { GuitarPage } from '@/pages/GuitarPage';
import { DictionaryPage } from '@/pages/DictionaryPage';
import { TonalityPage } from '@/pages/TonalityPage';
import { AudioPage } from '@/pages/AudioPage';
import { TheoryPage } from '@/pages/TheoryPage';
import { ChordPage } from '@/pages/ChordPage';
import { NotesPage } from '@/pages/NotesPage';
import { NotePage } from '@/pages/NotePage';
import { ExercisesPage } from '@/pages/ExercisesPage';
import { GlossaryPage } from '@/pages/GlossaryPage';
import { PlansPage } from '@/pages/PlansPage';
import { WorkbooksPage } from '@/pages/WorkbooksPage';
import { AboutPage } from '@/pages/AboutPage';

export default function App() {
  const theme = useAppStore((s) => s.theme);
  const { route, param } = useRouter();

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [route, param]);

  const renderPage = () => {
    switch (route) {
      case 'home':
        return <HomePage />;
      case 'piano':
        return <PianoPage />;
      case 'guitarra':
        return <GuitarPage />;
      case 'dicionario':
        return <DictionaryPage />;
      case 'dicionario-tonalidade':
        return param ? <TonalityPage slug={param} /> : <DictionaryPage />;
      case 'audio':
        return <AudioPage />;
      case 'teoria':
        return <TheoryPage />;
      case 'notas':
        return <NotesPage />;
      case 'nota':
        return param ? <NotePage slug={param} /> : <NotesPage />;
      case 'exercicios':
        return <ExercisesPage moduloSlug={param} />;
      case 'glossario':
        return <GlossaryPage />;
      case 'planos':
        return <PlansPage />;
      case 'apostilas':
        return <WorkbooksPage />;
      case 'sobre':
        return <AboutPage />;
      case 'acorde':
        return param ? <ChordPage slug={param} /> : <DictionaryPage />;
      default:
        return <HomePage />;
    }
  };

  const offline = useOffline();
  const pwa = usePwa();

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300" style={{ WebkitTapHighlightColor: 'transparent' }}>
        <SkipToContent />
        <OfflineBanner isOffline={offline.isOffline} voltouOnline={offline.voltouOnline} />
        <Header />
        <main id="main-content" className="flex-1" tabIndex={-1}>{renderPage()}</main>
        <Footer />
        {pwa.podeInstalar && !pwa.instalado && (
          <InstallPrompt onInstalar={pwa.instalar} onDispensar={pwa.dispensar} isIOS={pwa.isIOS} />
        )}
      </div>
    </ErrorBoundary>
  );
}
