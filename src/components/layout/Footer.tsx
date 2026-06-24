import { Music, Heart } from 'lucide-react';
import { footerNav } from '@/config/navigation';
import { siteConfig } from '@/config/site';

const sectionTitles: Record<string, string> = {
  produto: 'Produto',
  recursos: 'Recursos',
  legal: 'Legal',
};

export function Footer() {
  return (
    <footer className="border-t border-border mt-20 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Music className="h-4 w-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent font-extrabold text-lg">
                {siteConfig.shortName}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {siteConfig.description}
            </p>
          </div>

          {/* Nav Sections */}
          {Object.entries(footerNav).map(([key, items]) => (
            <div key={key}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
                {sectionTitles[key] || key}
              </h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. Todos os direitos
            reservados.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Feito com <Heart className="h-3 w-3 text-destructive fill-destructive" /> para músicos
          </p>
        </div>
      </div>
    </footer>
  );
}
