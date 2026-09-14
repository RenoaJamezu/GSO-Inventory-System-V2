import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "gso-theme";

function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem(STORAGE_KEY);

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  root.classList.toggle("dark", theme === "dark");

  root.style.colorScheme = theme;
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const initialTheme = getInitialTheme();

    applyTheme(initialTheme);

    return initialTheme;
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  return {
    theme,
    toggleTheme,
  };
}
