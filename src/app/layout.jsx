import AppShell from '../components/AppShell.jsx';
import '../styles/base.css';
import '../styles/home.css';
import '../styles/emprendimientos.css';
import '../styles/ceiba.css';
import '../styles/studio.css';
import '../styles/ecos.css';
import '../styles/hitos.css';

export const metadata = {
  title: 'NaturaTech LAC - Innovacion & Naturaleza',
  description:
    'Somos una iniciativa que articula innovacion sistemica para la naturaleza en America Latina y el Caribe. Enraizamos posibilidades.',
  icons: {
    icon: '/assets/images/logo.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
try {
  if (localStorage.getItem('naturatech-boot-loader-seen') === 'true') {
    document.documentElement.classList.add('boot-loader-seen');
  }
} catch (_) {}
            `.trim(),
          }}
        />
      </head>
      <body>
        <div id="boot-loader" aria-hidden="true">
          <div className="ring-wrap">
            <svg viewBox="0 0 100 100" aria-hidden="true">
              <circle className="ring-bg" cx="50" cy="50" r="45" />
              <circle className="ring-progress" cx="50" cy="50" r="45" />
            </svg>
            <img src="/assets/images/logo.svg" alt="NaturaTech LAC" />
          </div>
        </div>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
