import { JSX, ReactNode, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { smortApi as Smort } from "../Api/smortApi";
import { Role } from "../Api/enums/Roles";
import { IMyProfile } from "../Api/ApiObjects/userObjects";


export const AuthorizationNeededRouting = (): JSX.Element => {
    const [user, setUser] = useState<IMyProfile | undefined>()
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        if (loading) {
            IsUserLogedIn();
        }

    }, [loading]);

    const IsUserLogedIn = (): void => {
        Smort.LoadCookies();
        if (Smort.IsLogedIn()) {
            Smort.GetMyProfileAsync()
                .then(user => {
                    console.log(user)
                    setUser(user)
                    setLoading(false)
                })
                .catch((error) => {
                    setUser(undefined)
                    setLoading(false)
                });
        }else{
            setUser(undefined)
            setLoading(false)
        };
    }

    if (loading) {
        return <div>Loading...</div>; // Show a loading state until the check is complete
    }

    if(!user){
        return <Navigate to="/Login" replace />
    }

    return <Outlet/>

}