"use client";

import { useEffect, useRef } from "react";
import type { ModeKey } from "./mode-selector";

type Dot = { x: number; y: number; ox: number; oy: number; phase: number };
const modeBias: Record<ModeKey, number> = { harness: 0, evaluation: 1.7, training: 3.4 };
const points = { data: [.15, .29], tool: [.73, .22], plan: [.48, .44], memory: [.18, .69], train: [.51, .73], eval: [.83, .55], deploy: [.89, .8] } as const;
type PointKey = keyof typeof points;
const routes: Record<ModeKey, [PointKey, PointKey][]> = {
  harness: [["plan", "tool"], ["tool", "memory"], ["memory", "plan"]],
  evaluation: [["plan", "eval"], ["eval", "train"], ["train", "memory"], ["memory", "plan"]],
  training: [["data", "train"], ["train", "eval"], ["eval", "deploy"]],
};

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
    let visible = true;

    const resize = () => {
      const box = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.6);
      canvas.width = Math.floor(box.width * ratio);
      canvas.height = Math.floor(box.height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const cap = box.width < 640 ? 230 : 480;
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
      ctx.strokeStyle = styles.getPropertyValue("--mode-color").trim() || "#245cff";
      ctx.globalAlpha = .38;
      ctx.lineWidth = .8;
      ctx.setLineDash([3, 6]);
      ctx.lineDashOffset = reducedMotion ? 0 : -frame * .13;
      for (const [start, end] of routes[mode]) {
        const [x1, y1] = points[start];
        const [x2, y2] = points[end];
        ctx.beginPath();
        ctx.moveTo(box.width * x1, box.height * y1);
        ctx.quadraticCurveTo(box.width * ((x1 + x2) / 2 + .04), box.height * ((y1 + y2) / 2 - .08), box.width * x2, box.height * y2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      frame += 1;
      if (!reducedMotion && visible) animation = requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      pointer.current = { x: event.clientX - box.left, y: event.clientY - box.top };
    };
    const onThemeChange = () => {
      if (reducedMotion) draw();
    };
    const onPointerLeave = () => { pointer.current = { x: -1000, y: -1000 }; };
    resize();
    draw();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => {
      const resume = entry.isIntersecting && !visible;
      visible = entry.isIntersecting;
      if (!visible) cancelAnimationFrame(animation);
      else if (resume) draw();
    });
    intersection.observe(canvas);
    canvas.parentElement?.addEventListener("pointermove", onPointerMove);
    canvas.parentElement?.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("themechange", onThemeChange);
    return () => {
      cancelAnimationFrame(animation);
      observer.disconnect();
      intersection.disconnect();
      canvas.parentElement?.removeEventListener("pointermove", onPointerMove);
      canvas.parentElement?.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("themechange", onThemeChange);
    };
  }, [mode, reducedMotion]);

  return <canvas ref={ref} aria-hidden="true" />;
}
