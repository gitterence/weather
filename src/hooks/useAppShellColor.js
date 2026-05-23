import { useEffect } from "react";

const DEFAULT_APP_SHELL_COLOR = "#334155";

export const useAppShellColor = (color = DEFAULT_APP_SHELL_COLOR) => {
    useEffect(() => {
        const themeColorMeta = document.querySelector("meta[name='theme-color']");

        document.documentElement.style.setProperty("--app-shell-bg", color);
        themeColorMeta?.setAttribute("content", color);

        return () => {
            document.documentElement.style.setProperty("--app-shell-bg", DEFAULT_APP_SHELL_COLOR);
            themeColorMeta?.setAttribute("content", DEFAULT_APP_SHELL_COLOR);
        };
    }, [color]);
};

