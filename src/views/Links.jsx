const socialLinks = [
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/naturatechlac/', icon: '/assets/icons/footer/ig-icon.svg' },
  { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/naturatechlac', icon: '/assets/icons/footer/fb-icon.svg' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/naturatechlac/posts/?feedView=all', icon: '/assets/icons/footer/ln-icon.svg', featured: true },
  { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@NaturaTechLAC/featured', icon: '/assets/icons/footer/yt-icon.svg' },
  { id: 'whatsapp', label: 'WhatsApp', href: 'https://api.whatsapp.com/send/?phone&text=https://www.naturatech.org/somosceiba', icon: '/assets/icons/footer/wp-icon.svg' },
];

const linkItems = [
  { label: 'Regístrate en N500', href: 'https://500.naturatech.org', n500: true },
  { label: 'Documento en Ecos', badge: 'Nuevo', href: '/ecos' },
  { label: 'Último lanzamiento en "SOMOS RAÍCES"', href: 'https://www.youtube.com/@NaturaTechLAC/featured' },
  { label: 'Revive CEIBA 2025', href: '/ceiba' },
];

export default function Links() {
  return (
    <section className="links-page" aria-label="Links NaturaTech LAC">
      <div className="links-card">
        <div className="links-card-marker" aria-hidden="true" />

        <header className="links-header">
          <img className="links-cover" src="/assets/Links/portada-n500.webp" alt="" width="390" height="204" />
          <a className="links-logo" href="/" aria-label="Ir a naturatech.org">
            <img src="/assets/images/logo.svg" alt="" width="44" height="40" />
          </a>
          <h1>NATURATECH LAC</h1>
        </header>

        <a className="links-primary" href="/">
          Visita nuestro website
        </a>

        <nav className="links-socials" aria-label="Redes sociales">
          {socialLinks.map((item) => (
            <a
              className={`links-social ${item.featured ? 'is-featured' : ''}`}
              href={item.href}
              key={item.id}
              aria-label={item.label}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
            >
              <img src={item.icon} alt="" width="15" height="15" />
            </a>
          ))}
        </nav>

        <div className="links-list">
          {linkItems.map((item) => (
            <a
              className={`links-item${item.badge ? ' has-badge' : ''}${item.n500 ? ' is-n500' : ''}`}
              href={item.href}
              key={item.label}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {item.badge && <span className="links-item-badge">{item.badge}</span>}
              <span>{item.label}</span>
            </a>
          ))}
        </div>

        <footer className="links-footer">
          <a href="/" className="links-domain">www.naturatech.org</a>
          <div className="links-legal">
            <a href="/privacy-policy">Aviso de Privacidad</a>
            <a href="/terms-and-conditions">Términos y Condiciones</a>
          </div>
        </footer>
      </div>
    </section>
  );
}
