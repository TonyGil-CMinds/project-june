'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

const filters = [
  { id: 'all', label: 'Todas' },
  { id: 'day-1', label: 'Día 1', day: 1 },
  { id: 'day-2', label: 'Día 2', day: 2 },
  { id: 'day-3', label: 'Día 3', day: 3 },
  { id: 'day-4', label: 'Día 4', day: 4 },
];

const dateByDay = {
  1: 'Septiembre 30, 2025',
  2: 'Octubre 1, 2025',
  3: 'Octubre 2, 2025',
  4: 'Octubre 3, 2025',
};

function formatCounter(value, total) {
  return `${String(value).padStart(2, '0')}/${String(total).padStart(2, '0')}`;
}

function getThumbnailWindow(images, activeIndex) {
  if (images.length <= 4) return images;
  const start = Math.min(Math.max(activeIndex - 1, 0), images.length - 4);
  return images.slice(start, start + 4);
}

function splitText(text) {
  return text.split('').map((character, index) => ({
    character: character === ' ' ? '\u00a0' : character,
    key: `${character}-${index}`,
  }));
}

function GalleryImage({ image, className, onLoad, srcKey = 'src', priority = false }) {
  const [loaded, setLoaded] = useState(false);
  const src = image[srcKey] || image.src;

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  return (
    <>
      <span className={`ceiba-gallery-skeleton ${loaded ? 'is-hidden' : ''}`} aria-hidden="true" />
      <img
        className={className}
        src={src}
        alt=""
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'low'}
        onLoad={() => {
          setLoaded(true);
          onLoad?.(image.id);
        }}
      />
    </>
  );
}

export default function GaleriaCeiba({ images }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeId, setActiveId] = useState(images[0]?.id);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxOrigin, setLightboxOrigin] = useState(null);
  const [actionsVisible, setActionsVisible] = useState(false);
  const [loadedImages, setLoadedImages] = useState(() => new Set());
  const stepRefs = useRef(new Map());
  const filterButtonRefs = useRef(new Map());
  const bgRef = useRef(null);
  const logoRef = useRef(null);
  const lightboxRef = useRef(null);
  const lightboxPanelRef = useRef(null);
  const dateRef = useRef(null);
  const thumbsRef = useRef(null);
  const filterRef = useRef(null);
  const indicatorRef = useRef(null);
  const previousDayRef = useRef(null);

  const visibleImages = useMemo(() => {
    const filter = filters.find((item) => item.id === activeFilter);
    if (!filter?.day) return images;
    return images.filter((image) => image.day === filter.day);
  }, [activeFilter, images]);

  const activeImage = visibleImages.find((image) => image.id === activeId) || visibleImages[0] || images[0];
  const activeIndex = Math.max(visibleImages.findIndex((image) => image.id === activeImage?.id), 0);
  const thumbnails = getThumbnailWindow(visibleImages, activeIndex);
  const activeDate = dateByDay[activeImage?.day] || activeImage?.date || 'Septiembre 30, 2025';
  const bgLoaded = loadedImages.has(activeImage?.id);

  const markLoaded = (imageId) => {
    setLoadedImages((current) => {
      if (current.has(imageId)) return current;
      const next = new Set(current);
      next.add(imageId);
      return next;
    });
  };

  useEffect(() => {
    const imageId = new URLSearchParams(window.location.search).get('imagen');
    if (imageId && images.some((image) => image.id === imageId)) {
      const image = images.find((item) => item.id === imageId);
      setActiveFilter(image?.day ? `day-${image.day}` : 'all');
      setActiveId(imageId);
      setActionsVisible(true);
    }
  }, [images]);

  useEffect(() => {
    if (!visibleImages.some((image) => image.id === activeId)) {
      setActiveId(visibleImages[0]?.id);
    }
  }, [activeId, visibleImages]);

  useEffect(() => {
    const steps = Array.from(stepRefs.current.values()).filter(Boolean);
    if (!steps.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target.dataset.imageId) {
          setActiveId(visibleEntry.target.dataset.imageId);
        }
      },
      { threshold: [0.42, 0.64, 0.82], rootMargin: '-22% 0px -30% 0px' },
    );

    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, [visibleImages]);

  useEffect(() => {
    if (!activeImage) return;

    gsap.killTweensOf([bgRef.current, thumbsRef.current]);
    gsap.fromTo(
      bgRef.current,
      { autoAlpha: 0.72, scale: 1.035, filter: 'blur(12px) saturate(0.9) contrast(1.02)' },
      { autoAlpha: 1, scale: 1.01, filter: 'blur(0px) saturate(0.96) contrast(1.03)', duration: 0.72, ease: 'power4.out' },
    );
    gsap.fromTo(
      thumbsRef.current?.children || [],
      { y: 16, autoAlpha: 0, filter: 'blur(8px)' },
      { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.48, ease: 'power3.out', stagger: 0.035 },
    );
  }, [activeImage?.id]);

  useEffect(() => {
    if (!lightboxImage || !lightboxOrigin || !lightboxRef.current || !lightboxPanelRef.current) return undefined;

    const overlay = lightboxRef.current;
    const panel = lightboxPanelRef.current;
    const finalRect = panel.getBoundingClientRect();
    const scaleX = lightboxOrigin.width / finalRect.width;
    const scaleY = lightboxOrigin.height / finalRect.height;
    const x = lightboxOrigin.left + lightboxOrigin.width / 2 - (finalRect.left + finalRect.width / 2);
    const y = lightboxOrigin.top + lightboxOrigin.height / 2 - (finalRect.top + finalRect.height / 2);

    gsap.killTweensOf([overlay, panel]);
    gsap.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.28, ease: 'power3.out' });
    gsap.fromTo(
      panel,
      {
        x,
        y,
        scaleX,
        scaleY,
        autoAlpha: 1,
        filter: 'blur(8px)',
        borderRadius: 0,
      },
      {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        filter: 'blur(0px)',
        borderRadius: 18,
        duration: 0.58,
        ease: 'power4.inOut',
      },
    );

    return undefined;
  }, [lightboxImage, lightboxOrigin]);

  useEffect(() => {
    if (!dateRef.current || previousDayRef.current === activeImage?.day) return;
    previousDayRef.current = activeImage?.day;

    const chars = dateRef.current.querySelectorAll('.ceiba-gallery-date-char');
    gsap.killTweensOf(chars);
    gsap.fromTo(
      chars,
      { yPercent: 72, autoAlpha: 0, filter: 'blur(10px)' },
      { yPercent: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.58, ease: 'power4.out', stagger: 0.018 },
    );
  }, [activeImage?.day, activeDate]);

  useEffect(() => {
    const moveIndicator = () => {
      const container = filterRef.current;
      const indicator = indicatorRef.current;
      const activeButton = filterButtonRefs.current.get(activeFilter);
      if (!container || !indicator || !activeButton) return;

      gsap.to(indicator, {
        x: activeButton.offsetLeft - container.scrollLeft,
        width: activeButton.offsetWidth,
        duration: 0.52,
        ease: 'power4.out',
      });
    };

    moveIndicator();
    window.addEventListener('resize', moveIndicator);
    filterRef.current?.addEventListener('scroll', moveIndicator, { passive: true });

    return () => {
      window.removeEventListener('resize', moveIndicator);
      filterRef.current?.removeEventListener('scroll', moveIndicator);
    };
  }, [activeFilter]);

  const smoothScrollToImage = (imageId) => {
    const target = stepRefs.current.get(imageId);
    const scroller = document.scrollingElement || document.documentElement;
    if (!target || !scroller) return;

    const targetY = window.scrollY + target.getBoundingClientRect().top - (window.innerHeight - target.offsetHeight) / 2;
    gsap.to(scroller, {
      scrollTop: Math.max(0, targetY),
      duration: 0.86,
      ease: 'power4.inOut',
    });
  };

  const selectImage = (imageId, shouldScroll = true) => {
    setActiveId(imageId);
    setActionsVisible(true);

    if (shouldScroll) {
      smoothScrollToImage(imageId);
    }
  };

  const openMobileImage = (image, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setActiveId(image.id);
    setActionsVisible(true);
    setLightboxOrigin({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    });
    setLightboxImage(image);
  };

  const closeLightbox = () => {
    if (!lightboxRef.current || !lightboxPanelRef.current) {
      setLightboxImage(null);
      return;
    }

    const finalRect = lightboxPanelRef.current.getBoundingClientRect();
    const origin = lightboxOrigin || finalRect;
    const scaleX = origin.width / finalRect.width;
    const scaleY = origin.height / finalRect.height;
    const x = origin.left + origin.width / 2 - (finalRect.left + finalRect.width / 2);
    const y = origin.top + origin.height / 2 - (finalRect.top + finalRect.height / 2);

    gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        setLightboxImage(null);
        setLightboxOrigin(null);
      },
    })
      .to(lightboxPanelRef.current, {
        x,
        y,
        scaleX,
        scaleY,
        borderRadius: 0,
        filter: 'blur(7px)',
        duration: 0.46,
        ease: 'power4.inOut',
      }, 0)
      .to(lightboxRef.current, { autoAlpha: 0, duration: 0.3 }, 0.16);
  };

  const animateLogoHover = (isHovered) => {
    gsap.to(logoRef.current, {
      scale: isHovered ? 1.08 : 1,
      rotate: isHovered ? 4 : 0,
      borderColor: isHovered ? 'rgba(201, 232, 42, 0.52)' : 'rgba(246, 248, 238, 0.2)',
      duration: isHovered ? 0.42 : 0.34,
      ease: 'power4.out',
    });
  };

  const handleFilter = (filterId) => {
    const filter = filters.find((item) => item.id === filterId);
    const nextImages = filter?.day ? images.filter((image) => image.day === filter.day) : images;
    const nextImageId = nextImages[0]?.id;

    setActiveFilter(filterId);
    setActionsVisible(false);
    setActiveId(nextImageId);

    window.requestAnimationFrame(() => smoothScrollToImage(nextImageId));
  };

  const handleDownload = async () => {
    if (!activeImage) return;

    const link = document.createElement('a');
    let objectUrl = null;
    const downloadSrc = activeImage.originalSrc || activeImage.src;

    try {
      const response = await fetch(downloadSrc);
      const blob = await response.blob();
      objectUrl = URL.createObjectURL(blob);
      link.href = objectUrl;
    } catch (_) {
      link.href = downloadSrc;
    } finally {
      link.download = activeImage.filename || `ceiba-2025-${activeImage.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      if (objectUrl) {
        window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1200);
      }
    }
  };

  const handleShare = async () => {
    if (!activeImage) return;

    const shareUrl = `${window.location.origin}/galeriaceiba?imagen=${encodeURIComponent(activeImage.id)}`;
    const shareData = {
      title: 'Galería CEIBA 2025',
      text: `${activeImage.title} - ${dateByDay[activeImage.day] || activeDate}`,
      url: shareUrl,
    };

    try {
      const response = await fetch(activeImage.originalSrc || activeImage.src);
      const blob = await response.blob();
      const file = new File([blob], activeImage.filename || 'ceiba-2025.jpg', { type: blob.type || 'image/jpeg' });

      if (navigator.canShare?.({ files: [file] }) && navigator.share) {
        await navigator.share({ ...shareData, files: [file] });
        return;
      }
    } catch (_) {}

    if (navigator.share) {
      await navigator.share(shareData).catch(() => {});
      return;
    }

    await navigator.clipboard?.writeText(shareUrl).catch(() => {
      window.prompt('Copia el enlace de la imagen', shareUrl);
    });
  };

  if (!activeImage) {
    return null;
  }

  return (
    <section className="ceiba-gallery-page" aria-label="Galería CEIBA 2025">
      <div className={`ceiba-gallery-stage ${bgLoaded ? 'is-loaded' : ''}`} aria-hidden="true">
        <span className="ceiba-gallery-skeleton" />
        <img
          ref={bgRef}
          className="ceiba-gallery-bg"
          src={activeImage.src}
          alt=""
          decoding="async"
          fetchPriority="high"
          onLoad={() => markLoaded(activeImage.id)}
        />
        <div className="ceiba-gallery-gradient ceiba-gallery-gradient--top" />
        <div className="ceiba-gallery-gradient ceiba-gallery-gradient--bottom" />
      </div>

      <div className="ceiba-gallery-mobile-grid" aria-label="Imágenes de CEIBA 2025">
        {visibleImages.map((image) => (
          <button
            type="button"
            className="ceiba-gallery-mobile-tile"
            key={image.id}
            onClick={(event) => openMobileImage(image, event)}
            aria-label={`Ver imagen ${image.filename}`}
          >
            <GalleryImage image={image} srcKey="gridSrc" onLoad={markLoaded} />
          </button>
        ))}
      </div>

      <header className="ceiba-gallery-topbar">
        <a className="ceiba-gallery-back" href="/ceiba" aria-label="Regresar a CEIBA">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M10.5 4.5 6 9l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Regresar</span>
        </a>

        <a
          className="ceiba-gallery-logo"
          href="/"
          ref={logoRef}
          onMouseEnter={() => animateLogoHover(true)}
          onMouseLeave={() => animateLogoHover(false)}
          onFocus={() => animateLogoHover(true)}
          onBlur={() => animateLogoHover(false)}
          aria-label="Ir al inicio de NaturaTech LAC"
        >
          <img src="/assets/images/logo.svg" alt="" width="34" height="31" />
        </a>

        <div className="ceiba-gallery-counter" aria-label={`Imagen ${activeIndex + 1} de ${visibleImages.length}`}>
          {formatCounter(activeIndex + 1, visibleImages.length)}
        </div>
      </header>

      <div className="ceiba-gallery-scroll">
        {visibleImages.map((image) => (
          <article
            className="ceiba-gallery-scroll-step"
            data-image-id={image.id}
            key={image.id}
            ref={(node) => {
              if (node) stepRefs.current.set(image.id, node);
              else stepRefs.current.delete(image.id);
            }}
            aria-label={image.filename}
          />
        ))}
      </div>

      <div className="ceiba-gallery-chrome">
        <p className="ceiba-gallery-date" ref={dateRef} aria-label={activeDate}>
          {splitText(activeDate).map(({ character, key }) => (
            <span className="ceiba-gallery-date-char" key={key} aria-hidden="true">
              {character}
            </span>
          ))}
        </p>

        <div className="ceiba-gallery-thumbnails" ref={thumbsRef} aria-label="Selector de imágenes">
          {thumbnails.map((image) => (
            <button
              type="button"
              className={`ceiba-gallery-thumb ${image.id === activeImage.id ? 'is-active' : ''}`}
              key={image.id}
              onClick={() => selectImage(image.id)}
              aria-label={`Seleccionar ${image.filename}`}
            >
              <GalleryImage image={image} srcKey="thumbSrc" onLoad={markLoaded} />
            </button>
          ))}
        </div>

        <div className="ceiba-gallery-actions">
          <nav className="ceiba-gallery-filter" ref={filterRef} aria-label="Filtrar por día">
            <span className="ceiba-gallery-filter-indicator" ref={indicatorRef} aria-hidden="true" />
            {filters.map((filter) => (
              <button
                type="button"
                className={`ceiba-gallery-filter-button ${activeFilter === filter.id ? 'is-active' : ''}`}
                key={filter.id}
                ref={(node) => {
                  if (node) filterButtonRefs.current.set(filter.id, node);
                  else filterButtonRefs.current.delete(filter.id);
                }}
                onClick={() => handleFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </nav>

          <button
            type="button"
            className={`ceiba-gallery-icon-button ${actionsVisible ? 'is-visible' : ''}`}
            onClick={handleDownload}
            aria-label="Descargar imagen"
            disabled={!actionsVisible}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M9 3v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="m5.5 8 3.5 3.5L12.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 14.5h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <button
            type="button"
            className={`ceiba-gallery-icon-button ${actionsVisible ? 'is-visible' : ''}`}
            onClick={handleShare}
            aria-label="Compartir página"
            disabled={!actionsVisible}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M7.25 5.75H5.5A2.5 2.5 0 0 0 3 8.25v4.25A2.5 2.5 0 0 0 5.5 15h4.25a2.5 2.5 0 0 0 2.5-2.5v-1.75" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
              <path d="M10 3h5v5" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
              <path d="m8.5 9.5 6-6" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {lightboxImage && (
        <div
          className="ceiba-gallery-lightbox"
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Imagen ${lightboxImage.filename}`}
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="ceiba-gallery-lightbox-close"
            onClick={closeLightbox}
            aria-label="Cerrar imagen"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="m5 5 8 8M13 5l-8 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>

          <figure
            className="ceiba-gallery-lightbox-panel"
            ref={lightboxPanelRef}
            onClick={(event) => event.stopPropagation()}
          >
            <GalleryImage image={lightboxImage} className="ceiba-gallery-lightbox-image" onLoad={markLoaded} priority />
          </figure>
        </div>
      )}
    </section>
  );
}
