import { useEffect } from "react";
import { useLocation, } from "react-router-dom";

export const ForceRefresh = () => {
    const location = useLocation();
    const forceRefreshRouteKeys = ["AccountOtherUser", "MyAccount"];

    useEffect(() => {
        if (forceRefreshRouteKeys.some((key) => key === location.key)) {
            window.location.reload();
        }
    }, [location, forceRefreshRouteKeys]);

    return null;
};
