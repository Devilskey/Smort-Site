import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ForceRefresh = () => {
    const location = useLocation();

    useEffect(() => {
        const lastPath = sessionStorage.getItem("lastPath");

        if (
            location.pathname.startsWith("/account") &&
            lastPath !== location.pathname
        ) {
            sessionStorage.setItem("lastPath", location.pathname);
            window.location.reload();
        }
        sessionStorage.setItem("lastPath", location.pathname);

    }, [location.pathname]);

    return null;
};