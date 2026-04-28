import SafeLiquidGlass from '../components/SafeLiquidGlass.jsx';
import '../styles/placeholder.css';

export default function Ecos() {
  return (
    <section className="placeholder-section">
      <SafeLiquidGlass
        displacementScale={50}
        blurAmount={0.08}
        saturation={130}
        aberrationIntensity={1.4}
        elasticity={0.18}
        cornerRadius={28}
        padding="0px"
      >
        <div className="placeholder-content">
          <img src="/assets/programs-logos/ecos.svg" alt="Ecos Logo" className="placeholder-logo" />
          <h2 className="placeholder-title">ECOS</h2>
          <p className="placeholder-text">En construcción</p>
          <div className="placeholder-dots"><span/><span/><span/></div>
        </div>
      </SafeLiquidGlass>
    </section>
  );
}
