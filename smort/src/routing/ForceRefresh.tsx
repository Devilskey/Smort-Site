import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ForceRefresh = () => {
    const location = useLocation();

    useEffect(() => {
        const lastPath = sessionStorage.getItem("lastAccountPath");

        if (
            location.pathname.startsWith("/account") &&
            lastPath !== location.pathname
        ) {
            sessionStorage.setItem("lastAccountPath", location.pathname);
            window.location.reload();
        }
    }, [location.pathname]);

    return null;
};