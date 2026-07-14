import Style from "./ServerIssues.module.scss";
import logo from "../SiteAssets/Smort_Logo.png"
import { ReactElement } from "react";

export const ServerIssues = ():ReactElement => {
    return <section className={Style.Page}>
        <img src={logo} className={Style.Logo}/>
        <h1>Work on the site in progress or API DOWN</h1>
    </section>
}