import { createContext, useContext, useEffect } from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
};

const ThemeProviderContext = createContext({ theme: "light" });

export function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    document.documentElement.classList.add("light");
  }, []);

  return (
    <ThemeProviderContext.Provider value={{ theme: "light" }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  return useContext(ThemeProviderContext);
};
