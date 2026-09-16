"use client";

import { useEffect, useRef } from "react";
import type { ModeKey } from "./mode-selector";

type Dot = { x: number; y: number; ox: number; oy: number; phase: number };
const modeBias: Record<ModeKey, number> = { harness: 0, training: 1.7, recommendation: 3.4 };

export function TopologyCanvas({ mode, reducedMotion }: { mode: ModeKey; reducedMotion: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let frame = 0;
    let dots: Dot[] = [];
    let animation = 0;

    const resize = () => {
      const box = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.6);
      canvas.width = Math.floor(box.width * ratio);
      canvas.height = Math.floor(box.height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const cap = box.width < 640 ? 360 : 840;
      const count = Math.min(cap, Math.max(160, Math.floor((box.width * box.height) / 420)));
      dots = Array.from({ length: count }, (_, index) => {
        const t = index / count * Math.PI * 8;
        const radius = (index % 97) / 97;
        const x = box.width * (.51 + Math.cos(t) * radius * .48);
        const y = box.height * (.53 + Math.sin(t * .73) * radius * .43);
        return { x, y, ox: x, oy: y, phase: Math.random() * Math.PI * 2 };
      });
      if (reducedMotion) draw();
    };

    const draw = () => {
      const box = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, box.width, box.height);
      const styles = getComputedStyle(canvas);
      ctx.fillStyle = styles.getPropertyValue("--topology-dot").trim() || "rgba(25,31,42,.5)";
      const bias = modeBias[mode];
      for (const dot of dots) {
        const dx = dot.x - pointer.current.x;
        const dy = dot.y - pointer.current.y;
        const distance = Math.hypot(dx, dy);
        const force = reducedMotion || distance > 115 ? 0 : (115 - distance) / 115;
        const time = reducedMotion ? 0 : frame * .006;
        dot.x += (dot.ox + Math.sin(dot.phase + time + bias) * 7 - dot.x) * .05 + (dx / Math.max(distance, 1)) * force * 1.8;
        dot.y += (dot.oy + Math.cos(dot.phase + time * .8 + bias) * 5 - dot.y) * .05 + (dy / Math.max(distance, 1)) * force * 1.8;
        ctx.globalAlpha = .24 + .7 * (1 - Math.abs(dot.y / box.height - .5));
        const size = Math.floor(dot.phase * 10) % 5 === 0 ? 1.8 : .9;
        ctx.fillRect(dot.x, dot.y, size, size);
      }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = styles.getPropertyValue("--topology-line").trim() || "rgba(25,31,42,.22)";
      ctx.setLineDash([2, 5]);
      ctx.beginPath();
      ctx.moveTo(box.width * .15, box.height * .29);
      ctx.bezierCurveTo(box.width * .42, box.height * .12, box.width * .5, box.height * .45, box.width * .73, box.height * .21);
      ctx.bezierCurveTo(box.width * .92, box.height * .38, box.width * .8, box.height * .66, box.width * .88, box.height * .78);
      ctx.moveTo(box.width * .15, box.height * .7);
      ctx.bezierCurveTo(box.width * .35, box.height * .5, box.width * .62, box.height * .72, box.width * .88, box.height * .78);
      ctx.stroke();
      frame += 1;
      if (!reducedMotion) animation = requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      pointer.current = { x: event.clientX - box.left, y: event.clientY - box.top };
    };
    const onThemeChange = () => {
      if (reducedMotion) draw();
    };
    resize();
    draw();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    canvas.parentElement?.addEventListener("pointermove", onPointerMove);
    window.addEventListener("themechange", onThemeChange);
    return () => {
      cancelAnimationFrame(animation);
      observer.disconnect();
      canvas.parentElement?.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("themechange", onThemeChange);
    };
  }, [mode, reducedMotion]);

  return <canvas ref={ref} aria-hidden="true" />;
}
