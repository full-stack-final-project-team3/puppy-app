import React from 'react';
import styles from './AdminPage.module.scss'
import AdminNavigation from "../../components/auth/admin/AdminNavigation";
import AdminMain from "../../components/auth/admin/AdminMain";

const AdminPage = () => {
    return (
        <div className={styles.wrap}>
            <AdminNavigation/>
            <AdminMain/>
        </div>
    );
};

export default AdminPage;