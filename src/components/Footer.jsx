import { NavLink } from 'react-router-dom';

const social = [
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/naturatechlac/', icon: '/assets/icons/footer/ig-icon.svg' },
  { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/naturatechlac', icon: '/assets/icons/footer/fb-icon.svg' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/naturatechlac/posts/?feedView=all', icon: '/assets/icons/footer/ln-icon.svg' },
  { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@NaturaTechLAC/featured', icon: '/assets/icons/footer/yt-icon.svg' },
  { id: 'whatsapp', label: 'WhatsApp', href: 'https://api.whatsapp.com/send/?phone&text=https://www.naturatech.org/somosceiba', icon: '/assets/icons/footer/wp-icon.svg' },
];

const footerLinks = [
  { to: '/',                label: 'INICIO' },
  { to: '/emprendimientos', label: 'EMPRENDIMIENTOS' },
  { to: '/ceiba',           label: 'CEIBA' },
  { to: '/studio',          label: 'PORTAFOLIO' },
  { to: '/ecos',            label: 'PUBLICACIONES' },
];

export default function Footer() {
  return (
    <footer className="footer-section">
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
              <NavLink 
                key={l.to} 
                to={l.to} 
                className={({ isActive }) => `footer-link ${isActive ? 'active' : ''}`}
                end={l.to === '/'}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
