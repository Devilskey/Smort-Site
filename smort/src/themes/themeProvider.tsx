import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";

type ThemeContextValue = {
  theme: string;
  setTheme: (theme: string) => void;
};

const defaultContext: ThemeContextValue = {
  theme: "default (dark)",
  setTheme: () => {},
};

export const ThemeContext = createContext<ThemeContextValue>(defaultContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<string>(localStorage.getItem("theme") || "default (dark)");

  document.documentElement.setAttribute("data-theme", theme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => useContext(ThemeContext);
