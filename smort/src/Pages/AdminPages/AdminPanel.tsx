import React, { ReactElement, useEffect, useState } from "react";
import { smortApi as Smort, smortApi } from "../../Api/smortApi";
import Style from "./AdminPanel.module.scss"
import { IUser } from "../../Api/ApiObjects/IUser";
import { Button, Table } from "react-bootstrap";
import { useTranslation } from "../../translations/TranslationProvider";

type NavigationOptions = "Welcome" | "ManageUsers" | "Reports" | "ManageContent";

export const AdminPanel = (): ReactElement => {
    const { t } = useTranslation();
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
                <a className={Style.NavOption} onClick={() => NavigateTo("ManageUsers")}>{t('admin.manageUsers')}</a>
                <a className={Style.NavOption} onClick={() => NavigateTo("Reports")}>{t('admin.reports')}</a>
                <a className={Style.NavOption} onClick={() => NavigateTo("ManageContent")}>{t('admin.manageContent')}</a>
            </header>
            <hr />

            <div>
                {AdminPanelPage === "Welcome" && <Welcome />}
                {AdminPanelPage === "ManageUsers" && <ManageUsers />}
                {AdminPanelPage === "Reports" && <Reports />}
                {AdminPanelPage === "ManageContent" && <ManageContent />}

            </div>
        </section>)
}

export const ManageUsers = (): ReactElement => {
    const { t } = useTranslation();
    const [Users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (loading) {
            GetUsers()
        }

    }, [loading])

    const GetUsers = async () => {
        const users = await Smort.GetAllUsers();
        setUsers(users as IUser[])
        setLoading(false)
    }

    return <div className={Style.ManageUsers}>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>{t('admin.tableNumber')}</th>
                    <th>{t('admin.tableUsername')}</th>
                    <th>{t('admin.tableCreatedAt')}</th>
                    <th>{t('admin.tableAllowed')}</th>
                    <th>{t('admin.tableActions')}</th>

                </tr>

            </thead>
            <tbody>
                {Array.isArray(Users) && Users.map(user => (
                    <tr>
                        <td>{user.Id}</td>
                        <td>{user.Username}</td>
                        <td>{user.CreatedAt}</td>
                        <td>{user.AllowedUser ? t('admin.allowed') : t('admin.notAllowed')}</td>
                        <td>
                            <Button onClick={() =>{
                                smortApi.SetUserAlow(user.Id, !user.AllowedUser);
                                user.AllowedUser =  !user.AllowedUser;
                            }}>
                                {user.AllowedUser ? t('admin.notAllowed') : t('admin.allow')}
                            </Button>
                            <Button>{t('admin.delete')}</Button>
                        </td>

                    </tr>
                ))}
            </tbody>

        </Table>

    </div>
}

export const Reports = (): ReactElement => {
    const User = Smort.getUser();

    return <div >
    </div>
}

export const ManageContent = (): ReactElement => {
    const User = Smort.getUser();

    return <div >
    </div>
}



export const Welcome = (): ReactElement => {
    const { t } = useTranslation();
    const User = Smort.getUser();

    return <div className={Style.WelcomeUser}>
        <h5>{`${t('admin.welcomeAdmin')} ${User?.username}`}</h5>
    </div>
}