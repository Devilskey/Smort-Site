import React, { useEffect, useState } from "react";
import { smortApi as Smort } from "../../Api/smortApi";
import Style from "./AdminPanel.module.scss"
import { IUser } from "../../Api/ApiObjects/IUser";
import { Button, Table } from "react-bootstrap";

type NavigationOptions = "Welcome" | "ManageUsers" | "Reports" | "ManageContent";

export const AdminPanel = (): JSX.Element => {
    const User = Smort.getUser();
    // Welcome, Manage User 

    const [AdminPanelPage, setAdminPanelPage] = useState<NavigationOptions>("Welcome")

    useEffect(() => {

    }, [AdminPanelPage])

    const NavigateTo = (to: NavigationOptions) => {
        setAdminPanelPage(to)
    }

    return (
        <section className={Style.Page}>
            <header className={Style.Nav}>
                <a className={Style.NavOption} onClick={() => NavigateTo("ManageUsers")}>Manage Users</a>
                <a className={Style.NavOption} onClick={() => NavigateTo("Reports")}>Reports</a>
                <a className={Style.NavOption} onClick={() => NavigateTo("ManageContent")}>Manage Content</a>
            </header>
            <div>
                {AdminPanelPage === "Welcome" && <Welcome />}
                {AdminPanelPage === "ManageUsers" && <ManageUsers />}
                {AdminPanelPage === "Reports" && <Reports />}
                {AdminPanelPage === "ManageContent" && <ManageContent />}

            </div>

        </section>)
}

export const ManageUsers = (): JSX.Element => {
    const [Users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (loading) {
            GetUsers()
        }

    }, [loading])

    const GetUsers = async () => {
        const users = await Smort.GetAllUsers();
        console.log(users)
        setUsers(users as IUser[])
        setLoading(false)
    }

    return <div className={Style.ManageUsers}>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Created At</th>
                    <th>Allowed</th>
                    <th>Actions</th>

                </tr>

            </thead>
            <tbody>
                {Array.isArray(Users) && Users.map(user => (
                    <tr>
                        <td>{user.Id}</td>
                        <td>{user.Username}</td>
                        <td>{user.Created_At}</td>
                        <td>{user.AllowedUser ? "Allowed" : "NotAllowed"}</td>
                        <td>
                            <Button>{user.AllowedUser ? "Not Allowed" : "Allowed"}</Button>
                            <Button>Delete</Button>
                        </td>

                    </tr>
                ))}
            </tbody>

        </Table>

    </div>
}

export const Reports = (): JSX.Element => {
    const User = Smort.getUser();

    return <div >
    </div>
}

export const ManageContent = (): JSX.Element => {
    const User = Smort.getUser();

    return <div >
    </div>
}



export const Welcome = (): JSX.Element => {
    const User = Smort.getUser();

    return <div className={Style.WelcomeUser}>
        <h5> Welcome Admin : {User?.username}</h5>
    </div>
}