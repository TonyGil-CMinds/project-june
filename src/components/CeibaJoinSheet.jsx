'use client';

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';

import { useLanguage } from '../contexts/LanguageContext.jsx';

/**
 * Bottom sheet for CEIBA community sign-ups.
 *
 * The motion is modelled on the reference drawer: the panel rises from the
 * bottom, its height animates as the view swaps, and each view cross-fades with
 * a slight scale. Built on framer-motion (already a dependency) rather than
 * vaul/lucide/react-icons, none of which this project has — and the styling is
 * hand-written CSS with the site's tokens, since Tailwind isn't wired up here.
 */

const EASE = [0.25, 1, 0.5, 1];
const VIEW_EASE = [0.26, 0.08, 0.25, 1];
const FIELDS = ['name', 'email', 'organization', 'position', 'motivation'];
const CLOSE_DRAG_PX = 110;
const CLOSE_DRAG_VELOCITY = 520;

/** Animates the panel to its content's height as views swap. */
function useMeasuredHeight(deps) {
  const ref = useRef(null);
  const [height, setHeight] = useState(null);

  useLayoutEffect(() => {
    const node = ref.current;

    // Closed: drop the height so a reopen can't animate to the last view's
    // size. `open` must be in `deps` for this to fire at all — the sheet
    // component itself never unmounts, only its content does.
    if (!node) {
      setHeight(null);
      return undefined;
    }

    const measure = () => setHeight(node.offsetHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return [ref, height];
}

export default function CeibaJoinSheet({ open, onClose }) {
  const { t, lang } = useLanguage();
  const copy = t.ceiba.join;

  const [view, setView] = useState('form');
  const [values, setValues] = useState(() => Object.fromEntries(FIELDS.map((f) => [f, ''])));
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const panelRef = useRef(null);
  const firstFieldRef = useRef(null);
  const titleId = useId();
  const dragControls = useDragControls();
  const [contentRef, contentHeight] = useMeasuredHeight([open, view, fieldErrors, formError, lang]);
  const [maxHeight, setMaxHeight] = useState(null);

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Leaves room for the grab handle and the sheet's bottom margin.
  useEffect(() => {
    const measure = () => setMaxHeight(window.innerHeight - 96);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Reset on open, not on a timer after close: a timed reset races the exit
  // animation, so reopening quickly could leave the success view showing.
  // Resetting here also keeps the closing sheet visually intact on its way out.
  useEffect(() => {
    if (!open) return;
    setView('form');
    setValues(Object.fromEntries(FIELDS.map((f) => [f, ''])));
    setFieldErrors({});
    setFormError(null);
    setSubmitting(false);
  }, [open]);

  // Lock scrolling: Lenis drives the page, so pausing it is what actually stops
  // the wheel; the body rule only catches native scroll on touch.
  useEffect(() => {
    if (!open) return undefined;

    const lenis = window.naturatechLenis;
    lenis?.stop();
    document.documentElement.classList.add('ceiba-join-is-open');

    return () => {
      lenis?.start();
      document.documentElement.classList.remove('ceiba-join-is-open');
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || view !== 'form') return undefined;
    const id = window.setTimeout(() => firstFieldRef.current?.focus(), 380);
    return () => window.clearTimeout(id);
  }, [open, view]);

  const setField = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    setFormError(null);
  };

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (submitting) return;

      setSubmitting(true);
      setFormError(null);
      setFieldErrors({});

      try {
        const response = await fetch('/api/ceiba/registro', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...values, locale: lang }),
        });
        const payload = await response.json().catch(() => ({}));

        if (response.ok) {
          setView('success');
          return;
        }

        if (response.status === 422 && payload.fields) {
          setFieldErrors(payload.fields);
          setFormError(copy.errors.validation);
          return;
        }
        if (response.status === 409) {
          setFieldErrors({ email: 'duplicate' });
          setFormError(copy.errors.duplicate);
          return;
        }
        setFormError(copy.errors.server);
      } catch {
        setFormError(copy.errors.network);
      } finally {
        setSubmitting(false);
      }
    },
    [submitting, values, lang, copy]
  );

  if (typeof document === 'undefined') return null;

  const transition = reduceMotion ? { duration: 0 } : { duration: 0.42, ease: EASE };
  const viewTransition = reduceMotion ? { duration: 0 } : { duration: 0.27, ease: VIEW_EASE };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="ceiba-join-root" role="presentation">
          <motion.div
            className="ceiba-join-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
            onClick={onClose}
          />

          <motion.div
            className="ceiba-join-sheet"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={transition}
            drag={reduceMotion ? false : 'y'}
            dragControls={dragControls}
            // Drag only starts from the grab handle: the form scrolls
            // internally, and a sheet-wide drag listener would hijack that.
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(event, info) => {
              if (info.offset.y > CLOSE_DRAG_PX || info.velocity.y > CLOSE_DRAG_VELOCITY) onClose();
            }}
          >
            <div
              className="ceiba-join-grabber"
              onPointerDown={(event) => dragControls.start(event)}
            >
              <span className="ceiba-join-grabber-bar" aria-hidden="true" />
            </div>

            <button
              type="button"
              className="ceiba-join-close"
              onClick={onClose}
              aria-label={copy.close}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <motion.div
              className="ceiba-join-viewport"
              animate={
                contentHeight != null
                  ? { height: maxHeight ? Math.min(contentHeight, maxHeight) : contentHeight }
                  : {}
              }
              transition={viewTransition}
            >
              <div ref={contentRef}>
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={view}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={viewTransition}
                  >
                    {view === 'form' ? (
                      <form className="ceiba-join-form" onSubmit={handleSubmit} noValidate>
                        <header className="ceiba-join-header">
                          <h2 id={titleId} className="ceiba-join-title">
                            {copy.title}
                          </h2>
                          <p className="ceiba-join-subtitle">{copy.subtitle}</p>
                        </header>

                        <div className="ceiba-join-fields">
                          {FIELDS.map((field) => {
                            const isTextarea = field === 'motivation';
                            const invalid = Boolean(fieldErrors[field]);
                            const Tag = isTextarea ? 'textarea' : 'input';

                            return (
                              <label
                                key={field}
                                className={
                                  'ceiba-join-field' +
                                  (isTextarea ? ' is-textarea' : '') +
                                  (invalid ? ' is-invalid' : '')
                                }
                              >
                                <span className="ceiba-join-label">{copy.fields[field].label}</span>
                                <Tag
                                  ref={field === 'name' ? firstFieldRef : undefined}
                                  className="ceiba-join-input"
                                  name={field}
                                  type={isTextarea ? undefined : field === 'email' ? 'email' : 'text'}
                                  rows={isTextarea ? 3 : undefined}
                                  value={values[field]}
                                  onChange={(event) => setField(field, event.target.value)}
                                  placeholder={copy.fields[field].placeholder}
                                  autoComplete={copy.fields[field].autoComplete || 'off'}
                                  aria-invalid={invalid || undefined}
                                  disabled={submitting}
                                />
                                {invalid && (
                                  <span className="ceiba-join-field-error">
                                    {copy.fieldErrors[fieldErrors[field]] || copy.fieldErrors.invalid}
                                  </span>
                                )}
                              </label>
                            );
                          })}
                        </div>

                        {formError && (
                          <p className="ceiba-join-error" role="alert">
                            {formError}
                          </p>
                        )}

                        <button type="submit" className="ceiba-join-submit" disabled={submitting}>
                          {submitting ? copy.submitting : copy.submit}
                          {!submitting && (
                            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                              <path
                                d="M5 12h14M12 5l7 7-7 7"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </button>

                        <p className="ceiba-join-note">{copy.note}</p>
                      </form>
                    ) : (
                      <div className="ceiba-join-success">
                        <div className="ceiba-join-success-mark" aria-hidden="true">
                          <svg width="30" height="30" viewBox="0 0 24 24">
                            <path
                              d="M20 6L9 17l-5-5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <h2 id={titleId} className="ceiba-join-title">
                          {copy.success.title}
                        </h2>
                        <p className="ceiba-join-subtitle">{copy.success.body}</p>
                        <button type="button" className="ceiba-join-submit" onClick={onClose}>
                          {copy.success.cta}
                        </button>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
