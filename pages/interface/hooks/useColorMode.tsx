import {
  createTheme,
  CssBaseline,
  PaletteMode,
  ThemeProvider,
} from "@mui/material";
import { blue, deepOrange, purple } from "@mui/material/colors";
import React, { useContext } from "react";

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

interface ColorModeProps {
  children: any;
}

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // palette values for light mode
          primary: blue,
          background: {
            //default: purple[900],
            paper: blue[500],
          },
          // text: {
          //   primary: '#fff',
          //   secondary: "#fff",
          // },
        }
      : {
          // palette values for dark mode
          primary: blue,
          background: {
            //default: purple[900],
            paper: blue[500],
          },
          // text: {
          //   primary: '#fff',
          //   secondary: '#fff',
          // },
        }),
  },
});

export function ColorModeProvider({ children }: ColorModeProps) {
  const [mode, setMode] = React.useState<"light" | "dark">("light");
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function useColorMode() {
  return useContext(ColorModeContext);
}
