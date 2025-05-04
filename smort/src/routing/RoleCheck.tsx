import { ReactNode, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { smortApi as Smort } from "../Api/smortApi";
import { Role } from "../Api/enums/Roles";
import { IMyProfile } from "../Api/ApiObjects/userObjects";

interface LogedInRoutes {
    NeededRol: Role
}


export const RoleCheck = ({ NeededRol }: LogedInRoutes): JSX.Element => {
    const [hasRole, setHasRole] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        if (loading) {
            CheckUsersRol();
        }

    }, [loading]);

    const CheckUsersRol = (): void => {
        const role: Role = Smort.GetUserRole();

        if(Number(role) === Number(NeededRol)){
            setHasRole(true);
            setLoading(false);
        }
        setLoading(false);

    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (loading) {
        return <div>Loading...</div>; 
    }

    if (!hasRole) {
        return <Navigate to="/home" replace />
    }

    return <Outlet />

}