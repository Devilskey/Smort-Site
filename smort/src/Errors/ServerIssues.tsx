import Style from "./ServerIssues.module.scss";
import logo from "../SiteAssets/Smort_Logo.png"

export const ServerIssues = ():JSX.Element => {
    return <section className={Style.Page}>
        <img src={logo} className={Style.Logo}/>
        <h1>Work on the site in progress or API DOWN</h1>
    </section>
}