'use client';

import { motion } from 'framer-motion';
import CeibaIcon from './CeibaIcon.jsx';

/**
 * Scene switcher for the CEIBA journey.
 *
 * Follows the reference bottom-nav: a pill rail where every item shows its
 * icon, and only the active one springs its label open. Adapted to this
 * project's stack — framer-motion is already a dependency, but lucide-react,
 * Tailwind and the `cn` helper are not, so icons come from CeibaIcon and the
 * styling is hand-written CSS in ceiba.css.
 *
 * `onDark` is driven by the journey's interpolated background rather than a
 * theme class, because that colour changes continuously as you scroll.
 */

const LABEL_WIDTH = 96;

export default function CeibaSceneNav({ items, activeIndex, onSelect, onDark, hint, label }) {
  return (
    <motion.nav
      className={'ceiba-scene-nav' + (onDark ? ' on-dark' : '')}
      aria-label={label}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
    >
      <span className="ceiba-scene-nav-hint">
        {hint}
        <CeibaIcon name="arrow" size={14} />
      </span>

      {items.map((item, index) => {
        const isActive = index === activeIndex;
        return (
          <motion.button
            key={item.title}
            type="button"
            whileTap={{ scale: 0.97 }}
            className={'ceiba-scene-nav-item' + (isActive ? ' is-active' : '')}
            onClick={() => onSelect(index)}
            aria-current={isActive ? 'true' : 'false'}
            // The label is animated away, so the icon alone has to carry the
            // accessible name when this item is not active.
            aria-label={item.title}
          >
            <CeibaIcon name={item.icon} size={20} />
            <motion.span
              className="ceiba-scene-nav-label"
              initial={false}
              animate={{
                width: isActive ? LABEL_WIDTH : 0,
                opacity: isActive ? 1 : 0,
                marginLeft: isActive ? 8 : 0,
              }}
              transition={{
                width: { type: 'spring', stiffness: 350, damping: 32 },
                opacity: { duration: 0.19 },
                marginLeft: { duration: 0.19 },
              }}
            >
              <span title={item.title}>
                <b>0{index + 1}</b>
                {item.title}
              </span>
            </motion.span>
          </motion.button>
        );
      })}
    </motion.nav>
  );
}
