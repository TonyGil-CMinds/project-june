'use client';

import GlassFrame from './GlassFrame.jsx';

/**
 * SafeLiquidGlass — a thin wrapper around GlassFrame that catches render
 * errors from the liquid-glass-react WebGL pipeline and falls back to a
 * pure-CSS glass surface instead of crashing the whole page.
 */
export default function SafeLiquidGlass({
  children,
  cornerRadius = 28,
  padding = '0px',
  className = '',
  displacementScale = 50,
  blurAmount = 0.08,
  saturation = 130,
  aberrationIntensity = 1.4,
  elasticity = 0.18,
  ...rest
}) {
  return (
    <GlassFrame
      cornerRadius={cornerRadius}
      padding={padding}
      className={className}
      displacementScale={displacementScale}
      blurAmount={blurAmount}
      saturation={saturation}
      aberrationIntensity={aberrationIntensity}
      elasticity={elasticity}
      {...rest}
    >
      {children}
    </GlassFrame>
  );
}
