import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./Pages/LoginPage/LoginPage";
import { HomePage } from "./Pages/HomePage";
const SiteRouter = ():JSX.Element => { 


 return(
    <BrowserRouter>
        <Routes>
            <Route path="/login"  element={ <LoginPage/> }/>
            <Route path="*"  element={ <HomePage/> }/>
        </Routes>
    </BrowserRouter>
 )
}

 export default SiteRouter;