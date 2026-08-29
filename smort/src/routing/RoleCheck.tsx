import { ReactElement, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { smortApi as Smort } from "../Api/smortApi";
import { Role } from "../Api/enums/Roles";
import { LoadingScreen } from "./Loading";

interface LogedInRoutes {
    NeededRol: Role
}

export const RoleCheck = ({ NeededRol }: LogedInRoutes): ReactElement => {
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
        return <LoadingScreen/>;
    }


    if (!hasRole) {
        return <Navigate to="/home" replace />
    }

    return <Outlet />

}