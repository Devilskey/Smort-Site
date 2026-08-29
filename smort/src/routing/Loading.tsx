import { ReactElement } from "react";

import Style from "./Loading.module.scss";
import { Spinner } from "react-bootstrap";

export const LoadingScreen = ():ReactElement => {
    return <div className={Style.LoadingScreen}><Spinner/></div>;
}