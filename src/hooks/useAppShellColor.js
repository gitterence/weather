import { useEffect } from "react";

const DEFAULT_APP_SHELL_COLOR = "#334155";

const getThemeColorMeta = () => {
    let themeColorMeta = document.querySelector("meta[name='theme-color']");

    if (!themeColorMeta) {
        themeColorMeta = document.createElement("meta");
        themeColorMeta.setAttribute("name", "theme-color");
        document.head.appendChild(themeColorMeta);
    }

    return themeColorMeta;
};

export const useAppShellColor = (color = DEFAULT_APP_SHELL_COLOR) => {
    useEffect(() => {
        const themeColorMeta = getThemeColorMeta();

        themeColorMeta.removeAttribute("media");
        themeColorMeta.setAttribute("content", color);
        document.documentElement.style.setProperty("--app-shell-bg", color);
        document.documentElement.style.colorScheme = "dark";
    }, [color]);
};

