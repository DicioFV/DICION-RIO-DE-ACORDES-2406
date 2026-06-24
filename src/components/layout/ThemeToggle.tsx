import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors duration-200 cursor-pointer"
      aria-label="Alternar tema"
    >
      {theme === 'dark' ? (
        <Sun className="h-[18px] w-[18px] text-accent" />
      ) : (
        <Moon className="h-[18px] w-[18px] text-primary" />
      )}
    </button>
  );
}
