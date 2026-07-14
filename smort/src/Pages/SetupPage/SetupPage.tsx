import { ReactElement } from "react";

import Style from "./SetupPage.module.scss";

export const SetupPage = (): ReactElement => { 
    return (
        <div className={Style.page}>
            <h1>Setup Page</h1>
            <p>This is the setup page. Please configure your account.</p>
        </div>
    );
}