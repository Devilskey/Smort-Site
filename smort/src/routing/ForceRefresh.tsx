import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const ForceRefresh = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const forceRefreshRouteKeys = ["AccountOtherUser", "MyAccount"];

    useEffect(() => {
        if (forceRefreshRouteKeys.some((key) => key === location.key)) {
            window.location.reload();
        }
    }, [location]);

    return null;
  };
