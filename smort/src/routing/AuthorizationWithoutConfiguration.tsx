import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { IMyProfile } from "../Api/ApiObjects/userObjects";
import { waitForAuth } from "../configs/FirebaseConfig";

import { smortApi as Smort } from "../Api/smortApi";

export const AuthorizationWithoutConfiguration = () => {
    const [user, setUser] = useState<IMyProfile | undefined>()

    const [loading, setLoading] = useState<boolean>(true)
    const navigate = useNavigate();

    const getAuth = async () => {
        const firebaseLogin = await waitForAuth();

        if (!firebaseLogin) {
            navigate('/');
            setUser(undefined)
            setLoading(false)
            return
        }

        Smort.GetMyProfileAsync()
            .then(user => {
                setUser(user)
                setLoading(false)
            })
            .catch((error) => {
                setUser(undefined)
                setLoading(false)
            });
    }

    useEffect(() => {
        if (loading) {
            getAuth();
        }
    }, [loading]);

    if (loading) {
        return <div>Loading...</div>; // Show a loading state until the check is complete
    }
    if (!user) {
        return <Navigate to="/Login" replace />
    }

    return <Outlet />
}