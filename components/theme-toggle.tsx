"use client";

import { MoonStar, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

const storageKey = "yy-theme";
const themeEvent = "themechange";

function subscribe(callback: () => void) {
  window.addEventListener(themeEvent, callback);
  return () => window.removeEventListener(themeEvent, callback);
}

function getPlanetTheme() {
  return document.documentElement.dataset.theme === "planet";
}

export function ThemeToggle() {
  const planet = useSyncExternalStore(subscribe, getPlanetTheme, () => false);

  const updateTheme = (checked: boolean) => {
    const theme = checked ? "planet" : "light";
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      // Keep the visual state even when browser storage is unavailable.
    }
    window.dispatchEvent(new Event(themeEvent));
  };

  return (
    <div className="theme-toggle" title={planet ? "切换到浅色模式" : "切换到星球模式"}>
      <Sun className="theme-icon theme-icon-light" aria-hidden="true" />
      <button
        type="button"
        role="switch"
        data-slot="switch"
        data-state={planet ? "checked" : "unchecked"}
        aria-checked={planet}
        onClick={() => updateTheme(!planet)}
        aria-label={planet ? "当前为星球模式，切换到浅色模式" : "当前为浅色模式，切换到星球模式"}
      ><span data-slot="switch-thumb" /></button>
      <MoonStar className="theme-icon theme-icon-planet" aria-hidden="true" />
      <span className="theme-label mono">{planet ? "PLANET" : "LIGHT"}</span>
    </div>
  );
}
