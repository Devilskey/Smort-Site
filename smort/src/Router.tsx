import { BrowserRouter, Routes, Route, useLocation, matchRoutes, useNavigate, } from "react-router-dom";
import { LoginPage } from "./Pages/LoginPage/LoginPage";
import { HomePage } from "./Pages/HomePage";
import { AccountPage } from "./Pages/AccountPage/AccountPage";
import { useEffect } from "react";
const SiteRouter = (): JSX.Element => {

    return (
        <BrowserRouter>
        <ForceRefresh/>
            <Routes>
                <Route path="/login" element={<LoginPage />} key="Login" />
                <Route path="/account/:id/" element={<AccountPage />} key="AccountOtherUser" />
                <Route path="/account" element={<AccountPage />} key="MyAccount" />
                <Route path="/home/:ContentType/:id" element={<HomePage />} key="HomeWithSelectedVideo" />

                <Route path="*" element={<HomePage />} />
            </Routes>
        </BrowserRouter>
    )
}

const ForceRefresh = () => {
    const location = useLocation();
    const forceRefreshRouteKeys = ["AccountOtherUser", "MyAccount", "HomeWithSelectedVideo"];

    useEffect(() => {
        if (forceRefreshRouteKeys.some((key) => key === location.key)) {
            window.location.reload();
        }
    }, [location]);

    return null;
  };

export const PageNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const refreshPage = () => {
        navigate(0); 
        navigate(location.pathname, { replace: true });
    };
    
    refreshPage();
    return(<></>)

}

export default SiteRouter;