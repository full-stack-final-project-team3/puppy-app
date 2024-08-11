import React from 'react';
import { useSelector } from 'react-redux';
import styles from './AdminPage.module.scss';
import AdminNavigation from "../../components/auth/admin/AdminNavigation";
import AdminMain from "../../components/auth/admin/AdminMain";

const AdminPage = ({ exit }) => {
    const visibleComponent = useSelector((state) => state.admin.visibleComponent);



    return (
        <div className={styles.wrap}>
            <AdminNavigation exit={exit} />
            <AdminMain visibleComponent={visibleComponent} />
        </div>
    );
};

export default AdminPage;