'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import report from '../data/capital-paciente.json';

gsap.registerPlugin(ScrollTrigger);

const stages = ['Semilla', 'Creciente', 'Consolidada'];
const laneNames = ['Inversión', 'Blended / resultados', 'Cooperación técnica', 'Fortalecimiento'];
const colors = ['var(--accent)', 'var(--cp-series-sage)', 'var(--cp-series-clay)', 'var(--cp-series-muted)'];
const chartTitles = ['La brecha de financiamiento', 'Una red, 395 posibilidades', 'El tiempo de la naturaleza', 'El instrumento cambia con la etapa', 'Inclusión y actividad económica', 'Lo que la red está midiendo', 'Una cartera con puntos ciegos', 'A cada etapa, su instrumento', 'La oportunidad de capital paciente'];
const kpis = report.kpis[0];
const fmt = (value) => new Intl.NumberFormat('es', { maximumFractionDigits: 1 }).format(value);

function ReportPhoto({ file, alt, credit, className = '', preload = false }) {
  return (
    <figure className={`cp-photo ${className}`}>
      <div className="cp-photo-image">
        <Image src={`/assets/capital-paciente/${file}.webp`} alt={alt} fill sizes={preload ? '(max-width: 768px) 100vw, 55vw' : '(max-width: 1024px) 100vw, 40vw'} preload={preload} />
      </div>
      <figcaption>Fotografía de {credit}</figcaption>
    </figure>
  );
}

function DotPlot({ scene }) {
  const lanes = scene === 'carriles' || scene === 'listas';
  const time = scene === 'tiempo';
  const counters = [0, 0, 0, 0];
  return (
    <div className={`cp-dotplot${time ? ' is-time' : ''}`}>
      <svg viewBox="0 0 560 380" role="img" aria-label={time ? 'Edad actual de las 395 organizaciones según etapa. Medianas: 1, 4 y 9 años.' : lanes ? '395 organizaciones distribuidas en cuatro carriles: 39 inversión, 43 blended, 55 cooperación y 258 fortalecimiento.' : 'Cada punto representa una organización: 128 semilla, 166 crecientes y 101 consolidadas.'}>
        {time && <>
          {[0, 10, 20, 30, 40, 50, 65].map(age => <g key={age}><line x1={28 + age / 65 * 504} x2={28 + age / 65 * 504} y1="38" y2="330" className="cp-gridline" /><text x={28 + age / 65 * 504} y="354" textAnchor="middle">{age}</text></g>)}
          <text x="532" y="378" textAnchor="end">Años desde la fundación</text>
          <line x1={28 + 5 / 65 * 504} x2={28 + 5 / 65 * 504} y1="38" y2="330" className="cp-reference" />
          <text x="28" y="20" className="cp-plot-strong">Referencia de un fondo de riesgo: 5 años</text>
        </>}
        {report.points.map(([stage, age, lane], index) => {
          const order = counters[lanes ? lane : stage]++;
          let x, y;
          if (time) {
            x = 28 + age / 65 * 504;
            y = 84 + stage * 104 + ((order * 7 % 9) - 4) * 3.7;
          } else if (lanes) {
            x = 18 + (order % 37) * 14.25;
            y = 51 + lane * 83 + Math.floor(order / 37) * 8;
          } else {
            x = 18 + (order % 34) * 15.75;
            y = 56 + stage * 106 + Math.floor(order / 34) * 12;
          }
          return <circle key={index} r={time ? 3.3 : 4.1} className="cp-org-dot" style={{ transform: `translate(${x}px, ${y}px)`, fill: colors[lanes ? lane : stage], opacity: scene === 'listas' && lane > 1 ? 0.13 : 0.88 }}><title>{time ? `${stages[stage]} · ${age} años desde su fundación` : lanes ? laneNames[lane] : stages[stage]}</title></circle>;
        })}
        {(lanes ? report.carriles : report.edad_etapa).map((row, index) => <g key={index}>
          <text x="14" y={lanes ? 30 + index * 83 : time ? 54 + index * 104 : 30 + index * 106} className="cp-plot-strong">{lanes ? laneNames[index] : stages[index]}</text>
          <text x="540" y={lanes ? 30 + index * 83 : time ? 54 + index * 104 : 30 + index * 106} textAnchor="end" className="cp-plot-strong">{time ? `Mediana: ${row.mediana} ${row.mediana === 1 ? 'año' : 'años'}` : row.n}</text>
        </g>)}
      </svg>
      {!time && <div className="cp-mobile-plot-legend">{(lanes ? report.carriles : report.edad_etapa).map((row, index) => <div key={index}><i style={{ background: colors[index] }} /><span>{lanes ? laneNames[index] : stages[index]}</span><strong>{row.n}</strong></div>)}</div>}
      {time && <div className="cp-mobile-age">{report.edad_etapa.map(row => <div key={row.etapa}><div><span>{row.etapa}</span><strong>{row.mediana} {row.mediana === 1 ? 'año' : 'años'}</strong></div><div className="cp-bar-track"><div className="cp-bar-fill" style={{ width: `${row.mediana / 15 * 100}%`, background: colors[stages.indexOf(row.etapa)] }} /></div><small>Mediana · {row.n} organizaciones</small></div>)}<p>Referencia de un fondo de riesgo: 5 años.</p></div>}
      <p className="cp-chart-note">{time ? 'Edad actual por etapa, no tiempo observado hasta consolidarse. Rango completo: 0–65 años.' : 'Un punto = una organización. Fuente: radar Natura500, 16 nov. 2026.'}</p>
    </div>
  );
}

function BarRows({ rows, max, percent = false }) {
  return <div className="cp-bars">{rows.map((row, index) => <div className="cp-bar-row" key={row.label}>
    <div className="cp-bar-label"><span>{row.label}</span><strong>{fmt(row.value)}{percent ? '%' : ''}{row.count != null && <small> · {fmt(row.count)}</small>}</strong></div>
    <div className="cp-bar-track"><div className="cp-bar-fill" style={{ width: `${row.value / max * 100}%`, background: row.color || colors[index % colors.length] }} /></div>
  </div>)}</div>;
}

function CapitalChart() {
  const series = [
    { key: 'no_dilutivo', label: 'No dilutivo', color: colors[0] },
    { key: 'equity', label: 'Equity', color: colors[2] },
    { key: 'blended', label: 'Deuda o blended', color: colors[1] },
  ];
  return <>
    <div className="cp-legend">{series.map(s => <span key={s.key}><i style={{ background: s.color }} />{s.label}</span>)}</div>
    <svg viewBox="0 0 560 330" className="cp-linechart" role="img" aria-label="De semilla a consolidada: no dilutivo 72, 69 y 68%; equity 58, 48 y 34%; deuda o blended 12, 21 y 24%.">
      {[0, 25, 50, 75, 100].map(value => <g key={value}><line x1="45" x2="525" y1={275 - value * 2.3} y2={275 - value * 2.3} className="cp-gridline" /><text x="30" y={280 - value * 2.3} textAnchor="end">{value}%</text></g>)}
      {stages.map((stage, index) => <text key={stage} x={85 + index * 205} y="313" textAnchor="middle">{stage}</text>)}
      {series.map(s => <g key={s.key}>
        <polyline points={report.capital_etapa.map((row, index) => `${85 + index * 205},${275 - row[s.key] * 2.3}`).join(' ')} fill="none" stroke={s.color} strokeWidth="3" />
        {report.capital_etapa.map((row, index) => <g key={row.etapa}><circle cx={85 + index * 205} cy={275 - row[s.key] * 2.3} r="6" fill={s.color} stroke="var(--bg-primary)" strokeWidth="3" /><text x={85 + index * 205} y={258 - row[s.key] * 2.3} textAnchor="middle" className="cp-plot-strong" style={{ fill: s.color }}>{row[s.key]}%</text></g>)}
      </g>)}
    </svg>
    <div className="cp-capital-data">{report.capital_etapa.map(row => <div key={row.etapa}><h4>{row.etapa}</h4><dl>{series.map(s => <div key={s.key}><dt>{s.label}</dt><dd style={{ color: s.color }}>{row[s.key]}%</dd></div>)}</dl></div>)}</div>
    <p className="cp-chart-note">% de cada etapa que solicita el instrumento. Respuestas múltiples. Bases: 128 semilla · 166 crecientes · 101 consolidadas.</p>
  </>;
}

function InclusionChart() {
  return <>
    <div className="cp-legend"><span><i style={{ background: colors[1] }} />Trabaja con el grupo</span><span><i style={{ background: colors[3] }} />No lo menciona</span></div>
    <div className="cp-paired-bars">{report.inclusion_traccion.map(row => <div key={row.grupo} className="cp-paired-row">
      <h4>{row.grupo}</h4>
      {[['con', colors[1]], ['sin', colors[3]]].map(([key, color]) => <div className="cp-pair" key={key}><div className="cp-bar-track"><div className="cp-bar-fill" style={{ width: `${row[`${key}_ventas`]}%`, background: color }} /></div><strong>{row[`${key}_ventas`]}%</strong><span>n = {row[`${key}_n`]}</span></div>)}
    </div>)}</div>
    <p className="cp-chart-note">Porcentaje que reporta ventas o ingresos. Solo crecientes y consolidadas (n = 267). Correlación, no causalidad.</p>
  </>;
}

function ChartContent({ scene }) {
  if (scene === 'red' || scene === 'tiempo' || scene === 'carriles') return <DotPlot scene={scene} />;
  if (scene === 'contexto') return <>
    <div className="cp-ratio"><strong>30<span>:1</span></strong><p>dólares que degradan<br />por cada dólar que protege</p></div>
    <BarRows max={571} rows={[{ label: 'Necesarios para 2030', value: 571, color: colors[1] }, { label: 'Inversión actual en SbN', value: 220, color: colors[0] }, { label: 'De ella, inversión privada', value: 23, color: colors[2] }]} />
    <p className="cp-chart-note">US$ mil millones al año. Los flujos que dañan la naturaleza suman US$7.300 mil millones. Los US$23 mil millones privados están incluidos en los US$220 mil millones actuales. PNUMA, 2026; cifras transcritas del análisis original.</p>
  </>;
  if (scene === 'capital') return <CapitalChart />;
  if (scene === 'inclusion') return <InclusionChart />;
  if (scene === 'evidencia') return <>
    <div className="cp-chart-total"><strong>{fmt(kpis.n_indicadores)}</strong><span>indicadores de impacto</span></div>
    <BarRows max={33.34} percent rows={report.tipos_indicador.map((row, i) => ({ label: row.tipo, value: row.pct, count: row.n, color: i === 0 ? colors[1] : i === 4 ? colors[2] : colors[3] }))} />
    <p className="cp-chart-note">Porcentaje del total · número de indicadores. Los porcentajes suman 99% por redondeo.</p>
  </>;
  if (scene === 'ciegos') return <>
    <BarRows max={117} rows={[...report.paises.slice(0, 6), report.paises.find(row => row.pais === 'Brasil')].map(row => ({ label: row.pais, value: row.n, color: row.pais === 'Brasil' ? colors[2] : colors[1] }))} />
    <div className="cp-small-stats"><div><strong>1%</strong><span>menciona comunidades afrodescendientes</span></div><div><strong>7%</strong><span>se identifica como economía azul</span></div></div>
    <p className="cp-chart-note">Seis países con más organizaciones y Brasil, de 20 países. Economía azul: 29 de 395 por tipo; la categoría temática tiene otra base.</p>
  </>;
  return <>
    <div className="cp-ready-number"><strong>82</strong><span>organizaciones en los carriles<br />de inversión y blended</span></div>
    <div className="cp-ready-track" aria-label="39 para inversión y 43 para blended, de 395 organizaciones"><span style={{ width: `${39 / 395 * 100}%` }} /><span style={{ width: `${43 / 395 * 100}%` }} /></div>
    <div className="cp-capital-split"><div><strong>39</strong><span>Inversión</span></div><div><strong>43</strong><span>Blended / resultados</span></div></div>
    <div className="cp-intermediaries"><span>Finanzas de naturaleza</span><p><strong>52</strong> organizaciones · <strong>42%</strong> consolidadas</p></div>
    <p className="cp-chart-note">Primera criba a partir de señales auto-reportadas; requiere diligencia. No es una recomendación de inversión.</p>
  </>;
}

function ReportChart({ index, desktop = false }) {
  const scene = report.copy.sections[index].id;
  return <figure className={`cp-chart${desktop ? ' cp-chart-desktop' : ' cp-chart-inline'}`} aria-label={chartTitles[index]}>
    <h3>{chartTitles[index]}</h3>
    {desktop ? <>
      <div className="cp-chart-scene" hidden={!['red', 'tiempo', 'carriles'].includes(scene)}><DotPlot scene={scene} /></div>
      {!['red', 'tiempo', 'carriles'].includes(scene) && <div className="cp-chart-scene" key={scene}><ChartContent scene={scene} /></div>}
    </> : <ChartContent scene={scene} />}
  </figure>;
}

const chapterPhotos = {
  red: { file: 'comunidad-arbio', alt: 'Un grupo de personas junto a un gran árbol del bosque amazónico', credit: 'ARBIO Perú' },
  inclusion: { file: 'produccion-caryo', alt: 'Una productora junto a mesas de secado de semillas', credit: 'CARYO' },
  evidencia: { file: 'apicultura-abejedario', alt: 'Medición de un panal durante una actividad de apicultura', credit: 'Abejedario' },
  ciegos: { file: 'oficio-fins-belize', alt: 'Una persona elabora piezas de artesanía en un taller', credit: 'FINS Belize' },
};

export default function CapitalPaciente() {
  const rootRef = useRef(null);
  const progressRef = useRef(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia();
    mm.add({ animate: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' }, ({ conditions }) => {
      const chapters = [...root.querySelectorAll('.cp-chapter')];
      chapters.forEach((chapter, index) => {
        ScrollTrigger.create({ trigger: chapter, start: 'top 52%', end: 'bottom 52%', onEnter: () => setActive(index), onEnterBack: () => setActive(index) });
      });
      if (conditions.reduce) return;
      gsap.fromTo(progressRef.current, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: true } });
      root.querySelectorAll('[data-cp-reveal]').forEach(element => {
        gsap.from(element, { y: 24, opacity: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 93%', once: true } });
      });
      gsap.fromTo(root.querySelector('.cp-hero-photo .cp-photo-image'), { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: root.querySelector('.cp-hero'), start: 'top top', end: 'bottom top', scrub: 0.6 } });
    }, root);
    return () => mm.revert();
  }, []);

  function navigateTo(event, id) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (window.naturatechLenis) window.naturatechLenis.scrollTo(target, { offset: -110, immediate: reduce });
    else target.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth' });
    window.history.replaceState(null, '', `#${id}`);
    target.focus({ preventScroll: true });
  }

  return (
    <article ref={rootRef} className="cp-report" lang="es" aria-labelledby="cp-title">
      <div ref={progressRef} className="cp-reading-progress" aria-hidden="true" />
      <header className="cp-hero">
        <div className="cp-hero-grid">
          <div className="cp-hero-copy">
            <h1 id="cp-title" tabIndex={-1}>Capital paciente:<br />la oportunidad<br />escondida en<br /><em>Natura500.</em></h1>
            <a className="cp-read-link" href="#informe" onClick={event => navigateTo(event, 'informe')}>Explorar el informe <span>↓</span></a>
          </div>
          <div className="cp-hero-visual">
            <ReportPhoto file="amazonia-arbio" alt="Vista aérea de un río que recorre el bosque amazónico" credit="ARBIO Perú" className="cp-hero-photo" preload />
            <div className="cp-hero-photo-caption"><span>El territorio marca el tiempo.</span><span>El capital puede acompañarlo.</span></div>
            <div className="cp-photo-index" aria-hidden="true">01 — 09 / Una lectura del radar</div>
          </div>
        </div>
        <div className="cp-cover-stats">
          {[['395', 'organizaciones verificadas'], ['20', 'países en el radar'], ['82', 'listas para capital paciente'], ['9', 'años · mediana de las consolidadas']].map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
        </div>
      </header>

      <div className="cp-paper">
        <section className="cp-introduction cp-container" id="informe" tabIndex={-1}>
          <div><p className="cp-eyebrow">Una lectura de la oportunidad</p><p className="cp-intro-label">Naturaleza, evidencia<br />y otra forma de financiar.</p></div>
          <div><p className="cp-lede">{report.copy.hero.lede}</p><a className="cp-method-link" href="#metodologia" onClick={event => navigateTo(event, 'metodologia')}>Consultar metodología y fuentes <span>↗</span></a></div>
        </section>

        <nav className="cp-index cp-container" aria-label="Contenido del informe">
          <span>En este informe</span>
          <a href="#paso-contexto" onClick={event => navigateTo(event, 'paso-contexto')}>01 — El entorno</a>
          <a href="#paso-tiempo" onClick={event => navigateTo(event, 'paso-tiempo')}>03 — Los hallazgos</a>
          <a href="#paso-carriles" onClick={event => navigateTo(event, 'paso-carriles')}>08 — La oportunidad</a>
          <a href="#tesis" onClick={event => navigateTo(event, 'tesis')}>10 — La tesis</a>
        </nav>

        <div className="cp-story cp-container">
          <div className="cp-chapters">
            {report.copy.sections.map((chapter, index) => <section key={chapter.id} id={`paso-${chapter.id}`} tabIndex={-1} className={`cp-chapter${active === index ? ' is-active' : ''}`} aria-labelledby={`cp-heading-${chapter.id}`}>
              <div className="cp-chapter-copy" data-cp-reveal>
                <p className="cp-eyebrow"><span>{String(index + 1).padStart(2, '0')}</span>{chapter.eyebrow}</p>
                <h2 id={`cp-heading-${chapter.id}`}>{chapter.title}</h2>
                <p className="cp-chapter-body">{chapter.body}</p>
              </div>
              <ReportChart index={index} />
              {chapterPhotos[chapter.id] && <ReportPhoto {...chapterPhotos[chapter.id]} className={`cp-chapter-photo cp-photo-${chapter.id}`} />}
            </section>)}
          </div>
          <aside className="cp-story-visual" aria-label="Visualización del capítulo actual">
            <div className="cp-sticky-visual">
              <ReportChart index={active} desktop />
            </div>
          </aside>
        </div>

        <section className="cp-thesis cp-container" id="tesis" tabIndex={-1}>
          <div className="cp-section-heading" data-cp-reveal><p className="cp-eyebrow">{report.copy.thesisEyebrow}</p><h2>{report.copy.thesisTitle}</h2><span>Del análisis a la acción</span></div>
          <div className="cp-thesis-grid">{report.copy.thesis.map((item, index) => <div className="cp-thesis-item" key={item.title} data-cp-reveal><span className="cp-thesis-number">0{index + 1}</span><h3>{item.title}</h3><p>{item.body}</p></div>)}</div>
        </section>

        <section className="cp-method cp-container" id="metodologia" tabIndex={-1}>
          <div className="cp-method-heading"><p className="cp-eyebrow">Transparencia del análisis</p><h2>De dónde vienen<br />los datos.</h2><p>El índice y los pilares salen de palabras clave en texto auto-reportado. Son una primera criba para priorizar llamadas de diligencia, no una calificación.</p></div>
          <div className="cp-method-content">
            <details className="cp-method-details" open onToggle={() => ScrollTrigger.refresh()}>
              <summary>{report.copy.methodologyTitle}<span aria-hidden="true">+</span></summary>
              <dl>{report.copy.methodology.filter(item => item.label !== 'Fuentes externas.').map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.body}</dd></div>)}</dl>
            </details>
            <div className="cp-reading-notes"><h3>Notas para leer las gráficas</h3><p>La edad describe los años desde la fundación en 2026; no es un seguimiento del tiempo que tardó cada organización en consolidarse. El pilar de innovación está limitado a 20 puntos. Las categorías temáticas pueden solaparse y los porcentajes se redondean.</p><p>El 7% de economía azul corresponde al tipo declarado (29 de 395); el tema «Economía azul» fue seleccionado por 44 organizaciones y tiene una base distinta.</p></div>
            <div className="cp-sources"><h3>Fuentes externas del análisis original</h3>{report.fuentes.map((source, index) => <a href={source.url} target="_blank" rel="noopener noreferrer" key={source.url}><span>0{index + 1}</span>{source.titulo}<span aria-hidden="true">↗</span></a>)}</div>
            <p className="cp-data-date">Datos: exportación del radar Natura500 del 16 de noviembre de 2026 y referencias externas citadas en el método.</p>
          </div>
        </section>
      </div>

      <section className="cp-closing">
        <ReportPhoto file="territorio-santuario" alt="Un territorio costero con bosque, palmeras y playa junto al mar" credit="Santuario · hospitalidad regenerativa de propiedad colectiva" />
        <div className="cp-closing-copy"><p className="cp-eyebrow">Natura500 · NaturaTech LAC</p><h2>La naturaleza tiene<br />su propio ritmo.</h2><p>Capital paciente: la oportunidad escondida en Natura500.</p><a className="cp-read-link" href="/emprendimientos">Conocer Natura500 <span>↗</span></a><a className="cp-back-top" href="#cp-title" onClick={event => navigateTo(event, 'cp-title')}>Volver al inicio ↑</a></div>
      </section>
    </article>
  );
}
