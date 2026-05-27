'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';

/* ── Natural water-drop sound ── */
function playDropSound() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();
  const now = ctx.currentTime;

  const impulse = (dur) => {
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    return src;
  };

  // High resonant ring (the "tick")
  const i1 = impulse(0.004);
  const f1 = ctx.createBiquadFilter();
  f1.type = 'bandpass'; f1.frequency.setValueAtTime(1700, now);
  f1.frequency.exponentialRampToValueAtTime(420, now + 0.13); f1.Q.value = 18;
  const g1 = ctx.createGain();
  g1.gain.setValueAtTime(0.4, now);
  g1.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
  i1.connect(f1); f1.connect(g1); g1.connect(ctx.destination); i1.start(now);

  // Low hollow echo
  const i2 = impulse(0.003);
  const f2 = ctx.createBiquadFilter();
  f2.type = 'bandpass'; f2.frequency.setValueAtTime(500, now);
  f2.frequency.exponentialRampToValueAtTime(170, now + 0.22); f2.Q.value = 24;
  const g2 = ctx.createGain();
  g2.gain.setValueAtTime(0.18, now);
  g2.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
  i2.connect(f2); f2.connect(g2); g2.connect(ctx.destination); i2.start(now);

  setTimeout(() => ctx.close(), 700);
}

const VERT = `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
`;

/* Wave equation simulation — reads tPrev + tCurrent, writes to a THIRD buffer (no feedback loop) */
const SIM_FRAG = `
  uniform sampler2D tPrev;
  uniform sampler2D tCurrent;
  uniform vec2 resolution;
  uniform vec3 touch;
  uniform float damping;
  varying vec2 vUv;
  void main() {
    vec2 px = 1.0 / resolution;
    float prev  = texture2D(tPrev,    vUv).r;
    float curr  = texture2D(tCurrent, vUv).r;
    float north = texture2D(tCurrent, vUv + vec2(0.0,  px.y)).r;
    float south = texture2D(tCurrent, vUv - vec2(0.0,  px.y)).r;
    float east  = texture2D(tCurrent, vUv + vec2(px.x,  0.0)).r;
    float west  = texture2D(tCurrent, vUv - vec2(px.x,  0.0)).r;
    float next  = ((north + south + east + west) * 0.5 - prev) * damping;
    if (touch.z > 0.0) {
      float d = distance(vUv, touch.xy);
      next += (1.0 - smoothstep(0.0, 0.035, d)) * touch.z;
    }
    gl_FragColor = vec4(clamp(next, -1.0, 1.0), 0.0, 0.0, 1.0);
  }
`;

/* Display — bright shimmer edges, visible on any background */
const DISPLAY_FRAG = `
  uniform sampler2D tSim;
  uniform vec2 resolution;
  varying vec2 vUv;
  void main() {
    vec2 px = 1.0 / resolution;
    float h  = texture2D(tSim, vUv).r;
    float dx = texture2D(tSim, vUv + vec2(px.x, 0.0)).r
             - texture2D(tSim, vUv - vec2(px.x, 0.0)).r;
    float dy = texture2D(tSim, vUv + vec2(0.0, px.y)).r
             - texture2D(tSim, vUv - vec2(0.0, px.y)).r;

    vec3  normal = normalize(vec3(-dx * 14.0, -dy * 14.0, 1.0));
    float spec   = pow(max(dot(normal, normalize(vec3(0.4, 0.6, 1.0))), 0.0), 24.0);
    float edge   = length(vec2(dx, dy)) * 20.0;

    /* Bright white-lime shimmer — visible on dark AND light backgrounds */
    vec3 col    = mix(vec3(0.75, 0.95, 0.25), vec3(1.0, 1.0, 0.95), spec);
    float alpha = clamp(edge * 0.8 + spec * 0.9, 0.0, 0.75);

    gl_FragColor = vec4(col, alpha);
  }
`;

const SIM_RES = 512;

function WaterCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, preserveDrawingBuffer: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(1);
    mount.appendChild(renderer.domElement);

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const mainScene = new THREE.Scene();
    const simScene  = new THREE.Scene();

    /* 3 render targets — prevents texture feedback loop (GL_INVALID_OPERATION) */
    const texType = renderer.capabilities.isWebGL2 ? THREE.FloatType : THREE.HalfFloatType;
    const rtOpts  = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: texType,
    };
    let rtPrev    = new THREE.WebGLRenderTarget(SIM_RES, SIM_RES, rtOpts); // t-2
    let rtCurrent = new THREE.WebGLRenderTarget(SIM_RES, SIM_RES, rtOpts); // t-1
    let rtNext    = new THREE.WebGLRenderTarget(SIM_RES, SIM_RES, rtOpts); // write target

    const simUniforms = {
      tPrev:      { value: rtPrev.texture },
      tCurrent:   { value: rtCurrent.texture },
      resolution: { value: new THREE.Vector2(SIM_RES, SIM_RES) },
      touch:      { value: new THREE.Vector3(-1, -1, 0) },
      damping:    { value: 0.986 },
    };
    const displayUniforms = {
      tSim:       { value: rtCurrent.texture },
      resolution: { value: new THREE.Vector2(SIM_RES, SIM_RES) },
    };

    const simMat = new THREE.ShaderMaterial({
      uniforms: simUniforms, vertexShader: VERT, fragmentShader: SIM_FRAG,
    });
    const displayMat = new THREE.ShaderMaterial({
      uniforms: displayUniforms, vertexShader: VERT, fragmentShader: DISPLAY_FRAG,
      transparent: true, depthWrite: false,
    });

    simScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMat));
    mainScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), displayMat));

    /* Input */
    let mx = 0.5, my = 0.5, prevMx = 0.5, prevMy = 0.5, strength = 0;

    const toUV = (cx, cy) => ({ x: cx / window.innerWidth, y: 1.0 - cy / window.innerHeight });

    const onMouseMove = (e) => {
      const uv = toUV(e.clientX, e.clientY);
      const spd = Math.hypot(uv.x - prevMx, uv.y - prevMy);
      if (spd > 0.001) { mx = uv.x; my = uv.y; strength = Math.min(spd * 18, 0.35); }
      prevMx = uv.x; prevMy = uv.y;
    };
    const onMouseDown = (e) => {
      const uv = toUV(e.clientX, e.clientY);
      mx = uv.x; my = uv.y; strength = 1.6;
      playDropSound();
    };
    const onTouchMove = (e) => {
      const t = e.touches[0]; if (!t) return;
      const uv = toUV(t.clientX, t.clientY);
      mx = uv.x; my = uv.y; strength = 0.25;
    };
    const onTouchStart = (e) => {
      const t = e.touches[0]; if (!t) return;
      const uv = toUV(t.clientX, t.clientY);
      mx = uv.x; my = uv.y; strength = 1.6;
      playDropSound();
    };
    const onResize = () => renderer.setSize(window.innerWidth, window.innerHeight);

    window.addEventListener('mousemove',  onMouseMove,  { passive: true });
    window.addEventListener('mousedown',  onMouseDown);
    window.addEventListener('touchmove',  onTouchMove,  { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('resize',     onResize);

    /* Animation loop — 3-buffer rotation, no feedback loop */
    let animId;
    const tick = () => {
      animId = requestAnimationFrame(tick);

      // Simulate: read prev + current, write to next (safe — different textures)
      simUniforms.tPrev.value    = rtPrev.texture;
      simUniforms.tCurrent.value = rtCurrent.texture;
      simUniforms.touch.value.set(mx, my, strength);

      renderer.setRenderTarget(rtNext);
      renderer.render(simScene, camera);

      // Rotate buffers: prev ← current ← next ← prev
      const tmp = rtPrev;
      rtPrev    = rtCurrent;
      rtCurrent = rtNext;
      rtNext    = tmp;

      strength *= 0.78;

      // Display current state
      displayUniforms.tSim.value = rtCurrent.texture;
      renderer.setRenderTarget(null);
      renderer.render(mainScene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove',  onMouseMove);
      window.removeEventListener('mousedown',  onMouseDown);
      window.removeEventListener('touchmove',  onTouchMove);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('resize',     onResize);
      renderer.dispose();
      rtPrev.dispose(); rtCurrent.dispose(); rtNext.dispose();
      simMat.dispose(); displayMat.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ position: 'fixed', inset: 0, zIndex: 9000, pointerEvents: 'none', width: '100vw', height: '100vh' }}
    />
  );
}

export default function WaterRipple() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); return () => setMounted(false); }, []);
  if (!mounted) return null;
  return createPortal(<WaterCanvas />, document.body);
}
