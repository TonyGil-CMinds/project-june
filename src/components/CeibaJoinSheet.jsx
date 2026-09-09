'use client';

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';

import { useLanguage } from '../contexts/LanguageContext.jsx';
import { countries } from '../data/countries.js';
import { sectors as sectorOptions, ageRanges } from '../data/ceiba-form-options.js';
import { ceibaPhotos } from '../data/ceiba-photos.js';
import CeibaIcon from './CeibaIcon.jsx';

/**
 * Staged registration for the CEIBA community of practice.
 *
 * Layout follows the reference: form on the left, imagery on the right, one
 * question group at a time. Built on framer-motion (already a dependency) with
 * hand-written CSS — the reference's shadcn/Tailwind/TypeScript stack is not
 * wired up in this project and adding it would be a migration of its own.
 *
 * A centred card on desktop, a bottom sheet on phones, from the same markup.
 */

const EASE = [0.25, 1, 0.5, 1];
const VIEW_EASE = [0.26, 0.08, 0.25, 1];
const CLOSE_DRAG_PX = 110;
const CLOSE_DRAG_VELOCITY = 520;
const REQUEST_TIMEOUT_MS = 45000;
const SLIDE_MS = 4200;
const MAX_SECTORS = 6;

const TEXT_FIELDS = {
  name: { min: 2, max: 120 },
  email: { min: 5, max: 200 },
  organization: { min: 2, max: 160 },
  position: { min: 2, max: 120 },
  motivation: { min: 10, max: 2000 },
};
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Which questions live on which step, and therefore what each step validates. */
const STEPS = [
  { id: 'you', icon: 'people', fields: ['name', 'email'] },
  { id: 'place', icon: 'globe', fields: ['country', 'ageRange'] },
  { id: 'work', icon: 'connect', fields: ['organization', 'position', 'sectors'] },
  { id: 'why', icon: 'sprout', fields: ['motivation'] },
];

const EMPTY = {
  name: '', email: '', organization: '', position: '', motivation: '',
  country: '', ageRange: '', sectors: [],
};

/** Validates one field client-side, mirroring the API's rules. */
function fieldError(field, values) {
  if (field === 'country') return values.country ? null : 'required';
  if (field === 'ageRange') return values.ageRange ? null : 'required';
  if (field === 'sectors') {
    if (!values.sectors.length) return 'required';
    return values.sectors.length > MAX_SECTORS ? 'tooMany' : null;
  }

  const rule = TEXT_FIELDS[field];
  const raw = (values[field] || '').trim();
  if (!raw) return 'required';
  if (raw.length < rule.min) return 'tooShort';
  if (raw.length > rule.max) return 'tooLong';
  if (field === 'email' && !EMAIL_PATTERN.test(raw)) return 'invalid';
  return null;
}

/** Animates the panel to its content's height as steps swap. */
function useMeasuredHeight(deps) {
  const ref = useRef(null);
  const [height, setHeight] = useState(null);

  useLayoutEffect(() => {
    const node = ref.current;

    // Closed: drop the height so a reopen can't animate to the last step's
    // size. `open` must be in `deps` for this to fire at all — the component
    // itself never unmounts, only its content does.
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

export default function CeibaJoinSheet({ open, onClose, onJoined }) {
  const { t, lang } = useLanguage();
  const copy = t.ceiba.join;

  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [values, setValues] = useState(EMPTY);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [countryQuery, setCountryQuery] = useState('');
  const [slide, setSlide] = useState(0);
  const [isWide, setIsWide] = useState(false);

  const panelRef = useRef(null);
  const firstFieldRef = useRef(null);
  const titleId = useId();
  const dragControls = useDragControls();
  const [maxHeight, setMaxHeight] = useState(null);
  const [bottomInset, setBottomInset] = useState(0);
  const [contentRef, contentHeight] = useMeasuredHeight([
    open, stepIndex, done, fieldErrors, formError, lang, countryQuery, values.country,
  ]);

  const step = STEPS[stepIndex];
  const view = done ? 'success' : step.id;

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  /**
   * Which layout is live, because the two need different exits.
   *
   * `y: '100%'` reads correctly for the bottom-anchored sheet, but the desktop
   * card is centred vertically — translating it down by its own height leaves
   * it sitting in the lower half of the screen when AnimatePresence unmounts,
   * so the dismissal visibly cut off. The wide layout fades and scales instead.
   * Matches the 900px breakpoint in ceiba.css.
   */
  useEffect(() => {
    const query = window.matchMedia('(min-width: 900px)');
    const sync = () => setIsWide(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  /**
   * Caps the panel to the height that is actually visible.
   *
   * `visualViewport.height`, not `window.innerHeight`: on mobile innerHeight
   * includes the strip behind the browser's dynamic toolbars, so the cap came
   * out too generous — the panel then matched its full content height, leaving
   * nothing to scroll with the last fields under the browser chrome. The
   * bottom inset lifts the sheet clear of the on-screen keyboard, which is the
   * same problem but worse on a form.
   */
  useEffect(() => {
    const vv = window.visualViewport;

    const measure = () => {
      const visible = vv ? vv.height : window.innerHeight;
      setMaxHeight(Math.max(240, Math.round(visible) - 96));

      const covered = vv ? window.innerHeight - (vv.height + vv.offsetTop) : 0;
      setBottomInset(Math.max(0, Math.round(covered)));
    };

    measure();
    vv?.addEventListener('resize', measure);
    vv?.addEventListener('scroll', measure);
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);

    return () => {
      vv?.removeEventListener('resize', measure);
      vv?.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
    };
  }, []);

  /**
   * Warms the API as soon as the form opens.
   *
   * A cold Prisma client plus a connection to the pooled endpoint measured
   * 34.5s against 0.17s once warm. Firing it here moves that cost into the
   * time the person spends filling four steps, instead of onto the submit.
   */
  useEffect(() => {
    if (!open) return;
    // Fire and forget: the route answers 204 regardless, and a failure here
    // must not surface — the POST reports properly on its own.
    fetch('/api/ceiba/registro', { method: 'GET', cache: 'no-store' }).catch(() => {});
  }, [open]);

  // Reset on open, not on a timer after close: a timed reset races the exit
  // animation, so reopening quickly could leave the success view showing.
  useEffect(() => {
    if (!open) return;
    setStepIndex(0);
    setDone(false);
    setValues(EMPTY);
    setFieldErrors({});
    setFormError(null);
    setSubmitting(false);
    setCountryQuery('');
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

  // Focus the first input of each step so the keyboard flow never stalls.
  useEffect(() => {
    if (!open || done) return undefined;
    const id = window.setTimeout(() => firstFieldRef.current?.focus(), 360);
    return () => window.clearTimeout(id);
  }, [open, done, stepIndex]);

  // Photo slideshow. Paused while closed and under reduced motion.
  useEffect(() => {
    if (!open || reduceMotion) return undefined;
    const id = window.setInterval(
      () => setSlide((current) => (current + 1) % ceibaPhotos.length),
      SLIDE_MS
    );
    return () => window.clearInterval(id);
  }, [open, reduceMotion]);

  const setField = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    setFormError(null);
  };

  const toggleSector = (id) => {
    setValues((prev) => {
      const has = prev.sectors.includes(id);
      if (!has && prev.sectors.length >= MAX_SECTORS) return prev;
      return { ...prev, sectors: has ? prev.sectors.filter((s) => s !== id) : [...prev.sectors, id] };
    });
    setFieldErrors((prev) => (prev.sectors ? { ...prev, sectors: undefined } : prev));
    setFormError(null);
  };

  /** One POST attempt. Throws only when the outcome is genuinely unknown. */
  const postRegistration = useCallback(
    async (payload) => {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      try {
        const response = await fetch('/api/ceiba/registro', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, locale: lang }),
          signal: controller.signal,
        });
        return { status: response.status, data: await response.json().catch(() => ({})) };
      } finally {
        window.clearTimeout(timeout);
      }
    },
    [lang]
  );

  /**
   * Sends the registration, and never reports failure when the outcome is
   * unknown.
   *
   * A dropped or timed-out request does not mean the row wasn't written — the
   * server can commit and then fail to deliver the response. That was really
   * happening: a cold Prisma connection took 34s, the client aborted at 20s,
   * the user was told to check their connection, and the registration was in
   * the database all along.
   *
   * So an inconclusive attempt is retried once. Because `email` is unique,
   * whichever of the two lands first wins and the other comes back 409 — and
   * either answer means the person is registered. That turns the ambiguous case
   * into the correct outcome without asking the user to figure anything out.
   */
  const submit = useCallback(
    async (payload) => {
      setSubmitting(true);
      setFormError(null);

      const succeed = () => {
        onJoined?.(payload.email);
        setDone(true);
      };

      const report = ({ status, data }) => {
        if (status >= 200 && status < 300) return succeed();

        if (status === 422 && data.fields) {
          setFieldErrors(data.fields);
          setFormError(copy.errors.validation);
          // Send the user back to the earliest step that has a problem.
          const bad = STEPS.findIndex((s) => s.fields.some((f) => data.fields[f]));
          if (bad >= 0) setStepIndex(bad);
          return undefined;
        }
        if (status === 409) {
          // Already registered — that person is a member either way.
          onJoined?.(payload.email);
          setFieldErrors({ email: 'duplicate' });
          setFormError(copy.errors.duplicate);
          setStepIndex(0);
          return undefined;
        }
        setFormError(copy.errors.server);
        return undefined;
      };

      try {
        report(await postRegistration(payload));
      } catch {
        try {
          const retry = await postRegistration(payload);
          // 409 here means the first attempt did land after all.
          if (retry.status === 409) return succeed();
          report(retry);
        } catch {
          // Both attempts were inconclusive. Say so honestly instead of
          // claiming it failed, and point at the one action that resolves it.
          setFormError(copy.errors.inconclusive);
        }
      } finally {
        setSubmitting(false);
      }
    },
    [copy, onJoined, postRegistration]
  );

  const handleNext = (event) => {
    event.preventDefault();
    if (submitting) return;

    // Validate only this step's questions, so errors appear where they belong.
    const errors = {};
    step.fields.forEach((field) => {
      const error = fieldError(field, values);
      if (error) errors[field] = error;
    });

    if (Object.keys(errors).length) {
      setFieldErrors((prev) => ({ ...prev, ...errors }));
      setFormError(copy.errors.validation);
      return;
    }

    if (stepIndex < STEPS.length - 1) {
      setFormError(null);
      setStepIndex(stepIndex + 1);
      return;
    }

    submit(values);
  };

  const handleBack = () => {
    if (submitting || stepIndex === 0) return;
    setFormError(null);
    setStepIndex(stepIndex - 1);
  };

  const visibleCountries = useMemo(() => {
    const query = countryQuery.trim().toLowerCase();
    const matches = query
      ? countries.filter((entry) => entry[lang].toLowerCase().includes(query))
      : countries;
    // Long lists are scrolled, but capping keeps the panel from ballooning
    // before the user has typed anything.
    return matches.slice(0, query ? 40 : 12);
  }, [countryQuery, lang]);

  const selectedCountry = countries.find((entry) => entry.code === values.country);

  if (typeof document === 'undefined') return null;

  const sheetMotion = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0 } }
    : isWide
      ? {
          initial: { opacity: 0, scale: 0.97, y: 14 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.97, y: 14 },
          transition: { duration: 0.3, ease: EASE },
        }
      : {
          initial: { y: '100%' },
          animate: { y: 0 },
          exit: { y: '100%' },
          transition: { duration: 0.42, ease: EASE },
        };
  // Matched to the sheet so the overlay never clears before the card does.
  const overlayDuration = reduceMotion ? 0 : isWide ? 0.3 : 0.42;
  const viewTransition = reduceMotion ? { duration: 0 } : { duration: 0.27, ease: VIEW_EASE };
  const errorFor = (field) =>
    fieldErrors[field] ? copy.fieldErrors[fieldErrors[field]] || copy.fieldErrors.invalid : null;

  const textInput = (field, { isFirst = false, textarea = false } = {}) => {
    const invalid = Boolean(fieldErrors[field]);
    const Tag = textarea ? 'textarea' : 'input';
    return (
      <label key={field} className={'ceiba-join-field' + (invalid ? ' is-invalid' : '')}>
        <span className="ceiba-join-label">{copy.fields[field].label}</span>
        <Tag
          ref={isFirst ? firstFieldRef : undefined}
          className="ceiba-join-input"
          name={field}
          type={textarea ? undefined : field === 'email' ? 'email' : 'text'}
          rows={textarea ? 4 : undefined}
          value={values[field]}
          onChange={(event) => setField(field, event.target.value)}
          placeholder={copy.fields[field].placeholder}
          autoComplete={copy.fields[field].autoComplete || 'off'}
          aria-invalid={invalid || undefined}
          disabled={submitting}
        />
        {invalid && <span className="ceiba-join-field-error">{errorFor(field)}</span>}
      </label>
    );
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="ceiba-join-root" role="presentation">
          <motion.div
            className="ceiba-join-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: overlayDuration, ease: 'easeOut' }}
            onClick={onClose}
          />

          <motion.div
            className="ceiba-join-sheet"
            ref={panelRef}
            // `bottom`, not a transform: framer-motion owns the transform for
            // the slide-up and the drag, so lifting the sheet above the
            // keyboard has to use a property it doesn't touch.
            style={{ bottom: bottomInset }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={sheetMotion.initial}
            animate={sheetMotion.animate}
            exit={sheetMotion.exit}
            transition={sheetMotion.transition}
            // Drag-to-dismiss belongs to the phone sheet; the desktop card has
            // nowhere to be dragged to.
            drag={reduceMotion || isWide ? false : 'y'}
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

            <button type="button" className="ceiba-join-close" onClick={onClose} aria-label={copy.close}>
              <CeibaIcon name="close" size={18} />
            </button>

            <div className="ceiba-join-body">
              <motion.div
                className="ceiba-join-viewport"
                data-lenis-prevent
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
                      {done ? (
                        <div className="ceiba-join-success">
                          <div className="ceiba-join-success-mark" aria-hidden="true">
                            <CeibaIcon name="check" size={30} />
                          </div>
                          <h2 id={titleId} className="ceiba-join-title">{copy.success.title}</h2>
                          <p className="ceiba-join-subtitle">{copy.success.body}</p>
                          <button type="button" className="ceiba-join-submit" onClick={onClose}>
                            {copy.success.cta}
                          </button>
                        </div>
                      ) : (
                        <form className="ceiba-join-form" onSubmit={handleNext} noValidate>
                          <header className="ceiba-join-header">
                            <p className="ceiba-join-step">
                              <CeibaIcon name={step.icon} size={16} />
                              <span>{copy.steps[step.id].eyebrow}</span>
                              <span className="ceiba-join-step-count">
                                {stepIndex + 1} / {STEPS.length}
                              </span>
                            </p>
                            <h2 id={titleId} className="ceiba-join-title">
                              {copy.steps[step.id].title}
                            </h2>
                            <p className="ceiba-join-subtitle">{copy.steps[step.id].hint}</p>
                          </header>

                          <ol className="ceiba-join-progress" aria-label={copy.progressLabel}>
                            {STEPS.map((entry, index) => (
                              <li
                                key={entry.id}
                                className={
                                  index === stepIndex ? 'is-current' : index < stepIndex ? 'is-done' : ''
                                }
                                aria-current={index === stepIndex ? 'step' : undefined}
                              />
                            ))}
                          </ol>

                          <div className="ceiba-join-fields">
                            {step.id === 'you' && (
                              <>
                                {textInput('name', { isFirst: true })}
                                {textInput('email')}
                              </>
                            )}

                            {step.id === 'place' && (
                              <>
                                <div
                                  className={
                                    'ceiba-join-field' + (fieldErrors.country ? ' is-invalid' : '')
                                  }
                                >
                                  <span className="ceiba-join-label">{copy.fields.country.label}</span>
                                  <div className="ceiba-join-search">
                                    <CeibaIcon name="search" size={16} />
                                    <input
                                      ref={firstFieldRef}
                                      className="ceiba-join-input"
                                      type="text"
                                      inputMode="search"
                                      autoComplete="country-name"
                                      role="combobox"
                                      aria-expanded="true"
                                      aria-controls="ceiba-country-list"
                                      placeholder={copy.fields.country.placeholder}
                                      value={countryQuery}
                                      onChange={(event) => setCountryQuery(event.target.value)}
                                      onKeyDown={(event) => {
                                        // Enter picks the top match instead of submitting the step.
                                        if (event.key === 'Enter' && visibleCountries.length) {
                                          event.preventDefault();
                                          setField('country', visibleCountries[0].code);
                                          setCountryQuery('');
                                        }
                                      }}
                                      disabled={submitting}
                                    />
                                    {selectedCountry && (
                                      <span className="ceiba-join-chosen">
                                        <span className={`fi fi-${selectedCountry.code}`} aria-hidden="true" />
                                        {selectedCountry[lang]}
                                      </span>
                                    )}
                                  </div>

                                  <ul className="ceiba-join-country-list" id="ceiba-country-list" role="listbox">
                                    {visibleCountries.map((entry) => (
                                      <li key={entry.code}>
                                        <button
                                          type="button"
                                          role="option"
                                          aria-selected={values.country === entry.code}
                                          className={
                                            'ceiba-join-country' +
                                            (values.country === entry.code ? ' is-selected' : '')
                                          }
                                          onClick={() => {
                                            setField('country', entry.code);
                                            setCountryQuery('');
                                          }}
                                          disabled={submitting}
                                        >
                                          <span className={`fi fi-${entry.code}`} aria-hidden="true" />
                                          {entry[lang]}
                                        </button>
                                      </li>
                                    ))}
                                    {!visibleCountries.length && (
                                      <li className="ceiba-join-country-empty">{copy.noCountryMatch}</li>
                                    )}
                                  </ul>
                                  {fieldErrors.country && (
                                    <span className="ceiba-join-field-error">{errorFor('country')}</span>
                                  )}
                                </div>

                                <fieldset
                                  className={
                                    'ceiba-join-field ceiba-join-choices' +
                                    (fieldErrors.ageRange ? ' is-invalid' : '')
                                  }
                                >
                                  <legend className="ceiba-join-label">{copy.fields.ageRange.label}</legend>
                                  <div className="ceiba-join-chips">
                                    {ageRanges.map((range) => (
                                      <label
                                        key={range.id}
                                        className={
                                          'ceiba-join-chip' +
                                          (values.ageRange === range.id ? ' is-selected' : '')
                                        }
                                      >
                                        <input
                                          type="radio"
                                          name="ageRange"
                                          value={range.id}
                                          checked={values.ageRange === range.id}
                                          onChange={() => setField('ageRange', range.id)}
                                          disabled={submitting}
                                        />
                                        {range[lang]}
                                      </label>
                                    ))}
                                  </div>
                                  {fieldErrors.ageRange && (
                                    <span className="ceiba-join-field-error">{errorFor('ageRange')}</span>
                                  )}
                                </fieldset>
                              </>
                            )}

                            {step.id === 'work' && (
                              <>
                                {textInput('organization', { isFirst: true })}
                                {textInput('position')}
                                <fieldset
                                  className={
                                    'ceiba-join-field ceiba-join-choices' +
                                    (fieldErrors.sectors ? ' is-invalid' : '')
                                  }
                                >
                                  <legend className="ceiba-join-label">
                                    {copy.fields.sectors.label}
                                    <span className="ceiba-join-label-hint">
                                      {copy.fields.sectors.hint}
                                    </span>
                                  </legend>
                                  <div className="ceiba-join-chips">
                                    {sectorOptions.map((option) => {
                                      const checked = values.sectors.includes(option.id);
                                      const full = !checked && values.sectors.length >= MAX_SECTORS;
                                      return (
                                        <label
                                          key={option.id}
                                          className={
                                            'ceiba-join-chip' +
                                            (checked ? ' is-selected' : '') +
                                            (full ? ' is-disabled' : '')
                                          }
                                        >
                                          <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => toggleSector(option.id)}
                                            disabled={submitting || full}
                                          />
                                          {option[lang]}
                                        </label>
                                      );
                                    })}
                                  </div>
                                  {fieldErrors.sectors && (
                                    <span className="ceiba-join-field-error">{errorFor('sectors')}</span>
                                  )}
                                </fieldset>
                              </>
                            )}

                            {step.id === 'why' && textInput('motivation', { isFirst: true, textarea: true })}
                          </div>

                          {formError && (
                            <p className="ceiba-join-error" role="alert">{formError}</p>
                          )}

                          <div className="ceiba-join-actions">
                            {stepIndex > 0 && (
                              <button
                                type="button"
                                className="ceiba-join-back"
                                onClick={handleBack}
                                disabled={submitting}
                              >
                                <CeibaIcon name="arrow" size={16} style={{ transform: 'rotate(180deg)' }} />
                                {copy.back}
                              </button>
                            )}
                            <button
                              type="submit"
                              className={'ceiba-join-submit' + (submitting ? ' is-submitting' : '')}
                              disabled={submitting}
                              aria-busy={submitting || undefined}
                            >
                              {submitting && <span className="ceiba-join-spinner" aria-hidden="true" />}
                              {submitting
                                ? copy.submitting
                                : stepIndex === STEPS.length - 1
                                  ? copy.submit
                                  : copy.next}
                              {!submitting && <CeibaIcon name="arrow" size={16} />}
                            </button>
                          </div>

                          {/* Announced to screen readers, which never see the spinner. */}
                          <p className="ceiba-join-status" role="status" aria-live="polite">
                            {submitting ? copy.submitting : ''}
                          </p>

                          <p className="ceiba-join-note">{copy.note}</p>
                        </form>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Slideshow of existing CEIBA photography. Desktop only: on a
                  phone the sheet needs every pixel for the questions. */}
              <div className="ceiba-join-media" aria-hidden="true">
                <AnimatePresence initial={false}>
                  <motion.img
                    key={slide}
                    src={ceibaPhotos[slide].src}
                    alt=""
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.9, ease: 'easeOut' }}
                  />
                </AnimatePresence>
                <span className="ceiba-join-media-caption">CEIBA 2025 · Cali, Colombia</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
