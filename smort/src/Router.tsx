import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./Pages/LoginPage/LoginPage";
import { HomePage } from "./Pages/HomePage";
import { AccountPage } from "./Pages/AccountPage/AccountPage";
import { AdminPanel } from "./Pages/AdminPages/AdminPanel";
import { ForceRefresh } from "./routing/ForceRefresh";
import { AuthorizationNeededRouting } from "./routing/Authorization";
import { RoleCheck } from "./routing/RoleCheck";
import { Role } from "./Api/enums/Roles";
import { JSX } from "react";

const SiteRouter = (): JSX.Element => {
    return (
        <BrowserRouter>

            <ForceRefresh />

            <Routes>
                
                <Route path="*" element={<LoginPage />} />

                <Route element={<AuthorizationNeededRouting />}>

                    <Route path="/account/:id" element={<AccountPage />} />
                    <Route path="/account" element={<AccountPage />} />
\                    <Route path="/home" element={<HomePage />} />

                    <Route element={<RoleCheck NeededRol={Role.Admin} />}>
                        <Route path="/Smort/Admin" element={<AdminPanel />} />
                    </Route>

                </Route>
            </Routes>

        </BrowserRouter>
    );
}


export default SiteRouter;