import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./Pages/LoginPage/LoginPage";
import { HomePage } from "./Pages/HomePage";
import { AccountPage } from "./Pages/AccountPage/AccountPage";
const SiteRouter = ():JSX.Element => { 


 return(
    <BrowserRouter>
        <Routes>
            <Route path="/login"  element={ <LoginPage/> }/>
            <Route path="/account/:id"  element={ <AccountPage/> }/>
            <Route path="/account"  element={ <AccountPage/> }/>
            <Route path="/home/:id"  element={ <HomePage/> }/>

            <Route path="*"  element={ <HomePage/> }/>
        </Routes>
    </BrowserRouter>
 )
}

 export default SiteRouter;