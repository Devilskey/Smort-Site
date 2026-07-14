import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./Pages/LoginPage/LoginPage";
import { HomePage } from "./Pages/HomePage";
import { AccountPage } from "./Pages/AccountPage/AccountPage";
import { AdminPanel } from "./Pages/AdminPages/AdminPanel";
import { ForceRefresh } from "./routing/ForceRefresh";
import { AuthorizationNeededRouting } from "./routing/Authorization";
import { RoleCheck } from "./routing/RoleCheck";
import { Role } from "./Api/enums/Roles";
import { ReactElement } from "react";
import { SetupPage } from "./Pages/SetupPage/SetupPage";
import { AuthorizationWithoutConfiguration } from "./routing/AuthorizationWithoutConfiguration";

const SiteRouter = (): ReactElement => {
    return (
        <BrowserRouter>

            <ForceRefresh />

            <Routes>
                
                <Route path="*" element={<LoginPage />} />

                <Route element={<AuthorizationNeededRouting />}>

                    <Route path="/account/:id" element={<AccountPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/home" element={<HomePage />} />

                    <Route element={<RoleCheck NeededRol={Role.Admin} />}>
                        <Route path="/Smort/Admin" element={<AdminPanel />} />
                    </Route>

                </Route>
                <Route element={<AuthorizationWithoutConfiguration />}>
                    <Route path="/Setup" element={<SetupPage />} />
                </Route>
                
            </Routes>

        </BrowserRouter>
    );
}


export default SiteRouter;