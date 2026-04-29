import { useLocation } from 'react-router-dom';

const social = [
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/naturatechlac/', icon: '/assets/icons/footer/ig-icon.svg' },
  { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/naturatechlac', icon: '/assets/icons/footer/fb-icon.svg' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/naturatechlac/posts/?feedView=all', icon: '/assets/icons/footer/ln-icon.svg' },
  { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@NaturaTechLAC/featured', icon: '/assets/icons/footer/yt-icon.svg' },
  { id: 'whatsapp', label: 'WhatsApp', href: 'https://api.whatsapp.com/send/?phone&text=https://www.naturatech.org/somosceiba', icon: '/assets/icons/footer/wp-icon.svg' },
];

const footerLinks = [
  { to: '/',                label: 'INICIO' },
  { to: '/emprendimientos', label: 'EMPRESAS' },
  { to: '/ceiba',           label: 'CEIBA' },
  { to: '/studio',          label: 'STUDIO' },
  { to: '/ecos',            label: 'ECOS' },
];

const partnerLogos = [
  { id: 'bid-lab', label: 'BID Lab', src: '/assets/socios%20y%20aliados/ES/BID%20LAB.svg' },
  { id: 'c-minds', label: 'C Minds', src: '/assets/socios%20y%20aliados/ES/C%20Minds.svg' },
  { id: 'suecia', label: 'Suecia', src: '/assets/socios%20y%20aliados/ES/Suecia.svg' },
  { id: 'francia', label: 'Gobierno de Francia', src: '/assets/socios%20y%20aliados/ES/Francia.svg' },
  { id: 'amazonia', label: 'Amazonia', src: '/assets/socios%20y%20aliados/ES/amazonia.svg' },
  { id: 'climate', label: 'Climate Collective', src: '/assets/socios%20y%20aliados/ES/Climate.svg' },
  { id: 'bid', label: 'BID', src: '/assets/socios%20y%20aliados/ES/BID.svg' },
];

export default function Footer() {
  const location = useLocation();

  return (
    <footer className="footer-section">
      <section className="footer-partners" aria-label="Socios y aliados">
        <div className="footer-partners-label">
          <svg className="footer-partners-label-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M3 3h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 11 11 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span>SOCIOS Y ALIADOS</span>
        </div>
        <div className="footer-partners-marquee">
          <div className="footer-partners-track">
            {[0, 1].map((groupIndex) => (
              <div
                className="footer-partners-group"
                key={groupIndex}
                aria-hidden={groupIndex === 1 ? 'true' : undefined}
              >
                {partnerLogos.map((logo) => (
                  <div className="footer-partner-logo" key={`${groupIndex}-${logo.id}`}>
                    <img src={logo.src} alt={groupIndex === 0 ? logo.label : ''} loading="eager" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="footer-content">
        <div className="footer-left">
          <div className="footer-logo">
            <img src="/assets/images/logo.svg" alt="NaturaTech LAC" width="46" height="42" />
          </div>
          <p className="footer-description">
            En NaturaTech LAC nos impulsa el compromiso de descubrir y explorar las raíces que emergen de los territorios: sus historias y, sobre todo, su innovación.
          </p>
          <div className="footer-socials">
            {social.map((s) => (
              <a key={s.id} href={s.href} aria-label={s.label} className="social-icon css-glass">
                <img src={s.icon} alt="" width="20" height="20" loading="lazy" />
              </a>
            ))}
          </div>
        </div>
        <div className="footer-right">
          <nav className="footer-nav">
            {footerLinks.map((l) => (
              <a
                key={l.to} 
                href={l.to}
                className={`footer-link ${location.pathname === l.to ? 'active' : ''}`}
                aria-current={location.pathname === l.to ? 'page' : undefined}
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
