'use client';

import LiquidGlass from 'liquid-glass-react';

/**
 * LiquidGlass renders four sibling divs that each occupy full size in flow,
 * which destroys alignment in inline / flex contexts. This wrapper sandwiches
 * the effect: a hidden duplicate of `children` provides the layout footprint,
 * the LiquidGlass effect is layered behind absolutely, and the real content
 * sits on top in an absolutely-positioned overlay.
 *
 * The hidden sizer is `aria-hidden`, `visibility: hidden`, and not focusable,
 * so it's invisible to assistive tech and ignores pointer events.
 */
export default function GlassFrame({
  children,
  cornerRadius = 999,
  padding = '0px',
  className = '',
  contentClassName = '',
  style = {},
  display = 'inline-block',
  displacementScale = 60,
  blurAmount = 0.08,
  saturation = 130,
  aberrationIntensity = 1.4,
  elasticity = 0.18,
  mode = 'standard',
}) {
  const radius = typeof cornerRadius === 'number' ? `${cornerRadius}px` : cornerRadius;
  const innerStyle = { padding, borderRadius: radius };

  return (
    <div
      className={`glass-frame ${className}`}
      style={{
        position: 'relative',
        display,
        isolation: 'isolate',
        borderRadius: radius,
        ...style,
      }}
    >
      {/* Sizer: invisible duplicate that defines the frame's layout box. */}
      <div
        aria-hidden="true"
        inert={true}
        className={`glass-frame__sizer ${contentClassName}`}
        style={{
          ...innerStyle,
          visibility: 'hidden',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {children}
      </div>

      {/* Glass effect layer (visual only, click-through). */}
      <div
        aria-hidden="true"
        className="glass-frame__effect"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          borderRadius: 'inherit',
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        <LiquidGlass
          cornerRadius={cornerRadius}
          padding="0px"
          displacementScale={displacementScale}
          blurAmount={blurAmount}
          saturation={saturation}
          aberrationIntensity={aberrationIntensity}
          elasticity={elasticity}
          mode={mode}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          <div style={{ display: 'block', width: '100%', height: '100%' }} />
        </LiquidGlass>
      </div>

      {/* Real content sits above the glass. */}
      <div
        className={`glass-frame__content ${contentClassName}`}
        style={{
          ...innerStyle,
          position: 'absolute',
          inset: 0,
          zIndex: 2,
        }}
      >
        {children}
      </div>
    </div>
  );
}
